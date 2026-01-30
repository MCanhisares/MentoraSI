-- Migration: 008_supabase_auth_integration
-- Description: Integrate Supabase Auth with existing alumni table
-- Enables dual-mode authentication during migration period

-- =====================================================
-- Step 1: Add auth_user_id column to alumni table
-- =====================================================

ALTER TABLE alumni ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_alumni_auth_user_id ON alumni(auth_user_id);

-- =====================================================
-- Step 2: Trigger to validate invite token before user creation
-- =====================================================

CREATE OR REPLACE FUNCTION validate_invite_token()
RETURNS TRIGGER AS $$
DECLARE
  token_record RECORD;
  invite_token TEXT;
BEGIN
  -- Extract invite_token from raw_user_meta_data
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

-- Create trigger on auth.users BEFORE INSERT
-- Note: This only runs for NEW users, not existing ones logging in
DROP TRIGGER IF EXISTS validate_invite_token_trigger ON auth.users;
CREATE TRIGGER validate_invite_token_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION validate_invite_token();

-- =====================================================
-- Step 3: Trigger to link/create alumni after user creation
-- =====================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_alumni RECORD;
  invite_token TEXT;
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
  ELSE
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
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users AFTER INSERT
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
CREATE TRIGGER handle_new_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- Step 4: Update RLS policies to use auth.uid()
-- =====================================================

-- Drop old alumni policies
DROP POLICY IF EXISTS "Alumni can view own data" ON alumni;
DROP POLICY IF EXISTS "Alumni can update own data" ON alumni;

-- Create new alumni policies using auth_user_id
CREATE POLICY "Alumni can view own data" ON alumni
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Alumni can update own data" ON alumni
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Drop old availability policies
DROP POLICY IF EXISTS "Alumni can view own availability" ON availability_slots;
DROP POLICY IF EXISTS "Alumni can insert own availability" ON availability_slots;
DROP POLICY IF EXISTS "Alumni can update own availability" ON availability_slots;
DROP POLICY IF EXISTS "Alumni can delete own availability" ON availability_slots;

-- Create new availability policies
CREATE POLICY "Alumni can view own availability" ON availability_slots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.id = availability_slots.alumni_id
      AND alumni.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Alumni can insert own availability" ON availability_slots
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.id = availability_slots.alumni_id
      AND alumni.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Alumni can update own availability" ON availability_slots
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.id = availability_slots.alumni_id
      AND alumni.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Alumni can delete own availability" ON availability_slots
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.id = availability_slots.alumni_id
      AND alumni.auth_user_id = auth.uid()
    )
  );

-- Drop old session policies
DROP POLICY IF EXISTS "Alumni can view own sessions" ON sessions;

-- Create new session policy
CREATE POLICY "Alumni can view own sessions" ON sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.id = sessions.alumni_id
      AND alumni.auth_user_id = auth.uid()
    )
  );

-- Drop old invite token admin policies
DROP POLICY IF EXISTS "Admins can view all invite tokens" ON invite_tokens;
DROP POLICY IF EXISTS "Admins can create invite tokens" ON invite_tokens;
DROP POLICY IF EXISTS "Admins can update invite tokens" ON invite_tokens;
DROP POLICY IF EXISTS "Admins can delete invite tokens" ON invite_tokens;

-- Create new invite token admin policies
CREATE POLICY "Admins can view all invite tokens" ON invite_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.auth_user_id = auth.uid()
      AND alumni.is_admin = true
    )
  );

CREATE POLICY "Admins can create invite tokens" ON invite_tokens
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.auth_user_id = auth.uid()
      AND alumni.is_admin = true
    )
  );

CREATE POLICY "Admins can update invite tokens" ON invite_tokens
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.auth_user_id = auth.uid()
      AND alumni.is_admin = true
    )
  );

CREATE POLICY "Admins can delete invite tokens" ON invite_tokens
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.auth_user_id = auth.uid()
      AND alumni.is_admin = true
    )
  );

-- =====================================================
-- Verification queries (run after migration)
-- =====================================================

-- Check migration status:
-- SELECT
--   COUNT(*) FILTER (WHERE auth_user_id IS NOT NULL) as migrated,
--   COUNT(*) FILTER (WHERE auth_user_id IS NULL) as pending
-- FROM alumni;

-- Make yourself admin (replace with your email):
-- UPDATE alumni SET is_admin = true WHERE email = 'your-email@example.com';
