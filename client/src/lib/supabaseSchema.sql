-- User Profiles Table for AI Sprint Planner
-- Run this in your Supabase SQL editor to create the table

CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(100),
  team_size VARCHAR(50),
  experience_level VARCHAR(50),
  preferred_tools TEXT[], -- Array of strings
  age_group VARCHAR(50),
  country VARCHAR(100),
  primary_goal TEXT,
  referral_source VARCHAR(100),
  notifications_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on clerk_user_id for faster lookups
CREATE INDEX idx_user_profiles_clerk_user_id ON user_profiles(clerk_user_id);

-- Disable Row Level Security for now (since we're using Clerk, not Supabase Auth)
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Alternative: Enable RLS but allow all operations for authenticated users
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow all operations on user_profiles (since we handle auth with Clerk)
CREATE POLICY "Allow all operations on user_profiles" ON user_profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
