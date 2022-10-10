package graphql

import (
	"context"
	"net/http"

	"encore.app/graphql/generated"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

//go:generate go run github.com/99designs/gqlgen generate

var (
	srv     = handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &Resolver{}}))
	loaders = NewLoaders()
)

//encore:api public raw path=/graphql
func Query(w http.ResponseWriter, req *http.Request) {
	ctx := context.WithValue(req.Context(), loadersKey, loaders)
	req = req.WithContext(ctx)
	srv.ServeHTTP(w, req)
}

//encore:api public raw path=/graphql/playground
func Playground(w http.ResponseWriter, req *http.Request) {
	h := playground.Handler("GraphQL playground", "/graphql")
	h.ServeHTTP(w, req)
}
