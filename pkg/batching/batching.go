package batching

import (
	"context"
	"fmt"
	"strings"

	"github.com/graph-gophers/dataloader/v7"

	"encore.dev/beta/errs"
	"encore.dev/storage/sqldb"
)

type GetParams[K comparable] struct {
	IDs []K
}

type Response[K comparable, V any] struct {
	Records map[K]V
}

func NewResponse[K comparable, V any]() *Response[K, V] {
	return &Response[K, V]{
		Records: make(map[K]V),
	}
}

// Query builds a query to select all rows for a given set of ID's
func Query[K comparable](ctx context.Context, baseQuery string, ids *GetParams[K]) (*sqldb.Rows, error) {
	var query strings.Builder
	query.WriteString(baseQuery)

	query.WriteString(" IN (")
	queryParams := make([]interface{}, len(ids.IDs))
	for i := 1; i <= len(ids.IDs); i++ {
		if i > 1 {
			query.WriteString(", ")
		}
		query.WriteString(fmt.Sprintf("$%d", i))
		queryParams[i-1] = ids.IDs[i-1]
	}
	query.WriteString(")")

	return sqldb.Query(ctx, query.String(), queryParams...)
}

func FromRows[K comparable, V any](rows *sqldb.Rows, scan func(r *sqldb.Rows) (K, V, error)) (*Response[K, V], error) {
	defer rows.Close()
	resp := NewResponse[K, V]()
	for rows.Next() {
		k, v, err := scan(rows)
		if err != nil {
			return nil, err
		}
		resp.Records[k] = v
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return resp, nil
}

func Results[K comparable, V any](ids *GetParams[K], resp *Response[K, V]) []*dataloader.Result[V] {
	output := make([]*dataloader.Result[V], len(ids.IDs))
	for index, key := range ids.IDs {
		record, ok := resp.Records[key]
		if ok {
			output[index] = &dataloader.Result[V]{
				Data: record,
			}
		} else {
			output[index] = &dataloader.Result[V]{
				Error: errs.B().Code(errs.NotFound).Msg("not found").Err(),
			}
		}
	}
	return output
}

func Error[K comparable, V any](ids *GetParams[K], err error) []*dataloader.Result[V] {
	output := make([]*dataloader.Result[V], len(ids.IDs))
	for index := range ids.IDs {
		output[index] = &dataloader.Result[V]{
			Error: err,
		}
	}
	return output
}
