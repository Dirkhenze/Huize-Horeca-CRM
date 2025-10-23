-- Check if sales_team data exists
SELECT 
  'sales_team' as table_name,
  COUNT(*) as total_count,
  COUNT(CASE WHEN company_id = '00000000-0000-0000-0000-000000000001' THEN 1 END) as demo_company_count
FROM sales_team;

-- Show first 3 sales team members
SELECT id, first_name, last_name, email, company_id, is_active
FROM sales_team
LIMIT 3;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'sales_team';
