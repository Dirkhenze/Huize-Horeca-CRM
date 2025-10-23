/*
  # Add Missing Account Managers

  ## Overview
  Adds missing account managers to the team_members table for the demo company.

  ## Changes
  - Adds Ron van der Wurf (already exists as 'Ron van den Wurf', update name)
  - Adds Arie Ouwerkerk (new)
  - Updates 'Man van Drank' to 'Slijterij Man Van Drank'

  ## Notes
  - All account managers are assigned to sales role
  - Email addresses follow naming convention
*/

-- Update existing Ron van den Wurf to Ron van der Wurf
UPDATE team_members
SET last_name = 'van der Wurf'
WHERE company_id = '00000000-0000-0000-0000-000000000001'
  AND first_name = 'Ron'
  AND last_name = 'van den Wurf';

-- Add Arie Ouwerkerk if not exists
INSERT INTO team_members (company_id, first_name, last_name, email, phone, role, employee_number, department, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Arie', 'Ouwerkerk', 'arie.ouwerkerk@huizehoreca.nl', '0612345620', 'sales', 'HH020', 'Verkoop', true)
ON CONFLICT (company_id, employee_number) DO NOTHING;

-- Update Man van Drank to full name
UPDATE team_members
SET first_name = 'Slijterij Man', last_name = 'Van Drank'
WHERE company_id = '00000000-0000-0000-0000-000000000001'
  AND employee_number = 'HH008';
