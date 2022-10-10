package usertest

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"testing"

	"encore.app/user"
	"encore.dev/beta/auth"
	"encore.dev/storage/sqldb"
)

var userDB = sqldb.Named("user")

// CreateUser creates a new test user in the user database and returns it,
// alongside with a context used for authenticating as that user.
func CreateUser(t *testing.T) (context.Context, *user.User) {
	t.Helper()
	uid := GenUID(t)
	email := fmt.Sprintf("%s@example.org", uid)
	name := string(uid)
	u := &user.User{
		ID:          uid,
		Email:       &email,
		DisplayName: &name,
		PictureURL:  nil,
	}

	ctx := context.Background()

	_, err := userDB.Exec(ctx, `
		INSERT INTO users (id, email, display_name, picture_url)
		VALUES ($1, $2, $3, $4)
	`, u.ID, u.Email, u.DisplayName, u.PictureURL)
	if err != nil {
		t.Fatalf("unable to create test user: %v", err)
	}
	return auth.WithContext(ctx, uid, u), u
}

// GenUID generates a random user id.
func GenUID(t *testing.T) auth.UID {
	t.Helper()
	var data [16]byte
	if _, err := rand.Read(data[:]); err != nil {
		t.Fatal(err)
	}
	sha := sha256.Sum256(data[:])
	return auth.UID(hex.EncodeToString(sha[:])[:16])
}
