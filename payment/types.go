package payment

import "github.com/stripe/stripe-go/v73"

type TaxCategory string

const (
	GeneralServices TaxCategory = "txcd_20030000"
)

// ProductDesc describes a product being sold.
type ProductDesc struct {
	DisplayName string
	Description string
	ImageURLs   []string
	TaxCategory TaxCategory

	Metadata map[string]string
}

type LineItem struct {
	Product      ProductDesc
	Currency     string
	UnitAmount   int64 // in cents (or local equivalent) of Currency
	Quantity     int64
	TaxExclusive bool // if true, price is exclusive of tax
}

// lineItemToStripe converts a LineItem to the Stripe equivalent.
func lineItemToStripe(it *LineItem) *stripe.CheckoutSessionLineItemParams {
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

	return &stripe.CheckoutSessionLineItemParams{
		PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
			Currency:    stripe.String(it.Currency),
			ProductData: product,
			Recurring:   nil,
			TaxBehavior: stripe.String(string(tax)),
			UnitAmount:  stripe.Int64(it.UnitAmount),
		},
		Quantity: stripe.Int64(it.Quantity),
	}
}

// lineItemFromStripe converts a Stripe LineItem to our equivalent.
func lineItemFromStripe(src *stripe.LineItem) *LineItem {
	return &LineItem{
		Currency:     string(src.Currency),
		UnitAmount:   src.Price.UnitAmount,
		Quantity:     src.Quantity,
		TaxExclusive: src.Price.TaxBehavior == stripe.PriceTaxBehaviorExclusive,
		Product: ProductDesc{
			DisplayName: src.Price.Product.Name,
			Description: src.Price.Product.Description,
			TaxCategory: TaxCategory(src.Price.Product.TaxCode.ID),
			ImageURLs:   src.Price.Product.Images,
			Metadata:    src.Price.Product.Metadata,
		},
	}
}
