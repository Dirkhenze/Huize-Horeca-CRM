/*
  # Simplify RLS for All Authenticated Users

  1. Changes
    - Remove company-based restrictions on customers table
    - Allow all authenticated users to access all customers
    - Simplify for single-tenant use case
  
  2. Security
    - Still requires authentication
    - All authenticated users can access all data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON customers;

-- Create simple policies for all authenticated users
CREATE POLICY "Anyone authenticated can view customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone authenticated can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone authenticated can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone authenticated can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (true);
