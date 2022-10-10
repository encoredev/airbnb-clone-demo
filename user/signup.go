package user

import (
	"context"
	"crypto/subtle"

	"encore.dev/beta/errs"
	"encore.dev/storage/sqldb"
)

type BeforeCreateWebhookParams struct {
	SharedSecret string `header:"X-Shared-Secret"`
	User         *User
}

// BeforeCreateWebhook processes webhooks from Firebase when a user is created.
//
//encore:api public
func BeforeCreateWebhook(ctx context.Context, p *BeforeCreateWebhookParams) error {
	// Make sure the secret is the one we expect.
	if subtle.ConstantTimeCompare([]byte(p.SharedSecret), []byte(secrets.FirebaseWebhookSharedSecret)) != 1 {
		return &errs.Error{Code: errs.InvalidArgument, Message: "invalid webhook secret"}
	}

	u := p.User
	_, err := sqldb.Exec(ctx, `
		INSERT INTO "user" (id, email, display_name, picture_url, disabled)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (id) DO UPDATE
		SET email = $2, display_name = $3, picture_url = $4, disabled = $5
	`, u.ID, u.Email, u.DisplayName, u.PictureURL, u.Disabled)
	return err
}
