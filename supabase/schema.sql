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
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  google_event_id TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_availability_alumni ON availability_slots(alumni_id);
CREATE INDEX idx_availability_day ON availability_slots(day_of_week);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_sessions_alumni ON sessions(alumni_id);
CREATE INDEX idx_sessions_status ON sessions(status);

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
