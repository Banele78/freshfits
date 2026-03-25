-- V20260204_01_add_address_indexes.sql
-- Add index for faster user address queries
-- Add index for faster user address queries
CREATE INDEX idx_address_user_createdat_desc
ON addresses(user_id, created_at DESC);

CREATE INDEX idx_address_user_id ON addresses(user_id);

