/*
  # Disable RLS for Customers Table

  1. Changes
    - Disable Row Level Security on customers table
    - Allow all users (authenticated and anonymous) to access customers
  
  2. Rationale
    - Single-tenant application
    - Demo mode requires access without authentication
    - All users should see all customers
*/

-- Disable RLS on customers table
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (no longer needed)
DROP POLICY IF EXISTS "Anyone authenticated can view customers" ON customers;
DROP POLICY IF EXISTS "Anyone authenticated can insert customers" ON customers;
DROP POLICY IF EXISTS "Anyone authenticated can update customers" ON customers;
DROP POLICY IF EXISTS "Anyone authenticated can delete customers" ON customers;
