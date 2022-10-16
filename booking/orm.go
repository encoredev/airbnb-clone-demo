package booking

import (
	"encore.dev/storage/sqldb"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	bookingDB = sqldb.Named("booking").Stdlib()
	db        *gorm.DB
)

func init() {
	orm, err := gorm.Open(postgres.New(postgres.Config{
		Conn: bookingDB,
	}))
	if err != nil {
		panic(err)
	}
	db = orm
}
