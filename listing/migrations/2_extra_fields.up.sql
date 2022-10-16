ALTER TABLE listings ADD location TEXT NOT NULL;
ALTER TABLE listings ADD num_beds INTEGER NOT NULL;
ALTER TABLE listings ADD num_baths INTEGER NOT NULL;
ALTER TABLE listings ADD rating REAL NOT NULL;
ALTER TABLE listings ADD tags TEXT[] NOT NULL;
ALTER TABLE listings ADD pictures TEXT[] NOT NULL;
ALTER TABLE listings ADD price_per_night INTEGER NOT NULL;
ALTER TABLE listings ADD distance_km INTEGER NOT NULL;