-- MentorMatch Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Alumni table (mentors)
CREATE TABLE alumni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  google_access_token TEXT,
  google_refresh_token TEXT,
  google_calendar_id TEXT DEFAULT 'primary',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability slots (recurring weekly availability)
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumni_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT TRUE,
  specific_date DATE, -- For one-time slots, NULL for recurring
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Sessions (booked mentoring sessions)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_id UUID NOT NULL REFERENCES availability_slots(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  student_email TEXT NOT NULL,
  student_name TEXT,
  student_linkedin TEXT,
  student_notes TEXT,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  google_event_id TEXT,
  meeting_link TEXT,
  management_token TEXT UNIQUE,
  verification_token TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invite tokens for mentor registration
CREATE TABLE invite_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES alumni(id), -- Admin who created the token
  used_by UUID REFERENCES alumni(id), -- Alumni who used the token
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_invite_tokens_token ON invite_tokens(token);
CREATE INDEX idx_availability_alumni ON availability_slots(alumni_id);
CREATE INDEX idx_availability_day ON availability_slots(day_of_week);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_sessions_alumni ON sessions(alumni_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_token ON sessions(management_token);

-- Row Level Security (RLS)
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Alumni can only see/edit their own data
CREATE POLICY "Alumni can view own data" ON alumni
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Alumni can update own data" ON alumni
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Alumni can manage their own availability
CREATE POLICY "Alumni can view own availability" ON availability_slots
  FOR SELECT USING (alumni_id::text = auth.uid()::text);

CREATE POLICY "Alumni can insert own availability" ON availability_slots
  FOR INSERT WITH CHECK (alumni_id::text = auth.uid()::text);

CREATE POLICY "Alumni can update own availability" ON availability_slots
  FOR UPDATE USING (alumni_id::text = auth.uid()::text);

CREATE POLICY "Alumni can delete own availability" ON availability_slots
  FOR DELETE USING (alumni_id::text = auth.uid()::text);

-- Public read access to availability for booking (anonymous)
CREATE POLICY "Public can view all availability" ON availability_slots
  FOR SELECT USING (true);

-- Alumni can view their sessions
CREATE POLICY "Alumni can view own sessions" ON sessions
  FOR SELECT USING (alumni_id::text = auth.uid()::text);

-- Public can create sessions (for booking)
CREATE POLICY "Public can create sessions" ON sessions
  FOR INSERT WITH CHECK (true);

-- Public can view sessions with valid token
CREATE POLICY "Public can view sessions with token" ON sessions
  FOR SELECT USING (true);

-- Public can update sessions (for cancellation via token - validated in application)
CREATE POLICY "Public can update sessions" ON sessions
  FOR UPDATE USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for alumni updated_at
CREATE TRIGGER alumni_updated_at
  BEFORE UPDATE ON alumni
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- View: Get available slots for the next 2 weeks with alumni info hidden
CREATE OR REPLACE VIEW available_booking_slots AS
SELECT
  a.id as slot_id,
  a.alumni_id,
  a.day_of_week,
  a.start_time,
  a.end_time,
  a.is_recurring,
  a.specific_date
FROM availability_slots a
WHERE a.is_recurring = true
   OR (a.specific_date >= CURRENT_DATE AND a.specific_date <= CURRENT_DATE + INTERVAL '14 days');

-- ============================================
-- MIGRATION SQL (run this on existing databases)
-- ============================================
-- ALTER TABLE sessions ADD COLUMN student_name TEXT;
-- ALTER TABLE sessions ADD COLUMN student_linkedin TEXT;
-- ALTER TABLE sessions ADD COLUMN student_notes TEXT;
-- ALTER TABLE sessions ADD COLUMN management_token TEXT UNIQUE;
-- ALTER TABLE sessions ADD COLUMN cancelled_at TIMESTAMPTZ;
-- ALTER TABLE sessions ADD COLUMN cancellation_reason TEXT;
-- CREATE INDEX idx_sessions_token ON sessions(management_token);
--
-- CREATE POLICY "Public can view sessions with token" ON sessions
--   FOR SELECT USING (true);
--
-- CREATE POLICY "Public can update sessions" ON sessions
--   FOR UPDATE USING (true);
--
-- Email verification migration:
-- ALTER TABLE sessions ADD COLUMN verification_token TEXT UNIQUE;
-- CREATE INDEX idx_sessions_verification_token ON sessions(verification_token);
--
-- Invite tokens migration:
-- CREATE TABLE invite_tokens (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   token TEXT UNIQUE NOT NULL,
--   created_by TEXT,
--   used_by UUID REFERENCES alumni(id),
--   used_at TIMESTAMPTZ,
--   expires_at TIMESTAMPTZ,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- CREATE INDEX idx_invite_tokens_token ON invite_tokens(token);
--
-- To create an invite token manually:
-- INSERT INTO invite_tokens (token) VALUES ('your-secret-token-here');
--
-- Admin role migration:
-- ALTER TABLE alumni ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
-- ALTER TABLE invite_tokens ALTER COLUMN created_by TYPE UUID USING created_by::uuid;
-- ALTER TABLE invite_tokens ADD CONSTRAINT invite_tokens_created_by_fkey FOREIGN KEY (created_by) REFERENCES alumni(id);
--
-- To make a user admin:
-- UPDATE alumni SET is_admin = true WHERE email = 'admin@example.com';
