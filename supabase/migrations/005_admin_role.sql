-- Migration: 005_admin_role
-- Description: Add admin role for managing invite tokens through the website

-- Add is_admin field to alumni
ALTER TABLE alumni ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Update invite_tokens.created_by to reference alumni
-- First, clear any existing text values (if any)
UPDATE invite_tokens SET created_by = NULL WHERE created_by IS NOT NULL;

-- Change column type to UUID
ALTER TABLE invite_tokens
  ALTER COLUMN created_by TYPE UUID USING created_by::uuid;

-- Add foreign key constraint
ALTER TABLE invite_tokens
  ADD CONSTRAINT invite_tokens_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES alumni(id);

-- =====================================================
-- IMPORTANT: Make yourself an admin after running this
-- =====================================================
-- UPDATE alumni SET is_admin = true WHERE email = 'your-email@example.com';
