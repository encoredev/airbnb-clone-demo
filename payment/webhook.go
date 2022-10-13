package payment

import (
	"io/ioutil"
	"net/http"

	"encore.dev"
	"encore.dev/rlog"
	"github.com/stripe/stripe-go/v73"
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
		handleCheckoutSessionCompleted(w, event)
	}
}

func handleCheckoutSessionCompleted(w http.ResponseWriter, event stripe.Event) {
	// Not yet implemented.
}

// webhookSecret returns the webhook signing secret to use.
func webhookSecret() string {
	if encore.Meta().Environment.Cloud == encore.CloudLocal {
		if s := cfg.LocalWebhookSecret; s != "" {
			rlog.Info("using local override for Stripe webhook secret")
			return s
		}
	}

	return secrets.StripeWebhookSigningSecret
}
