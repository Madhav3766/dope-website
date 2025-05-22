-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OTP codes table for phone verification
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_phone_idx ON waitlist (phone);
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);
CREATE INDEX IF NOT EXISTS otp_codes_phone_idx ON otp_codes (phone);
CREATE INDEX IF NOT EXISTS otp_codes_expires_at_idx ON otp_codes (expires_at);

-- Add RLS policies
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Only allow server-side access to these tables
CREATE POLICY "Server-side only insert to waitlist" ON waitlist 
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Server-side only select from waitlist" ON waitlist 
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Server-side only insert to otp_codes" ON otp_codes 
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Server-side only select from otp_codes" ON otp_codes 
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Server-side only delete from otp_codes" ON otp_codes 
  FOR DELETE USING (auth.role() = 'service_role');
