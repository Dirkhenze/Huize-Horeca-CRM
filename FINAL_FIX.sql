-- DEFINITIEVE FIX - Voer dit uit in Supabase SQL Editor

-- STAP 1: Drop ALLE policies
DROP POLICY IF EXISTS "allow_all_sales_team" ON sales_team;
DROP POLICY IF EXISTS "sales_team_select_policy" ON sales_team;
DROP POLICY IF EXISTS "sales_team_insert_policy" ON sales_team;
DROP POLICY IF EXISTS "sales_team_update_policy" ON sales_team;
DROP POLICY IF EXISTS "sales_team_delete_policy" ON sales_team;

-- STAP 2: Schakel RLS UIT (tijdelijk voor development)
ALTER TABLE sales_team DISABLE ROW LEVEL SECURITY;

-- STAP 3: Verify data is er
SELECT COUNT(*) as total_rows FROM sales_team;

-- STAP 4: Toon alle data
SELECT employee_number, first_name, last_name, email FROM sales_team ORDER BY employee_number;
