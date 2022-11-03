package payment

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"encore.dev"
	"encore.dev/pubsub"
	"encore.dev/rlog"
	"github.com/stripe/stripe-go/v73"
	"github.com/stripe/stripe-go/v73/checkout/session"
	"github.com/stripe/stripe-go/v73/webhook"
)

//encore:api public raw
func StripeWebhook(w http.ResponseWriter, req *http.Request) {
	const MaxBodyBytes = int64(65536)
	req.Body = http.MaxBytesReader(w, req.Body, MaxBodyBytes)
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		rlog.Error("unable to read request body", "err", err)
		http.Error(w, "error reading request body", http.StatusServiceUnavailable)
		return
	}

	event, err := webhook.ConstructEvent(body, req.Header.Get("Stripe-Signature"), webhookSecret())
	if err != nil {
		rlog.Error("unable to verify webhook signature", "err", err)
		http.Error(w, "bad request signature", http.StatusBadRequest)
		return
	}

	switch event.Type {
	case "checkout.session.completed":
		handleCheckoutSessionCompleted(req.Context(), w, event)
	}
}

func handleCheckoutSessionCompleted(ctx context.Context, w http.ResponseWriter, event stripe.Event) {
	var webhookData stripe.CheckoutSession
	err := json.Unmarshal(event.Data.Raw, &webhookData)
	if err != nil {
		rlog.Error("unable to parse webhook json", "err", err)
		http.Error(w, "unable to parse webhook json", http.StatusBadRequest)
		return
	}

	params := &stripe.CheckoutSessionParams{}
	params.AddExpand("line_items.data.price.product")
	sess, err := session.Get(webhookData.ID, params)
	if err != nil {
		rlog.Error("unable to retrieve session", "err", err)
		http.Error(w, "unable to retrieve session", http.StatusBadRequest)
		return
	}

	var items []LineItem
	for _, it := range sess.LineItems.Data {
		items = append(items, *lineItemFromStripe(it))
	}

	ev := &CheckoutCompletedEvent{
		Items: items,
	}
	msgID, err := CheckoutsCompleted.Publish(ctx, ev)
	if err != nil {
		rlog.Error("unable to publish checkout event", "err", err)
		http.Error(w, "unable to process webhook", http.StatusServiceUnavailable)
		return
	}

	rlog.Info("published checkout event",
		"msg_id", msgID,
		"session_id", sess.ID,
	)
}

// webhookSecret returns the webhook signing secret to use.
func webhookSecret() string {
	if encore.Meta().Environment.Cloud == encore.CloudLocal {
		return "whsec_159bd115f55f97603121fa8bde7d72537903f377cae03e52a36ea10d7fbd85cb"
	}
	return secrets.StripeWebhookSigningSecret
}

type CheckoutCompletedEvent struct {
	Items []LineItem
}

var CheckoutsCompleted = pubsub.NewTopic[*CheckoutCompletedEvent]("checkout-completed", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})
