package user

import (
	"context"

	"encore.dev/beta/auth"
	firebase "firebase.google.com/go/v4"
	fbauth "firebase.google.com/go/v4/auth"
	"go4.org/syncutil"
	"google.golang.org/api/option"
)

type User struct {
	ID auth.UID
	// Email is the user's email.
	Email *string
	// Name is the user's name.
	DisplayName *string
	// PictureURL is the user's picture URL.
	PictureURL *string
	Disabled   bool
}

//encore:authhandler
func AuthHandler(ctx context.Context, token string) (auth.UID, *User, error) {
	if err := setupFB(); err != nil {
		return "", nil, err
	}
	tok, err := fbAuth.VerifyIDToken(ctx, token)
	if err != nil {
		return "", nil, err
	}

	email, _ := tok.Claims["email"].(string)
	name, _ := tok.Claims["name"].(string)
	picture, _ := tok.Claims["picture"].(string)
	uid := auth.UID(tok.UID)

	usr := &User{
		ID:          uid,
		Email:       toPtrOrNil(email),
		DisplayName: toPtrOrNil(name),
		PictureURL:  toPtrOrNil(picture),
	}
	return uid, usr, nil
}

func toPtrOrNil[T comparable](val T) *T {
	var zero T
	if val == zero {
		return nil
	}
	return &val
}

var (
	fbAuth    *fbauth.Client
	setupOnce syncutil.Once
)

// setupFB ensures Firebase Auth is setup.
func setupFB() error {
	return setupOnce.Do(func() error {
		opt := option.WithCredentialsJSON([]byte(secrets.FirebasePrivateKey))
		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err == nil {
			fbAuth, err = app.Auth(context.Background())
		}
		return err
	})
}

var secrets struct {
	// FirebasePrivateKey is the JSON credentials for calling Firebase.
	FirebasePrivateKey string

	// FirebaseWebhookSharedSecret is the shared secret for authenticating webhooks
	// sent from Firebase.
	FirebaseWebhookSharedSecret string
}
