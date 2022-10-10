package listing

import (
	"context"
	"time"

	"encore.app/pkg/batching"
	"encore.dev/beta/auth"
)

// Listing represents a home listing.
type Listing struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string
	// Lat, Lng are the latitude and longitude of the home.
	Lat     float64   `json:"lat"`
	Lng     float64   `json:"lng"`
	HostUID auth.UID  `json:"host_uid"`
	Created time.Time `json:"created"`
}

// CreateParams are the parameters for creating a new listing.
type CreateParams struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Lat         float64 `json:"lat"`
	Lng         float64 `json:"lng"`
}

// Create creates a new listing.
//
//encore:api auth method=POST path=/listing
func (s *Service) Create(ctx context.Context, p *CreateParams) (*Listing, error) {
	host, _ := auth.UserID()
	l := &Listing{
		Title:       p.Title,
		Description: p.Description,
		HostUID:     host,
		Lat:         p.Lat,
		Lng:         p.Lng,
		Created:     time.Now(),
	}
	if err := s.db.Create(l).Error; err != nil {
		return nil, err
	}
	return l, nil
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

// MultiGet returns a list of users.
//
//encore:api private method=GET path=/listing/multi
func (s *Service) MultiGet(ctx context.Context, p *batching.GetParams[int64]) (*batching.Response[int64, Listing], error) {
	var listings []Listing
	if err := s.db.Find(&listings, p.IDs).Error; err != nil {
		return nil, err
	}
	resp := batching.NewResponse[int64, Listing]()
	for _, l := range listings {
		resp.Records[l.ID] = l
	}
	return resp, nil
}
