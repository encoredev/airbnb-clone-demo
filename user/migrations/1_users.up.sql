CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    email TEXT NULL,
    display_name TEXT NULL,
    picture_url TEXT NULL,
    disabled BOOLEAN NOT NULL
);