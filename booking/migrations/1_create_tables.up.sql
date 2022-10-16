CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL,
    guest_uid TEXT NOT NULL,
    checkin DATE NOT NULL,
    checkout DATE NOT NULL
);

CREATE INDEX ON bookings (guest_uid);