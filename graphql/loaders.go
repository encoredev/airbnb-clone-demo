package graphql

import (
	"context"

	"encore.app/listing"
	"encore.app/pkg/batching"
	"encore.app/user"
	"encore.dev/beta/auth"
	"github.com/graph-gophers/dataloader/v7"
)

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

// Loaders wrap your data loaders to inject via middleware
type Loaders struct {
	users    *dataloader.Loader[auth.UID, user.User]
	listings *dataloader.Loader[int, listing.Listing]
}

// NewLoaders instantiates data loaders for the middleware
func NewLoaders() *Loaders {
	loaders := &Loaders{
		users: batchedLoader(func(ctx context.Context, ids *batching.GetParams[auth.UID]) (*batching.Response[auth.UID, user.User], error) {
			return user.MultiGet(ctx, ids)
		}),
		listings: batchedLoader(func(ctx context.Context, ids *batching.GetParams[int]) (*batching.Response[int, listing.Listing], error) {
			return listing.MultiGet(ctx, ids)
		}),
	}
	return loaders
}

// LoadersFor returns the dataloader for a given context
func LoadersFor(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}

func batchedLoader[K comparable, V any](f func(ctx context.Context, ids *batching.GetParams[K]) (*batching.Response[K, V], error)) *dataloader.Loader[K, V] {
	return dataloader.NewBatchedLoader(func(ctx context.Context, keys []K) []*dataloader.Result[V] {
		p := &batching.GetParams[K]{IDs: keys}
		resp, err := f(ctx, p)
		if err != nil {
			return batching.Error[K, V](p, err)
		}
		return batching.Results(p, resp)
	})
}
