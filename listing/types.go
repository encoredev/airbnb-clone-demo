package listing

import (
	"database/sql/driver"
	"time"

	"encore.dev/beta/auth"
	"github.com/lib/pq"
)

// Listing represents a home listing.
type Listing struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Location    string `json:"location"`
	NumBeds     int    `json:"numBeds"`
	NumBaths    int    `json:"numBaths"`
	// Lat, Lng are the latitude and longitude of the home.
	Lat           float64   `json:"lat"`
	Lng           float64   `json:"lng"`
	HostUID       auth.UID  `json:"hostUID"`
	Created       time.Time `json:"created"`
	PricePerNight int       `json:"pricePerNight"`
	Rating        float64   `json:"rating"`
	Pictures      Pictures  `json:"pictures" gorm:"type:text[]"`
	Tags          Tags      `json:"tags" gorm:"type:text[]"`
	DistanceKm    int       `json:"distanceKm"`
}

type Tags []string

func (t Tags) Value() (driver.Value, error) {
	s := pq.StringArray(t)
	return s.Value()
}

func (t *Tags) Scan(src any) error {
	var a pq.StringArray
	if err := a.Scan(src); err != nil {
		return err
	}
	*t = Tags(a)
	return nil
}

type Pictures []string

func (p Pictures) Value() (driver.Value, error) {
	s := pq.StringArray(p)
	return s.Value()
}

func (p *Pictures) Scan(src any) error {
	var a pq.StringArray
	if err := a.Scan(src); err != nil {
		return err
	}
	*p = Pictures(a)
	return nil
}
