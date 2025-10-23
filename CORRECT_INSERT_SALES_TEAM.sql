-- CORRECTE INSERT voor sales_team
-- Gebruikt de juiste kolomnamen uit de tabel definitie

-- Verwijder bestaande data (optioneel)
DELETE FROM sales_team WHERE company_id = '00000000-0000-0000-0000-000000000001';

-- Insert 8 sales team members met CORRECTE kolom namen
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
  ('00000000-0000-0000-0000-000000000001', 'AM-001', 'Jan', 'de Vries', 'jan.devries@huizehoeve.nl', '+31 6 1234 5601', 'Sales', 'Senior Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-002', 'Emma', 'Bakker', 'emma.bakker@huizehoeve.nl', '+31 6 1234 5602', 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-003', 'Peter', 'Jansen', 'peter.jansen@huizehoeve.nl', '+31 6 1234 5603', 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-004', 'Sophie', 'van Dam', 'sophie.vandam@huizehoeve.nl', '+31 6 1234 5604', 'Sales', 'Junior Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-005', 'Mark', 'Visser', 'mark.visser@huizehoeve.nl', '+31 6 1234 5605', 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-006', 'Lisa', 'Smit', 'lisa.smit@huizehoeve.nl', '+31 6 1234 5606', 'Sales', 'Senior Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-007', 'Tom', 'Hendriks', 'tom.hendriks@huizehoeve.nl', '+31 6 1234 5607', 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-008', 'Anna', 'de Groot', 'anna.degroot@huizehoeve.nl', '+31 6 1234 5608', 'Sales', 'Junior Account Manager', true);

-- Verificatie
SELECT
  'Data inserted successfully!' as status,
  COUNT(*) as total_members
FROM sales_team
WHERE company_id = '00000000-0000-0000-0000-000000000001';

-- Toon alle members
SELECT
  employee_number,
  first_name,
  last_name,
  email,
  team_name,
  function_title,
  is_active
FROM sales_team
WHERE company_id = '00000000-0000-0000-0000-000000000001'
ORDER BY employee_number;
