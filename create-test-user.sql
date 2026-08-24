-- Create test owner account
-- Run this in Supabase SQL Editor

-- First, we need to create the auth user manually
-- Supabase uses pgcrypto for password hashing
-- Password: 000000

-- Insert into auth.users (this is the Supabase auth table)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'aaaaaaaa-bbbb-cccc-dddd-111111111111'::uuid,
  'authenticated',
  'authenticated',
  'shreyasgupta1502@gmail.com',
  crypt('000000', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"GOD","role":"owner"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Then insert the profile
INSERT INTO public.profiles (id, cafe_id, full_name, email, role)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-111111111111',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'GOD',
  'shreyasgupta1502@gmail.com',
  'owner'
);
