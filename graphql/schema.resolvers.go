package graphql

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"encore.app/graphql/generated"
	"encore.app/listing"
	"encore.app/user"
	"encore.dev/beta/auth"
)

// Host is the resolver for the host field.
func (r *listingResolver) Host(ctx context.Context, obj *listing.Listing) (*user.User, error) {
	return resolveUser(ctx, obj.HostUID)
}

// Listings is the resolver for the listings field.
func (r *queryResolver) Listings(ctx context.Context) ([]*listing.Listing, error) {
	listings, err := listing.List(ctx)
	if err != nil {
		return nil, err
	}
	return listings.Listings, nil
}

// Listing returns generated.ListingResolver implementation.
func (r *Resolver) Listing() generated.ListingResolver { return &listingResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type listingResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//   - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//     it when you're done.
//   - You have helper methods in this file. Move them out to keep these resolver files clean.
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
