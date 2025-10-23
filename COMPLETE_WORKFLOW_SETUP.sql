-- ==========================================
-- HUIZE HORECA CRM - COMPLETE WORKFLOW v2.0
-- ==========================================
-- Nieuwe features:
-- 1. Automatisch tijdelijk LEAD-nummer
-- 2. Dynamisch formulier met progressieve validatie
-- 3. Data-overname bij conversie lead->klant

-- ==========================================
-- STAP 1: BASIS TABELLEN
-- ==========================================

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team Members (Account Managers)
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

-- Lead Sequence Counter
CREATE TABLE IF NOT EXISTS lead_sequence (
  id integer PRIMARY KEY DEFAULT 1,
  last_number integer DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO lead_sequence (id, last_number) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

-- Leads (uitgebreid met alle secties)
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  
  -- Automatisch gegenereerd LEAD-nummer
  temporary_customer_id text UNIQUE,
  
  -- Sectie 1: Basis
  company_name text NOT NULL,
  customer_type text,
  account_manager_id uuid REFERENCES team_members(id) ON DELETE SET NULL,
  
  -- Sectie 2: Adres
  address text,
  postal_code text,
  city text,
  region text,
  delivery_address text,
  
  -- Sectie 3: Levering
  delivery_preference_days text,
  delivery_time_slots text,
  delivery_instructions text,
  
  -- Sectie 4: Contact
  contact_person text,
  email text,
  phone text,
  contact_role text,
  secondary_contact_name text,
  secondary_contact_email text,
  secondary_contact_phone text,
  
  -- Sectie 5: Financieel (optioneel in leadfase)
  iban text,
  account_holder_name text,
  payment_terms text,
  btw_number text,
  
  -- Sectie 6: Business
  assortment_interests text,
  business_notes text,
  
  -- Workflow
  status text DEFAULT 'Lead',
  uniconta_customer_id text,
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customers (uitgebreid met lead_referentie)
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  
  -- Referentie naar originele lead
  lead_referentie text,
  
  -- Klantgegevens
  customer_number text NOT NULL,
  name text NOT NULL,
  customer_type text,
  account_manager_id uuid REFERENCES team_members(id) ON DELETE SET NULL,
  
  -- Adres
  address text,
  city text,
  postal_code text,
  region text,
  country text DEFAULT 'NL',
  delivery_address text,
  
  -- Levering
  delivery_preference_days text,
  delivery_time_slots text,
  delivery_instructions text,
  
  -- Contact
  contact_person text,
  email text,
  phone text,
  contact_role text,
  secondary_contact_name text,
  secondary_contact_email text,
  secondary_contact_phone text,
  
  -- Financieel (verplicht voor klanten)
  iban text,
  account_holder_name text,
  payment_terms text,
  btw_number text,
  
  -- Business
  assortment_interests text,
  business_notes text,
  
  -- Status
  is_active boolean DEFAULT true,
  uniconta_customer_id text,
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, customer_number)
);

-- User Companies
CREATE TABLE IF NOT EXISTS user_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- ==========================================
-- STAP 2: FUNCTIE VOOR AUTO-INCREMENT LEAD NUMMER
-- ==========================================

CREATE OR REPLACE FUNCTION generate_lead_number()
RETURNS TEXT AS $$
DECLARE
  next_num integer;
  lead_id text;
BEGIN
  -- Lock de row om race conditions te voorkomen
  UPDATE lead_sequence 
  SET last_number = last_number + 1 
  WHERE id = 1 
  RETURNING last_number INTO next_num;
  
  -- Format: LEAD000001
  lead_id := 'LEAD' || LPAD(next_num::text, 6, '0');
  
  RETURN lead_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger om automatisch LEAD-nummer te genereren
CREATE OR REPLACE FUNCTION auto_generate_lead_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.temporary_customer_id IS NULL THEN
    NEW.temporary_customer_id := generate_lead_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_lead_number ON leads;
CREATE TRIGGER trigger_auto_lead_number
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_lead_number();

-- ==========================================
-- STAP 3: ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;

-- TIJDELIJK: Open policies voor development
DROP POLICY IF EXISTS "allow_all" ON companies;
CREATE POLICY "allow_all" ON companies FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all" ON team_members;
CREATE POLICY "allow_all" ON team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all" ON leads;
CREATE POLICY "allow_all" ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all" ON customers;
CREATE POLICY "allow_all" ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all" ON user_companies;
CREATE POLICY "allow_all" ON user_companies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- STAP 4: DEMO DATA
-- ==========================================

-- Demo company
INSERT INTO companies (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Huize Horeca Demo')
ON CONFLICT (id) DO NOTHING;

-- 8 Account Managers
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

-- Indexes voor performance
CREATE INDEX IF NOT EXISTS idx_leads_company ON leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_temp_id ON leads(temporary_customer_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_customers_lead_ref ON customers(lead_referentie);

-- ==========================================
-- VERIFICATIE
-- ==========================================

SELECT 'Database setup compleet! ✅' as status;
SELECT COUNT(*) as aantal_accountmanagers FROM team_members WHERE role = 'sales';
SELECT 'LEAD-nummer generator geïnstalleerd ✅' as feature;

