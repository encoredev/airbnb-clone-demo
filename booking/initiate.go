package booking

import (
	"context"
	"fmt"
	"math"
	"strconv"
	"time"

	"encore.app/listing"
	"encore.app/payment"
	"encore.app/user"
	"encore.dev/beta/auth"
	"encore.dev/rlog"
)

type InitiateParams struct {
	ListingID int    `json:"listingID"`
	Checkin   string `json:"checkin"`
	Checkout  string `json:"checkout"`
	Guests    int    `json:"guests"`
}

type InitiateResponse struct {
	RedirectURL string
}

//encore:api public
func Initiate(ctx context.Context, p *InitiateParams) (*InitiateResponse, error) {
	listing, err := listing.Get(ctx, p.ListingID)
	if err != nil {
		return nil, err
	}

	guestUID, _ := auth.UserID()
	guest, _ := auth.Data().(*user.User)

	numDays, err := daysBetweenDates(p.Checkin, p.Checkout)
	if err != nil {
		rlog.Error("invalid checkin/checkout format",
			"checkin", p.Checkin, "checkout", p.Checkout,
			"err", err)
		return nil, err
	} else if numDays < 1 {
		rlog.Error("invalid checkin/checkout dates",
			"checkin", p.Checkin, "checkout", p.Checkout)
		return nil, fmt.Errorf("checkout before checkin")
	}

	var imageURLs []string
	if len(listing.Pictures) > 0 {
		imageURLs = []string{listing.Pictures[0]}
	}

	sess, err := payment.CreateCheckoutSession(ctx, &payment.CreateCheckoutSessionParams{
		CustomerEmail: guest.Email,
		Items: []payment.LineItem{
			{
				Currency:     "sek",
				UnitAmount:   int64(numDays * listing.PricePerNight * 100),
				Quantity:     int64(1),
				TaxExclusive: false,
				Product: payment.ProductDesc{
					DisplayName: "Stay at " + listing.Title,
					Description: fmt.Sprintf("From %s to %s", p.Checkin, p.Checkout),
					ImageURLs:   imageURLs,
					TaxCategory: payment.GeneralServices,
					Metadata: map[string]string{
						"listing_id": strconv.Itoa(p.ListingID),
						"checkin":    p.Checkin,
						"checkout":   p.Checkout,
						"guest_uid":  string(guestUID),
						"guests":     strconv.Itoa(p.Guests),
					},
				},
			},
		},
	})
	if err != nil {
		return nil, err
	}
	return &InitiateResponse{RedirectURL: sess.TargetURL}, nil
}

func daysBetweenDates(from, to string) (int, error) {
	const format = "2006-01-02"
	a, err := time.Parse(format, from)
	if err != nil {
		return 0, err
	}
	b, err := time.Parse(format, to)
	if err != nil {
		return 0, err
	}

	// Use round to deal with daylight savings differences
	return int(math.Round(b.Sub(a).Hours() / 24)), nil
}
