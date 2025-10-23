-- Voeg de 8 accountmanagers toe aan sales_team tabel
INSERT INTO sales_team (
  first_name,
  last_name,
  email,
  phone,
  employee_number,
  function_title,
  team_name,
  is_active,
  company_id
) VALUES
  ('Dirk', 'Henze', 'dirk@huizehanze.nl', '+31612345678', 'AM001', 'Accountmanager', 'Verkoop', true, '00000000-0000-0000-0000-000000000001'),
  ('Jan', 'de Vries', 'jan@huizehanze.nl', '+31612345679', 'AM002', 'Accountmanager', 'Verkoop', true, '00000000-0000-0000-0000-000000000001'),
  ('Pieter', 'Bakker', 'pieter@huizehanze.nl', '+31612345680', 'AM003', 'Accountmanager', 'Verkoop', true, '00000000-0000-0000-0000-000000000001'),
  ('Klaas', 'Jansen', 'klaas@huizehanze.nl', '+31612345681', 'AM004', 'Accountmanager', 'Verkoop', true, '00000000-0000-0000-0000-000000000001'),
  ('Henk', 'Visser', 'henk@huizehanze.nl', '+31612345682', 'AM005', 'Accountmanager', 'Verkoop', true, '00000000-0000-0000-0000-000000000001'),
  ('Willem', 'Smit', 'willem@huizehanze.nl', '+31612345683', 'AM006', 'Accountmanager', 'Verkoop', true, '00000000-0000-0000-0000-000000000001'),
  ('Gerrit', 'de Jong', 'gerrit@huizehanze.nl', '+31612345684', 'AM007', 'Accountmanager', 'Verkoop', true, '00000000-0000-0000-0000-000000000001'),
  ('Freek', 'Mulder', 'freek@huizehanze.nl', '+31612345685', 'AM008', 'Accountmanager', 'Verkoop', true, '00000000-0000-0000-0000-000000000001')
ON CONFLICT (email) DO NOTHING;

-- Check resultaat
SELECT 
  id,
  first_name,
  last_name,
  email,
  employee_number,
  function_title,
  team_name,
  is_active
FROM sales_team
ORDER BY employee_number;
