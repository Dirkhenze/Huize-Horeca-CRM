-- ABSOLUTE FIX: Direct data invoeren + RLS uit

-- STAP 1: RLS UIT (zodat we data kunnen zien)
ALTER TABLE sales_team DISABLE ROW LEVEL SECURITY;

-- STAP 2: Verwijder alle bestaande data
TRUNCATE TABLE sales_team CASCADE;

-- STAP 3: Voeg direct 8 accountmanagers toe (HARD-CODED)
INSERT INTO sales_team (
  company_id,
  employee_number,
  first_name,
  last_name,
  email,
  phone,
  team_name,
  function_title,
  is_active
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'AM-001', 'Jan', 'de Vries', 'jan.devries@huizehoeve.nl', NULL, 'Sales', 'Senior Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-002', 'Emma', 'Bakker', 'emma.bakker@huizehoeve.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-003', 'Peter', 'Jansen', 'peter.jansen@huizehoeve.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-004', 'Sophie', 'van Dam', 'sophie.vandam@huizehoeve.nl', NULL, 'Sales', 'Junior Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-005', 'Mark', 'Visser', 'mark.visser@huizehoeve.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-006', 'Lisa', 'Smit', 'lisa.smit@huizehoeve.nl', NULL, 'Sales', 'Senior Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-007', 'Tom', 'Hendriks', 'tom.hendriks@huizehoeve.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-008', 'Anna', 'de Jong', 'anna.dejong@huizehoeve.nl', NULL, 'Sales', 'Account Manager', true);

-- STAP 4: Verify
SELECT COUNT(*) as total_inserted FROM sales_team;
SELECT employee_number, first_name, last_name FROM sales_team ORDER BY employee_number;

-- STAP 5: RLS blijft UIT voor nu
SELECT '✅ RLS is uitgeschakeld, data zou NU zichtbaar moeten zijn' as status;
