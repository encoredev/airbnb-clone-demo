package payment

import (
	"context"

	"github.com/stripe/stripe-go/v73"
	"github.com/stripe/stripe-go/v73/checkout/session"
)

type CreateCheckoutSessionParams struct {
	Items []LineItem
}

type CreateCheckoutSessionResponse struct {
	// TargetURL is the target URL to redirect to.
	TargetURL string
}

//encore:api private
func CreateCheckoutSession(ctx context.Context, p *CreateCheckoutSessionParams) (*CreateCheckoutSessionResponse, error) {
	params := &stripe.CheckoutSessionParams{
		Mode:         stripe.String(string(stripe.CheckoutSessionModePayment)),
		SuccessURL:   stripe.String("http://localhost:3000/success"),
		CancelURL:    stripe.String("http://localhost:3000/cancel"),
		AutomaticTax: &stripe.CheckoutSessionAutomaticTaxParams{Enabled: stripe.Bool(true)},
	}

	for _, it := range p.Items {
		tax := stripe.PriceTaxBehaviorInclusive
		if it.TaxExclusive {
			tax = stripe.PriceTaxBehaviorExclusive
		}

		product := &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
			Name:        stripe.String(it.Product.DisplayName),
			Description: stripe.String(it.Product.Description),
			TaxCode:     stripe.String(string(it.Product.TaxCategory)),
			Metadata:    it.Product.Metadata,
		}
		for _, img := range it.Product.ImageURLs {
			product.Images = append(product.Images, stripe.String(img))
		}

		params.LineItems = append(params.LineItems, &stripe.CheckoutSessionLineItemParams{
			PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
				Currency:    stripe.String(it.Currency),
				ProductData: product,
				Recurring:   nil,
				TaxBehavior: stripe.String(string(tax)),
				UnitAmount:  stripe.Int64(it.UnitAmount),
			},
			Quantity: stripe.Int64(it.Quantity),
		})
	}

	s, err := session.New(params)
	if err != nil {
		return nil, err
	}
	return &CreateCheckoutSessionResponse{
		TargetURL: s.URL,
	}, nil
}

var secrets struct {
	// StripeAPIKey is the API key to use to talk to Stripe.
	StripeAPIKey string
	// StripeWebhookSigningSecret is the webhook signing secret
	// for accepting incoming webhooks.
	StripeWebhookSigningSecret string
}

func init() {
	stripe.Key = secrets.StripeAPIKey
}