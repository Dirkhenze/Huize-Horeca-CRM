-- VOER DIT UIT IN DE SUPABASE SQL EDITOR
-- Dit maakt een echte demo user aan in Supabase auth

-- Eerst de bestaande demo user verwijderen indien aanwezig
DELETE FROM auth.identities WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM auth.users WHERE id = '550e8400-e29b-41d4-a716-446655440001';

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
);

-- Maak de identity aan met een unieke id (LET OP: geen conflict meer!)
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
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001',
  '{"sub":"550e8400-e29b-41d4-a716-446655440001","email":"dirk.henze@huizehoreca.nl"}'::jsonb,
  'email',
  now(),
  now(),
  now()
);

-- Verifieer dat het gelukt is
SELECT
  email,
  created_at,
  raw_app_meta_data->>'company_id' as company_id
FROM auth.users
WHERE id = '550e8400-e29b-41d4-a716-446655440001';
