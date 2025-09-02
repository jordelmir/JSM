-- Consolidated initial schema for the redemption service

-- Table for redemption aggregates
CREATE TABLE IF NOT EXISTS redemptions (
    id UUID PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- Standardizing on String for IDs
    station_id VARCHAR(255) NOT NULL,
    dispenser_id VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for the Outbox Pattern to ensure reliable event delivery
CREATE TABLE IF NOT EXISTS outbox (
    id UUID PRIMARY KEY,
    aggregate_type VARCHAR(255) NOT NULL,
    aggregate_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL, -- Using JSONB for better performance and flexibility
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table to record points credited to users
CREATE TABLE IF NOT EXISTS points_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    points_credited INT NOT NULL,
    redemption_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_redemption
        FOREIGN KEY(redemption_id)
        REFERENCES redemptions(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_ledger_user_id ON points_ledger(user_id);

-- Enable logical replication for Debezium on critical tables
ALTER TABLE redemptions REPLICA IDENTITY FULL;
ALTER TABLE outbox REPLICA IDENTITY FULL;
