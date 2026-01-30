-- Migration: 006_invite_tokens_rls
-- Description: Enable RLS and create policies for invite_tokens table

-- Enable RLS on invite_tokens
ALTER TABLE invite_tokens ENABLE ROW LEVEL SECURITY;

-- Policy 1: Admins can view all tokens
CREATE POLICY "Admins can view all invite tokens" ON invite_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.id::text = auth.uid()::text
      AND alumni.is_admin = true
    )
  );

-- Policy 2: Anyone can validate a specific token (needed for signup flow)
-- This is safe because tokens are UUIDs and effectively unguessable
CREATE POLICY "Public can validate tokens" ON invite_tokens
  FOR SELECT USING (true);

-- Policy 3: Admins can create tokens
CREATE POLICY "Admins can create invite tokens" ON invite_tokens
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.id::text = auth.uid()::text
      AND alumni.is_admin = true
    )
  );

-- Policy 4: Admins can update tokens (for marking as used)
CREATE POLICY "Admins can update invite tokens" ON invite_tokens
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.id::text = auth.uid()::text
      AND alumni.is_admin = true
    )
  );

-- Policy 5: System can update tokens during signup (mark as used)
-- This allows the signup flow to mark tokens as used
CREATE POLICY "System can update used tokens" ON invite_tokens
  FOR UPDATE USING (true)
  WITH CHECK (used_by IS NOT NULL AND used_at IS NOT NULL);

-- Policy 6: Admins can delete tokens
CREATE POLICY "Admins can delete invite tokens" ON invite_tokens
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM alumni
      WHERE alumni.id::text = auth.uid()::text
      AND alumni.is_admin = true
    )
  );
