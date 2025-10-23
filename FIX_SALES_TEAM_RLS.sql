-- DEBUG EN FIX: Sales Team Data + RLS
-- Dit script controleert en lost alle problemen op

-- ==========================================
-- STAP 1: Check of data er is
-- ==========================================
SELECT
  'Step 1: Checking existing data' as step,
  COUNT(*) as total_rows
FROM sales_team;

SELECT * FROM sales_team LIMIT 3;

-- ==========================================
-- STAP 2: Check RLS policies
-- ==========================================
SELECT
  'Step 2: Current RLS policies' as step,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'sales_team';

-- ==========================================
-- STAP 3: Drop alle bestaande policies
-- ==========================================
DROP POLICY IF EXISTS "allow_all_sales_team" ON sales_team;
DROP POLICY IF EXISTS "Users can view sales team" ON sales_team;
DROP POLICY IF EXISTS "Users can insert sales team" ON sales_team;
DROP POLICY IF EXISTS "Users can update sales team" ON sales_team;
DROP POLICY IF EXISTS "Users can delete sales team" ON sales_team;

-- ==========================================
-- STAP 4: Create nieuwe OPEN policies
-- ==========================================

-- SELECT policy - iedereen mag lezen
CREATE POLICY "sales_team_select_policy"
  ON sales_team
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT policy - iedereen mag toevoegen
CREATE POLICY "sales_team_insert_policy"
  ON sales_team
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE policy - iedereen mag updaten
CREATE POLICY "sales_team_update_policy"
  ON sales_team
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE policy - iedereen mag verwijderen
CREATE POLICY "sales_team_delete_policy"
  ON sales_team
  FOR DELETE
  TO authenticated
  USING (true);

-- ==========================================
-- STAP 5: Verify policies zijn toegepast
-- ==========================================
SELECT
  'Step 5: New RLS policies' as step,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'sales_team'
ORDER BY cmd;

-- ==========================================
-- STAP 6: Test query (zoals frontend doet)
-- ==========================================
SELECT
  'Step 6: Test query results' as step,
  COUNT(*) as count
FROM sales_team;

SELECT
  employee_number,
  first_name,
  last_name,
  email,
  team_name,
  function_title
FROM sales_team
ORDER BY employee_number
LIMIT 5;

-- ==========================================
-- CONCLUSIE
-- ==========================================
SELECT '✅ RLS policies zijn nu open voor authenticated users' as status;
SELECT '✅ Frontend zou nu data moeten kunnen ophalen' as status;
