-- FIX LEADS TABLE RLS
-- Voer dit uit in de Supabase SQL Editor

-- Drop all existing policies on leads
DROP POLICY IF EXISTS "Users can view leads from their company" ON leads;
DROP POLICY IF EXISTS "Users can insert leads for their company" ON leads;
DROP POLICY IF EXISTS "Users can update leads from their company" ON leads;
DROP POLICY IF EXISTS "Users can delete leads from their company" ON leads;
DROP POLICY IF EXISTS "Users can view all leads" ON leads;
DROP POLICY IF EXISTS "Users can insert leads" ON leads;
DROP POLICY IF EXISTS "Users can update leads" ON leads;
DROP POLICY IF EXISTS "Users can delete leads" ON leads;

-- Disable RLS on leads table temporarily
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Confirm it worked
SELECT 'RLS disabled for leads table' AS status;
