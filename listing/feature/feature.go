package feature

// ID is a unique ID for the feature.
type ID string

type Type string

const (
	// Bool represents boolean features, that a listing either has or has not.
	Bool Type = "bool"
	// Int represents integer features, that a listing has an integer value of.
	Int Type = "int"
)

// Desc describes a particular feature.
type Desc struct {
	ID    ID
	Type  Type
	Group string
}

type FilterOp string

const (
	Eq FilterOp = "eq"
	Ge FilterOp = "ge"
	Le FilterOp = "le"
)

// Filter describes a particular filtering of values.
type Filter struct {
	ID    ID // the feature to filter
	Op    FilterOp
	Value int
}

// Match reports whether a listing with the given values matches a set of filters.
func Match(values map[ID]int, filters ...Filter) (matches bool) {
	for _, f := range filters {
		val := values[f.ID]
		var result bool
		switch f.Op {
		case Eq:
			result = val == f.Value
		case Ge:
			result = val >= f.Value
		case Le:
			result = val <= f.Value
		default:
			// Unknown op; treat as no match.
			result = false
		}
		if !result {
			return false
		}
	}
	return true
}
