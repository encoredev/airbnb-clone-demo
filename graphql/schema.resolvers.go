package graphql

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"encore.app/graphql/generated"
	"encore.app/listing"
	"encore.app/user"
)

// Host is the resolver for the host field.
func (r *listingResolver) Host(ctx context.Context, obj *listing.Listing) (*user.User, error) {
	return resolveUser(ctx, obj.HostUID)
}

// Pictures is the resolver for the pictures field.
func (r *listingResolver) Pictures(ctx context.Context, obj *listing.Listing) ([]string, error) {
	return []string(obj.Pictures), nil
}

// Tags is the resolver for the tags field.
func (r *listingResolver) Tags(ctx context.Context, obj *listing.Listing) ([]string, error) {
	return []string(obj.Tags), nil
}

// Listings is the resolver for the listings field.
func (r *queryResolver) Listings(ctx context.Context) ([]*listing.Listing, error) {
	listings, err := listing.List(ctx)
	if err != nil {
		return nil, err
	}
	return listings.Listings, nil
}

// GetListing gets a single listing.
func (r *queryResolver) GetListing(ctx context.Context, id int) (*listing.Listing, error) {
	return resolveListing(ctx, id)
}

// Listing returns generated.ListingResolver implementation.
func (r *Resolver) Listing() generated.ListingResolver { return &listingResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type listingResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
