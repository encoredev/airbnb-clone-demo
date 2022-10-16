package graphql

import (
	"context"

	"encore.app/listing"
	"encore.app/user"
	"encore.dev/beta/auth"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{}

func resolveUser(ctx context.Context, id auth.UID) (*user.User, error) {
	if id == "" {
		return nil, nil
	}
	u, err := LoadersFor(ctx).users.Load(ctx, id)()
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func resolveListing(ctx context.Context, id int) (*listing.Listing, error) {
	if id == 0 {
		return nil, nil
	}
	u, err := LoadersFor(ctx).listings.Load(ctx, id)()
	if err != nil {
		return nil, err
	}
	return &u, nil
}
