package payment

import "encore.dev/config"

type Config struct {
	Foo *struct {
		UseFirebaseEmulator bool
	}
}

var Cfg = config.Load[Config]()
