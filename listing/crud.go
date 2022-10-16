package listing

import (
	"context"
	"math"
	"time"

	"encore.app/pkg/batching"
	"encore.dev/beta/auth"
)

// Create creates a new listing.
//
//encore:api public method=POST path=/listing
func (s *Service) Create(ctx context.Context, p *Listing) (*Listing, error) {
	// Set fields the user should not control.
	p.ID = 0
	p.Created = time.Now()
	p.HostUID, _ = auth.UserID()
	p.Rating = math.Round(p.Rating*100) / 100
	if err := s.db.Table("listings").Create(p).Error; err != nil {
		return nil, err
	}

	return p, nil
}

type ListResponse struct {
	Listings []*Listing
}

// List returns all listings.
//
//encore:api auth method=GET path=/listing
func (s *Service) List(ctx context.Context) (*ListResponse, error) {
	var listings []*Listing
	if err := s.db.Order("created DESC").Find(&listings).Error; err != nil {
		return nil, err
	}
	return &ListResponse{Listings: listings}, nil
}

// MultiGet returns a list of listings.
//
//encore:api private method=GET path=/listing/multi
func (s *Service) MultiGet(ctx context.Context, p *batching.GetParams[int]) (*batching.Response[int, Listing], error) {
	var listings []Listing
	if err := s.db.Find(&listings, p.IDs).Error; err != nil {
		return nil, err
	}
	resp := batching.NewResponse[int, Listing]()
	for _, l := range listings {
		resp.Records[l.ID] = l
	}
	return resp, nil
}

// Get returns a listing by id.
//
//encore:api private method=GET path=/listing/single/:id
func (s *Service) Get(ctx context.Context, id int) (*Listing, error) {
	var l Listing
	if err := s.db.Find(&l, id).Error; err != nil {
		return nil, err
	}
	return &l, nil
}
