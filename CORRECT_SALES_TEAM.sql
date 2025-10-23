-- Correct Sales Team Data voor Huize Horeca

-- STAP 1: Verwijder fictieve data
TRUNCATE TABLE sales_team CASCADE;

-- STAP 2: Voeg ECHTE accountmanagers toe
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
  ('00000000-0000-0000-0000-000000000001', 'AM-001', 'Arie', 'Ouwerkerk', 'arie.ouwerkerk@huizehoreca.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-002', 'Bobby', 'Klein', 'bobby.klein@huizehoreca.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-003', 'Dirk', 'Henze', 'dirk.henze@huizehoreca.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-004', 'Emile', 'Metekohy', 'emile.metekohy@huizehoreca.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-005', 'Maarten', 'Baas', 'maarten.baas@huizehoreca.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-006', 'Patrick', 'Wiersema', 'patrick.wiersema@huizehoreca.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-007', 'Paul', 'van Bennekom', 'paul.vanbennekom@huizehoreca.nl', NULL, 'Sales', 'Account Manager', true),
  ('00000000-0000-0000-0000-000000000001', 'AM-008', 'Ron', 'van der Wurf', 'ron.vanderwurf@huizehoreca.nl', NULL, 'Sales', 'Account Manager', true);

-- STAP 3: Verify
SELECT COUNT(*) as total_accountmanagers FROM sales_team;
SELECT first_name, last_name, email FROM sales_team ORDER BY last_name;

SELECT '✅ Correcte sales team data ingevoerd' as status;
