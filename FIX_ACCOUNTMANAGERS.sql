-- ==========================================
-- STAP 1: BASIS TABELLEN
-- ==========================================
-- Voer dit eerst uit in de Supabase SQL Editor

-- Companies tabel
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team Members tabel (voor accountmanagers)
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  employee_number text,
  department text,
  role text DEFAULT 'user',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leads tabel
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  company_name text NOT NULL,
  contact_person text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  customer_type text,
  status text DEFAULT 'Lead',
  account_manager_id uuid REFERENCES team_members(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Companies (voor multi-tenancy)
CREATE TABLE IF NOT EXISTS user_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- ==========================================
-- STAP 2: ROW LEVEL SECURITY
-- ==========================================

-- Enable RLS op alle tabellen
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;

-- TIJDELIJK: Maak alle tabellen toegankelijk voor authenticated users
DROP POLICY IF EXISTS "Allow all for authenticated users" ON companies;
CREATE POLICY "Allow all for authenticated users"
  ON companies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON team_members;
CREATE POLICY "Allow all for authenticated users"
  ON team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON leads;
CREATE POLICY "Allow all for authenticated users"
  ON leads FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON user_companies;
CREATE POLICY "Allow all for authenticated users"
  ON user_companies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- STAP 3: DEMO DATA
-- ==========================================

-- Insert demo company
INSERT INTO companies (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Huize Horeca Demo')
ON CONFLICT (id) DO NOTHING;

-- Insert 8 Account Managers
INSERT INTO team_members (company_id, first_name, last_name, email, phone, employee_number, department, role, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Arie', 'Ouwerkerk', 'arie.ouwerkerk@huizehoreca.nl', '0612345601', 'HH001', 'Verkoop', 'sales', true),
  ('00000000-0000-0000-0000-000000000001', 'Bobby', 'Klein', 'bobby.klein@huizehoreca.nl', '0612345603', 'HH003', 'Verkoop', 'sales', true),
  ('00000000-0000-0000-0000-000000000001', 'Dirk', 'Henze', 'dirk.henze@huizehoreca.nl', '0612345604', 'HH004', 'Verkoop', 'sales', true),
  ('00000000-0000-0000-0000-000000000001', 'Emile', 'Metekohy', 'emile.metekohy@huizehoreca.nl', '0612345605', 'HH005', 'Verkoop', 'sales', true),
  ('00000000-0000-0000-0000-000000000001', 'Maarten', 'Baas', 'maarten.baas@huizehoreca.nl', '0612345606', 'HH006', 'Verkoop', 'sales', true),
  ('00000000-0000-0000-0000-000000000001', 'Patrick', 'Wiersema', 'patrick.wiersema@huizehoreca.nl', '0612345607', 'HH007', 'Verkoop', 'sales', true),
  ('00000000-0000-0000-0000-000000000001', 'Paul', 'van Bennekom', 'paul.bennekom@huizehoreca.nl', '0612345608', 'HH008', 'Verkoop', 'sales', true),
  ('00000000-0000-0000-0000-000000000001', 'Ron', 'van der Wurf', 'ron.wurf@huizehoreca.nl', '0612345609', 'HH009', 'Verkoop', 'sales', true)
ON CONFLICT DO NOTHING;

-- Verificatie
SELECT 'Setup compleet! ✅' as status;
SELECT COUNT(*) as aantal_accountmanagers FROM team_members WHERE role = 'sales';
