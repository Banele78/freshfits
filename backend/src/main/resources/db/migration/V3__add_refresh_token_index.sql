-- Ensure quick lookup by token + expiry date
CREATE INDEX idx_refresh_tokens_token_expiry
ON refresh_token (token, expiry_date);
