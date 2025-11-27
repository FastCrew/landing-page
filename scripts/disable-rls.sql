-- ============================================
-- Disable RLS Policies for Schema Migration
-- ============================================
-- Run this BEFORE running prisma db push
-- This will temporarily disable RLS policies so Prisma can modify the schema

-- Drop all policies on profiles table
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- You can also temporarily disable RLS entirely (optional)
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Note: After running prisma db push, you'll need to recreate these policies
-- See enable-rls.sql for the recreation script
