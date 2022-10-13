package payment

import "encore.dev/config"

type Config struct {
	Checkout struct {
		SuccessURL string
		CancelURL  string
	}

	// LocalWebhookSecret if set, provides a temporary override of the
	// Stripe webhook signing secret to facilitate local development.
	// It is ignored for non-local environments.
	LocalWebhookSecret string `json:",omitempty"`
}

var cfg = config.Load[Config]()
