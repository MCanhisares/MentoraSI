-- Migration: 003_email_verification
-- Description: Add email verification for USP students booking sessions

-- Add verification token for email verification flow
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS verification_token TEXT UNIQUE;

-- Create index for verification token lookups
CREATE INDEX IF NOT EXISTS idx_sessions_verification_token ON sessions(verification_token);

-- Update default status to 'pending' for new sessions (they become 'confirmed' after email verification)
-- Note: This only affects the default, existing data is not changed
ALTER TABLE sessions ALTER COLUMN status SET DEFAULT 'pending';
