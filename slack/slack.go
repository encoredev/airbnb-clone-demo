package slack

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"encore.app/listing"
	"encore.app/payment"

	"encore.dev/pubsub"
)

type NotifyParams struct {
	Text string `json:"text"`
}

//encore:api private
func Notify(ctx context.Context, p *NotifyParams) error {
	reqBody, err := json.Marshal(p)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, "POST", secrets.SlackWebhookURL, bytes.NewReader(reqBody))
	if err != nil {
		return err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("notify slack: %s: %s", resp.Status, body)
	}
	return nil
}

var _ = pubsub.NewSubscription(payment.CheckoutsCompleted, "slack-notification", pubsub.SubscriptionConfig[*payment.CheckoutCompletedEvent]{
	Handler: func(ctx context.Context, event *payment.CheckoutCompletedEvent) error {
		if len(event.Items) == 0 {
			return fmt.Errorf("no line items")
		}
		md := event.Items[0].Product.Metadata
		listingID, err := strconv.Atoi(md["listing_id"])
		if err != nil {
			return err
		}

		l, err := listing.Get(ctx, listingID)
		if err != nil {
			return err
		}

		msg := fmt.Sprintf("Booking of *%s* completed", l.Title)
		return Notify(ctx, &NotifyParams{
			Text: msg,
		})
	},
})

var secrets struct {
	SlackWebhookURL string
}
