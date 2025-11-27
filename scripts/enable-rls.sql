-- ============================================
-- Re-enable RLS Policies After Schema Migration
-- ============================================
-- Run this AFTER running prisma db push
-- This will recreate the RLS policies for the profiles table

-- Enable RLS on the table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = id);

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid()::text = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- Optional: Allow public read access to profiles (if needed)
-- CREATE POLICY "Enable read access for all users"
-- ON profiles
-- FOR SELECT
-- TO public
-- USING (true);

-- Note: Adjust these policies based on your application's security requirements
