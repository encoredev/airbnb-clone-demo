package graphql

import (
	"context"
	"net/http"

	"encore.app/graphql/generated"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

//go:generate go run github.com/99designs/gqlgen generate

//encore:service
type Service struct {
	loaders    *Loaders
	srv        *handler.Server
	playground http.Handler
}

func initService() (*Service, error) {
	loaders := NewLoaders()
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &Resolver{}}))
	pg := playground.Handler("GraphQL Playground", "/graphql")
	return &Service{loaders, srv, pg}, nil
}

//encore:api public raw path=/graphql
func (s *Service) Query(w http.ResponseWriter, req *http.Request) {
	ctx := context.WithValue(req.Context(), loadersKey, s.loaders)
	req = req.WithContext(ctx)
	s.srv.ServeHTTP(w, req)
}

//encore:api public raw path=/graphql/playground
func (s *Service) Playground(w http.ResponseWriter, req *http.Request) {
	s.playground.ServeHTTP(w, req)
}
