-- ==========================================
-- SALES TEAM SETUP - Voer dit uit in Supabase Dashboard → SQL Editor
-- ==========================================

-- STAP 1: Maak de sales_team tabel aan
CREATE TABLE IF NOT EXISTS sales_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,

  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  mobile text,

  role text DEFAULT 'sales',
  function_title text,
  team_name text,
  employee_number text,

  is_active boolean DEFAULT true,
  notes text,
  avatar_url text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexen
CREATE INDEX IF NOT EXISTS idx_sales_team_company ON sales_team(company_id);
CREATE INDEX IF NOT EXISTS idx_sales_team_email ON sales_team(email);
CREATE INDEX IF NOT EXISTS idx_sales_team_active ON sales_team(is_active);

-- RLS
ALTER TABLE sales_team ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all authenticated users to read sales_team" ON sales_team;
CREATE POLICY "Allow all authenticated users to read sales_team"
  ON sales_team FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow all authenticated users to insert sales_team" ON sales_team;
CREATE POLICY "Allow all authenticated users to insert sales_team"
  ON sales_team FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users to update sales_team" ON sales_team;
CREATE POLICY "Allow all authenticated users to update sales_team"
  ON sales_team FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users to delete sales_team" ON sales_team;
CREATE POLICY "Allow all authenticated users to delete sales_team"
  ON sales_team FOR DELETE
  TO authenticated
  USING (true);

-- STAP 2: Voeg alle 8 accountmanagers toe
INSERT INTO sales_team (
  id, company_id, first_name, last_name, email, phone, mobile,
  role, function_title, employee_number, is_active
) VALUES
  ('am-001', '00000000-0000-0000-0000-000000000001', 'Arie', 'Ouwerkerk',
   'arie.ouwerkerk@huizehoreca.nl', '0612345601', '0612345601', 'sales', 'Accountmanager', 'HH001', true),
  ('am-002', '00000000-0000-0000-0000-000000000001', 'Bobby', 'Klein',
   'bobby.klein@huizehoreca.nl', '0612345603', '0612345603', 'sales', 'Accountmanager', 'HH003', true),
  ('am-003', '00000000-0000-0000-0000-000000000001', 'Dirk', 'Henze',
   'dirk.henze@huizehoreca.nl', '0612345604', '0612345604', 'sales', 'Accountmanager', 'HH004', true),
  ('am-004', '00000000-0000-0000-0000-000000000001', 'Emile', 'Metekohy',
   'emile.metekohy@huizehoreca.nl', '0612345605', '0612345605', 'sales', 'Accountmanager', 'HH005', true),
  ('am-005', '00000000-0000-0000-0000-000000000001', 'Maarten', 'Baas',
   'maarten.baas@huizehoreca.nl', '0612345606', '0612345606', 'sales', 'Accountmanager', 'HH006', true),
  ('am-006', '00000000-0000-0000-0000-000000000001', 'Patrick', 'Wiersema',
   'patrick.wiersema@huizehoreca.nl', '0612345607', '0612345607', 'sales', 'Accountmanager', 'HH007', true),
  ('am-007', '00000000-0000-0000-0000-000000000001', 'Paul', 'van Bennekom',
   'paul.bennekom@huizehoreca.nl', '0612345608', '0612345608', 'sales', 'Accountmanager', 'HH008', true),
  ('am-008', '00000000-0000-0000-0000-000000000001', 'Ron', 'van der Wurf',
   'ron.wurf@huizehoreca.nl', '0612345609', '0612345609', 'sales', 'Accountmanager', 'HH009', true)
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  mobile = EXCLUDED.mobile,
  function_title = EXCLUDED.function_title,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- STAP 3: Verificatie
SELECT
  'Sales Team Setup Compleet' as status,
  COUNT(*) as aantal_members
FROM sales_team
WHERE company_id = '00000000-0000-0000-0000-000000000001';

-- Toon alle toegevoegde members
SELECT
  employee_number,
  first_name || ' ' || last_name as naam,
  email,
  function_title,
  is_active
FROM sales_team
WHERE company_id = '00000000-0000-0000-0000-000000000001'
ORDER BY employee_number;
