-- Migration Status Check Script
-- Run this to monitor the progress of the Supabase Auth migration

-- 1. Overall migration status
SELECT
  COUNT(*) as total_alumni,
  COUNT(*) FILTER (WHERE auth_user_id IS NOT NULL) as migrated,
  COUNT(*) FILTER (WHERE auth_user_id IS NULL) as pending,
  ROUND(100.0 * COUNT(*) FILTER (WHERE auth_user_id IS NOT NULL) / COUNT(*), 2) as percent_migrated
FROM alumni;

-- 2. List of unmigrated users
SELECT
  email,
  name,
  is_admin,
  created_at,
  CASE
    WHEN google_refresh_token IS NOT NULL THEN 'Has Calendar'
    ELSE 'No Calendar'
  END as calendar_status
FROM alumni
WHERE auth_user_id IS NULL
ORDER BY created_at DESC;

-- 3. Recent auth.users created
SELECT
  id,
  email,
  created_at,
  raw_user_meta_data->>'invite_token' as invite_token_used
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 4. Invite token usage
SELECT
  COUNT(*) as total_tokens,
  COUNT(*) FILTER (WHERE used_by IS NOT NULL) as used_tokens,
  COUNT(*) FILTER (WHERE used_by IS NULL) as available_tokens,
  COUNT(*) FILTER (WHERE expires_at IS NOT NULL AND expires_at < NOW()) as expired_tokens
FROM invite_tokens;

-- 5. Recently used invite tokens
SELECT
  it.token,
  it.used_at,
  a.email as used_by_email,
  a.name as used_by_name,
  CASE
    WHEN a.auth_user_id IS NOT NULL THEN 'Migrated to Supabase Auth'
    ELSE 'Old cookie auth'
  END as auth_status
FROM invite_tokens it
LEFT JOIN alumni a ON a.id = it.used_by
WHERE it.used_at IS NOT NULL
ORDER BY it.used_at DESC
LIMIT 10;

-- 6. Verify RLS policies are in place
SELECT
  schemaname,
  tablename,
  policyname,
  CASE
    WHEN cmd = 'r' THEN 'SELECT'
    WHEN cmd = 'a' THEN 'INSERT'
    WHEN cmd = 'w' THEN 'UPDATE'
    WHEN cmd = 'd' THEN 'DELETE'
    ELSE cmd
  END as command
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('alumni', 'availability_slots', 'sessions', 'invite_tokens')
ORDER BY tablename, policyname;

-- 7. Check for any alumni without auth_user_id but with recent activity
SELECT
  a.email,
  a.name,
  COUNT(s.id) as upcoming_sessions,
  MAX(s.session_date) as next_session_date
FROM alumni a
LEFT JOIN sessions s ON s.alumni_id = a.id AND s.session_date >= CURRENT_DATE
WHERE a.auth_user_id IS NULL
GROUP BY a.id, a.email, a.name
HAVING COUNT(s.id) > 0
ORDER BY MAX(s.session_date);
