-- Migration: 010_disable_before_trigger
-- Description: Remove BEFORE INSERT trigger and move validation to AFTER INSERT

-- Drop the BEFORE INSERT trigger that's blocking user creation
DROP TRIGGER IF EXISTS validate_invite_token_trigger ON auth.users;

-- Update the AFTER INSERT trigger to handle validation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_alumni RECORD;
  invite_token TEXT;
  token_record RECORD;
  new_alumni_id UUID;
BEGIN
  -- Extract email and invite token
  invite_token := NEW.raw_user_meta_data->>'invite_token';

  -- Check if alumni already exists (migration case)
  SELECT * INTO existing_alumni
  FROM alumni
  WHERE email = NEW.email;

  IF FOUND THEN
    -- Link existing alumni to auth user
    UPDATE alumni
    SET auth_user_id = NEW.id
    WHERE id = existing_alumni.id;

    RETURN NEW;
  END IF;

  -- New user - validate invite token
  IF invite_token IS NULL OR invite_token = '' THEN
    -- Delete the auth user that was just created
    DELETE FROM auth.users WHERE id = NEW.id;
    RAISE EXCEPTION 'Invite token required for registration';
  END IF;

  -- Check if token is valid
  SELECT * INTO token_record
  FROM invite_tokens
  WHERE token = invite_token
    AND used_by IS NULL
    AND (expires_at IS NULL OR expires_at > NOW());

  IF NOT FOUND THEN
    -- Delete the auth user that was just created
    DELETE FROM auth.users WHERE id = NEW.id;
    RAISE EXCEPTION 'Invalid or expired invite token';
  END IF;

  -- Create new alumni record
  INSERT INTO alumni (auth_user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  RETURNING id INTO new_alumni_id;

  -- Mark invite token as used
  UPDATE invite_tokens
  SET used_by = new_alumni_id,
      used_at = NOW()
  WHERE token = invite_token;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
