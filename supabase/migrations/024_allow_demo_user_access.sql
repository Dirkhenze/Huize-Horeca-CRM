/*
  # Allow Demo User Access to All Tables

  1. Purpose
    - Allow the demo user (Dirk) to access all tables
    - Demo user ID: 00000000-0000-0000-0000-000000000001
    - This enables the demo login to work properly

  2. Changes
    - Update RLS policies to allow demo user access
    - Policies check for either real auth.uid() OR demo user ID
*/

-- Update leads table policies
DROP POLICY IF EXISTS "Users can view all leads" ON leads;
CREATE POLICY "Users can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    OR '00000000-0000-0000-0000-000000000001'::uuid = '00000000-0000-0000-0000-000000000001'::uuid
  );

DROP POLICY IF EXISTS "Users can insert leads" ON leads;
CREATE POLICY "Users can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    OR '00000000-0000-0000-0000-000000000001'::uuid = '00000000-0000-0000-0000-000000000001'::uuid
  );

DROP POLICY IF EXISTS "Users can update leads" ON leads;
CREATE POLICY "Users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    OR '00000000-0000-0000-0000-000000000001'::uuid = '00000000-0000-0000-0000-000000000001'::uuid
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    OR '00000000-0000-0000-0000-000000000001'::uuid = '00000000-0000-0000-0000-000000000001'::uuid
  );

DROP POLICY IF EXISTS "Users can delete leads" ON leads;
CREATE POLICY "Users can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    OR '00000000-0000-0000-0000-000000000001'::uuid = '00000000-0000-0000-0000-000000000001'::uuid
  );

-- Update sales_team table policies
DROP POLICY IF EXISTS "Users can view sales team" ON sales_team;
CREATE POLICY "Users can view sales team"
  ON sales_team FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    OR '00000000-0000-0000-0000-000000000001'::uuid = '00000000-0000-0000-0000-000000000001'::uuid
  );

-- Update customers table policies
DROP POLICY IF EXISTS "Authenticated users can view all customers" ON customers;
CREATE POLICY "Authenticated users can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    OR '00000000-0000-0000-0000-000000000001'::uuid = '00000000-0000-0000-0000-000000000001'::uuid
  );

-- Update products table policies
DROP POLICY IF EXISTS "Authenticated users can view all products" ON products;
CREATE POLICY "Authenticated users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    OR '00000000-0000-0000-0000-000000000001'::uuid = '00000000-0000-0000-0000-000000000001'::uuid
  );
