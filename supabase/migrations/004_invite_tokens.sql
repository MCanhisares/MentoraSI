-- Migration: 004_invite_tokens
-- Description: Add invite tokens for controlled mentor registration

-- Create invite tokens table
CREATE TABLE IF NOT EXISTS invite_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  created_by TEXT, -- Will be updated to UUID in migration 005
  used_by UUID REFERENCES alumni(id),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for token lookups
CREATE INDEX IF NOT EXISTS idx_invite_tokens_token ON invite_tokens(token);

-- Example: Create an invite token manually
-- INSERT INTO invite_tokens (token) VALUES ('your-secret-token-here');
--
-- Or with expiration:
-- INSERT INTO invite_tokens (token, expires_at) VALUES ('another-token', NOW() + INTERVAL '7 days');
