CREATE TABLE amenity (
    id TEXT PRIMARY KEY,
    -- Whether to show the feature crossed out if it's missing
    -- (as opposed to hiding it).
    show_if_missing BOOLEAN NOT NULL,
    -- Whether to show filters for this 
    show_in_filter BOOLEAN NOT NULL,
    title TEXT NOT NULL,
    description TEXT NULL,
    icon TEXT NOT NULL
);