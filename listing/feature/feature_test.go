package feature

import "testing"

func TestMatch(t *testing.T) {
	vals := map[ID]int{
		"home_type/shared_room": 1,
		"bedrooms":              2,
	}

	minTwoBeds := Filter{
		ID:    "bedrooms",
		Op:    Ge,
		Value: 2,
	}
	hasWholePlace := Filter{
		ID:    "home_type/whole_place",
		Op:    Eq,
		Value: 1,
	}
	if !Match(vals, minTwoBeds) {
		t.Errorf("Match(vals, minTwoBeds) = false, want true")
	}
	if Match(vals, minTwoBeds, hasWholePlace) {
		t.Errorf("Match(vals, minTwoBeds, hasWholePlace) = true, want false")
	}
}
