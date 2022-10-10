package listing

import (
	"encore.dev/storage/sqldb"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

//encore:service
type Service struct {
	db *gorm.DB
}

var listingDB = sqldb.Named("listing").Stdlib()

func initService() (*Service, error) {
	db, err := gorm.Open(postgres.New(postgres.Config{
		Conn: listingDB,
	}))
	if err != nil {
		return nil, err
	}
	return &Service{db: db}, nil
}
