-- Migration: 007_fix_session_policies
-- Description: Remove overly permissive policies and rely on service role for public operations

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Public can view sessions with token" ON sessions;
DROP POLICY IF EXISTS "Public can update sessions" ON sessions;

-- The "Public can create sessions" policy is fine - students need to book sessions
-- Alumni policies are fine - they can view their own sessions

-- For token-based access (email verification, cancel/reschedule), use the service role key
-- in your API routes instead of permissive RLS policies. This is more secure because:
-- 1. RLS policies protect data from unauthorized access through the regular client
-- 2. Service role operations are controlled by your API logic
-- 3. You validate tokens in code before performing operations
