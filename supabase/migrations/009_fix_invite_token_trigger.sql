-- Migration: 009_fix_invite_token_trigger
-- Description: Fix trigger to allow existing alumni to login without invite token

-- Drop and recreate the validate_invite_token function
CREATE OR REPLACE FUNCTION validate_invite_token()
RETURNS TRIGGER AS $$
DECLARE
  token_record RECORD;
  invite_token TEXT;
  existing_alumni RECORD;
BEGIN
  -- Check if alumni already exists (auto-link scenario)
  SELECT * INTO existing_alumni
  FROM alumni
  WHERE email = NEW.email;

  -- If alumni exists, they don't need an invite token (they're logging in to auto-link)
  IF FOUND THEN
    RETURN NEW;
  END IF;

  -- New user - require invite token
  invite_token := NEW.raw_user_meta_data->>'invite_token';

  -- If no invite token provided, reject
  IF invite_token IS NULL OR invite_token = '' THEN
    RAISE EXCEPTION 'Invite token required for registration';
  END IF;

  -- Check if token is valid
  SELECT * INTO token_record
  FROM invite_tokens
  WHERE token = invite_token
    AND used_by IS NULL
    AND (expires_at IS NULL OR expires_at > NOW());

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invite token';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
