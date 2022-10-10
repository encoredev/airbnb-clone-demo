package user

import (
	"context"

	"encore.dev/beta/auth"
	"encore.dev/storage/sqldb"
)

// User represents a user, who is either a host or a guest.
type User struct {
	ID auth.UID
	// Email is the user's email.
	Email *string
	// Name is the user's name.
	DisplayName *string
	// PictureURL is the user's picture URL.
	PictureURL *string
}

// Get returns a user by their uid.
//
//encore:api private path=/user/:uid
func Get(ctx context.Context, uid string) (*User, error) {
	var u User
	err := sqldb.QueryRow(ctx, `
		SELECT id, email, display_name, picture_url
		FROM users
		WHERE id = $1
	`, uid).Scan(&u.ID, &u.Email, &u.DisplayName, &u.PictureURL)
	if err != nil {
		return nil, err
	}
	return &u, nil
}
