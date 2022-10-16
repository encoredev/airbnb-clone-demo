package listing

import (
	"testing"
	"time"

	"encore.app/user/usertest"
	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
)

func TestCreate(t *testing.T) {
	ctx, usr := usertest.CreateUser(t)
	listing, err := Create(ctx, &Listing{
		Title:       "title",
		Description: "description",
		Lat:         1, Lng: 2,
	})
	if err != nil {
		t.Fatal(err)
	}

	if listing.HostUID != usr.ID {
		t.Fatalf("bad host user id %q", listing.HostUID)
	}
}

func TestList(t *testing.T) {
	ctx, _ := usertest.CreateUser(t)
	a := must(Create(ctx, &Listing{
		Title:       "one",
		Description: "foo",
		Lat:         1, Lng: 2,
	}))
	b := must(Create(ctx, &Listing{
		Title:       "two",
		Description: "bar",
		Lat:         3, Lng: 4,
	}))

	resp, err := List(ctx)
	if err != nil {
		t.Fatal(err)
	}

	// Check that the response contains a and b
	var found [2]bool
	for _, ln := range resp.Listings {
		switch ln.ID {
		case a.ID:
			if diff := cmp.Diff(ln, a, cmpopts.EquateApproxTime(10*time.Millisecond)); diff != "" {
				t.Errorf("mismatch for listing a:\n%s", diff)
			}
			found[0] = true
		case b.ID:
			if diff := cmp.Diff(ln, b, cmpopts.EquateApproxTime(10*time.Millisecond)); diff != "" {
				t.Errorf("mismatch for listing b:\n%s", diff)
			}
			found[1] = true
		default:
			continue
		}
	}
	if !found[0] || !found[1] {
		t.Fatalf("wanted a and b in list, but is missing: %+v", found)
	}
}

func must[V any](val V, err error) V {
	if err != nil {
		panic(err)
	}
	return val
}
