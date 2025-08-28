-- V1__initial_schema.sql

CREATE TABLE IF NOT EXISTS redemptions (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    station_id VARCHAR(255) NOT NULL,
    dispenser_id VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL,
    timestamp BIGINT NOT NULL,
    expiration BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS points_ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Assuming UUID for ID
    user_id VARCHAR(255) NOT NULL,
    points_credited INT NOT NULL,
    redemption_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_redemption
        FOREIGN KEY(redemption_id)
        REFERENCES redemptions(id)
);

CREATE TABLE IF NOT EXISTS outbox (
    id UUID PRIMARY KEY,
    aggregate_type VARCHAR(255) NOT NULL,
    aggregate_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);