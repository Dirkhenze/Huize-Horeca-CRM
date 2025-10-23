/*
  # Migreer Account Managers naar Sales Team

  1. Data Migratie
    - Kopieer alle records van `team_members` naar `sales_team`
    - Inclusief alle accountmanagers en sales users

  2. Verificatie
    - Toon aantal gemigreerde records
*/

-- Kopieer alle team members naar sales_team
INSERT INTO sales_team (
  id,
  company_id,
  user_id,
  first_name,
  last_name,
  email,
  phone,
  mobile,
  role,
  function_title,
  employee_number,
  is_active,
  created_at,
  updated_at
)
SELECT
  id,
  company_id,
  user_id,
  first_name,
  last_name,
  email,
  phone,
  mobile,
  role,
  department as function_title,
  employee_number,
  is_active,
  created_at,
  updated_at
FROM team_members
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  user_id = EXCLUDED.user_id,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  mobile = EXCLUDED.mobile,
  role = EXCLUDED.role,
  function_title = EXCLUDED.function_title,
  employee_number = EXCLUDED.employee_number,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Verificatie
SELECT
  'Team Members migratie voltooid' as status,
  COUNT(*) as totaal_gemigreerd
FROM sales_team;
