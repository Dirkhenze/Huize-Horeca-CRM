-- ============================================
-- FIX VOOR ACCOUNTMANAGERS DROPDOWN
-- ============================================
-- Voer deze SQL uit in de Supabase SQL Editor
-- Link: https://0ec90b57d6e95fcbda19832f.supabase.co/project/_/sql
-- ============================================

-- Stap 1: Verwijder oude RLS policies
DROP POLICY IF EXISTS "tenant_select_team_members" ON team_members;
DROP POLICY IF EXISTS "tenant_insert_team_members" ON team_members;
DROP POLICY IF EXISTS "tenant_update_team_members" ON team_members;
DROP POLICY IF EXISTS "tenant_delete_team_members" ON team_members;

-- Stap 2: Maak nieuwe simpele policies aan
CREATE POLICY "Authenticated users can view all team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update team members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (true);

-- Stap 3: Voeg demo accountmanagers toe (als ze nog niet bestaan)
INSERT INTO team_members (company_id, first_name, last_name, email, phone, employee_number, department, role, is_active)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  first_name,
  last_name,
  email,
  phone,
  employee_number,
  department,
  'sales',
  true
FROM (VALUES
  ('Arie', 'Ouwerkerk', 'arie.ouwerkerk@huizehoreca.nl', '0612345601', 'HH001', 'Verkoop'),
  ('Binnendienst', '', 'binnendienst@huizehoreca.nl', '0612345602', 'HH002', 'Binnendienst'),
  ('Bobby', 'Klein', 'bobby.klein@huizehoreca.nl', '0612345603', 'HH003', 'Verkoop'),
  ('Dirk', 'Henze', 'dirk.henze@huizehoreca.nl', '0612345604', 'HH004', 'Verkoop'),
  ('Emile', 'Metekohy', 'emile.metekohy@huizehoreca.nl', '0612345605', 'HH005', 'Verkoop'),
  ('Maarten', 'Baas', 'maarten.baas@huizehoreca.nl', '0612345606', 'HH006', 'Verkoop'),
  ('Patrick', 'Wiersema', 'patrick.wiersema@huizehoreca.nl', '0612345607', 'HH007', 'Verkoop'),
  ('Paul', 'van Bennekom', 'paul.bennekom@huizehoreca.nl', '0612345608', 'HH008', 'Verkoop'),
  ('Ron', 'van der Wurf', 'ron.wurf@huizehoreca.nl', '0612345609', 'HH009', 'Verkoop'),
  ('Slijterij Man', 'Van Drank', 'man.drank@huizehoreca.nl', '0612345610', 'HH010', 'Slijterij')
) AS t(first_name, last_name, email, phone, employee_number, department)
WHERE NOT EXISTS (
  SELECT 1 FROM team_members WHERE employee_number = t.employee_number
);

-- Stap 4: Controleer het resultaat
SELECT
  id,
  first_name,
  last_name,
  email,
  employee_number,
  role,
  is_active
FROM team_members
WHERE role = 'sales' AND is_active = true
ORDER BY first_name;
