-- CREATE DEMO USER IN SUPABASE AUTH
-- Voer dit uit in de Supabase SQL Editor

-- Maak een demo user aan in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'authenticated',
  'authenticated',
  'dirk.henze@huizehoreca.nl',
  crypt('Promdech?1980', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"],"company_id":"00000000-0000-0000-0000-000000000001"}'::jsonb,
  '{"first_name":"Dirk","last_name":"Henze"}'::jsonb,
  false,
  '',
  '',
  ''
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Maak de identity aan
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  '{"sub":"550e8400-e29b-41d4-a716-446655440001","email":"dirk.henze@huizehoreca.nl"}'::jsonb,
  'email',
  now(),
  now(),
  now()
)
ON CONFLICT (provider, id) DO NOTHING;

SELECT 'Demo user created: dirk.henze@huizehoreca.nl with password: Promdech?1980' AS result;
