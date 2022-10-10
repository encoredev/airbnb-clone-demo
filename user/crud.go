package user

import (
	"context"

	"encore.app/pkg/batching"
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

// MultiGet returns a list of users.
//
//encore:api private method=GET path=/user/multi
func MultiGet(ctx context.Context, p *batching.GetParams[auth.UID]) (*batching.Response[auth.UID, User], error) {
	rows, err := batching.Query(ctx, `
		SELECT id, email, display_name, picture_url
		FROM users
		WHERE id
	`, p)
	if err != nil {
		return nil, err
	}
	return batching.FromRows(rows, func(r *sqldb.Rows) (auth.UID, User, error) {
		var u User
		err := rows.Scan(&u.ID, &u.Email, &u.DisplayName, &u.PictureURL)
		return u.ID, u, err
	})
}
