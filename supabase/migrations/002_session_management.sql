-- Migration: 002_session_management
-- Description: Add student info fields and management tokens for cancel/reschedule functionality

-- Add student information fields
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS student_linkedin TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS student_notes TEXT;

-- Add management token for cancel/reschedule links
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS management_token TEXT UNIQUE;

-- Add cancellation tracking
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Create index for management token lookups
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(management_token);

-- Allow public to view sessions (for token-based access)
CREATE POLICY "Public can view sessions with token" ON sessions
  FOR SELECT USING (true);

-- Allow public to update sessions (for cancellation via token - validated in application)
CREATE POLICY "Public can update sessions" ON sessions
  FOR UPDATE USING (true);
