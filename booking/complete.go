package booking

import (
	"context"
	"fmt"
	"strconv"

	"encore.app/payment"
	"encore.dev/beta/auth"
	"encore.dev/pubsub"
	"encore.dev/rlog"
)

type Booking struct {
	ID        int      `json:"id"`
	ListingID int      `json:"listingID"`
	GuestUID  auth.UID `json:"guest_uid"`
	Checkin   string   `json:"checkin"`
	Checkout  string   `json:"checkout"`
}

var _ = pubsub.NewSubscription(payment.CheckoutsCompleted, "bookings", pubsub.SubscriptionConfig[*payment.CheckoutCompletedEvent]{
	Handler: func(ctx context.Context, event *payment.CheckoutCompletedEvent) error {
		if len(event.Items) == 0 {
			return fmt.Errorf("no line items")
		}
		md := event.Items[0].Product.Metadata
		listingID, err := strconv.Atoi(md["listing_id"])
		if err != nil {
			return err
		}
		checkin := md["checkin"]
		checkout := md["checkout"]
		guestUID := auth.UID(md["guest_uid"])

		// if guestUID == "" {
		// 	return fmt.Errorf("missing guest_uid in product metadata")
		if checkin == "" || checkout == "" {
			return fmt.Errorf("missing checkin/checkout in product metadata")
		}

		b := &Booking{
			ListingID: listingID,
			GuestUID:  guestUID,
			Checkin:   checkin,
			Checkout:  checkout,
		}
		if err := db.Create(b).Error; err != nil {
			return err
		}

		rlog.Info("created booking", "id", b.ID)
		return nil
	},
})
