-- DELETE existing data and INSERT fresh sales team members
-- Run this in Supabase SQL Editor

-- Step 1: Delete any existing data
DELETE FROM sales_team WHERE company_id = '00000000-0000-0000-0000-000000000001';

-- Step 2: Insert sales team members
INSERT INTO sales_team (
  company_id,
  employee_number,
  first_name,
  last_name,
  email,
  phone,
  team,
  function,
  is_active
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'AM-001', 'Jan', 'de Vries', 'jan.devries@huizehoeve.nl', '+31 6 1234 5601', 'Sales', 'Senior Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-002', 'Emma', 'Bakker', 'emma.bakker@huizehoeve.nl', '+31 6 1234 5602', 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-003', 'Peter', 'Jansen', 'peter.jansen@huizehoeve.nl', '+31 6 1234 5603', 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-004', 'Sophie', 'van Dam', 'sophie.vandam@huizehoeve.nl', '+31 6 1234 5604', 'Sales', 'Junior Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-005', 'Mark', 'Visser', 'mark.visser@huizehoeve.nl', '+31 6 1234 5605', 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-006', 'Lisa', 'Smit', 'lisa.smit@huizehoeve.nl', '+31 6 1234 5606', 'Sales', 'Senior Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-007', 'Tom', 'Hendriks', 'tom.hendriks@huizehoeve.nl', '+31 6 1234 5607', 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-008', 'Anna', 'de Groot', 'anna.degroot@huizehoeve.nl', '+31 6 1234 5608', 'Sales', 'Junior Account Manager', true);

-- Step 3: Verify the data was inserted
SELECT
  'Sales team members inserted: ' || COUNT(*) as status,
  COUNT(*) as total_members
FROM sales_team
WHERE company_id = '00000000-0000-0000-0000-000000000001';

-- Step 4: Show all inserted members
SELECT
  employee_number,
  first_name,
  last_name,
  email,
  team,
  function,
  is_active
FROM sales_team
WHERE company_id = '00000000-0000-0000-0000-000000000001'
ORDER BY employee_number;
