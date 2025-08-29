-- V1__create_redemption_schema.sql

CREATE TABLE IF NOT EXISTS redemptions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    station_id UUID NOT NULL,
    coupon_id UUID NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS points_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    points_credited INT NOT NULL,
    source VARCHAR(100) NOT NULL, -- e.g., 'redemption', 'bonus'
    redemption_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX idx_points_ledger_user_id ON points_ledger(user_id);
