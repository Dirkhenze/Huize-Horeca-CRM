-- ==========================================
-- HUIZE HORECA CRM - COMPLETE DATABASE SETUP
-- ==========================================
-- Voer dit script uit in de Supabase SQL Editor
-- https://supabase.com/dashboard/project/tfgttzedzrcehyxxyjwq/sql/new

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Companies (junction table for multi-tenancy)
CREATE TABLE IF NOT EXISTS user_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own company" ON companies;
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM user_companies WHERE company_id = id));

DROP POLICY IF EXISTS "Users can view own company memberships" ON user_companies;
CREATE POLICY "Users can view own company memberships"
  ON user_companies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  customer_number text NOT NULL,
  name text NOT NULL,
  region text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'NL',
  customer_type text,
  account_manager_id uuid,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, customer_number)
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view customers in own company" ON customers;
DROP POLICY IF EXISTS "Users can insert customers in own company" ON customers;
DROP POLICY IF EXISTS "Users can update customers in own company" ON customers;
DROP POLICY IF EXISTS "Users can delete customers in own company" ON customers;

CREATE POLICY "Users can view customers in own company"
  ON customers FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert customers in own company"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update customers in own company"
  ON customers FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete customers in own company"
  ON customers FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

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

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view team members in own company" ON team_members;
DROP POLICY IF EXISTS "Users can insert team members in own company" ON team_members;
DROP POLICY IF EXISTS "Users can update team members in own company" ON team_members;
DROP POLICY IF EXISTS "Users can delete team members in own company" ON team_members;

CREATE POLICY "Users can view team members in own company"
  ON team_members FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert team members in own company"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update team members in own company"
  ON team_members FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete team members in own company"
  ON team_members FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

-- Leads
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

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view leads in own company" ON leads;
DROP POLICY IF EXISTS "Users can insert leads in own company" ON leads;
DROP POLICY IF EXISTS "Users can update leads in own company" ON leads;
DROP POLICY IF EXISTS "Users can delete leads in own company" ON leads;

CREATE POLICY "Users can view leads in own company"
  ON leads FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert leads in own company"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update leads in own company"
  ON leads FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete leads in own company"
  ON leads FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  article_number text NOT NULL,
  description text,
  category text,
  unit text DEFAULT 'stuks',
  price numeric(10,2) DEFAULT 0,
  cost_price numeric(10,2) DEFAULT 0,
  stock_quantity integer DEFAULT 0,
  brand text,
  supplier text,
  barcode text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, article_number)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view products in own company" ON products;
DROP POLICY IF EXISTS "Users can insert products in own company" ON products;
DROP POLICY IF EXISTS "Users can update products in own company" ON products;
DROP POLICY IF EXISTS "Users can delete products in own company" ON products;

CREATE POLICY "Users can view products in own company"
  ON products FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert products in own company"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update products in own company"
  ON products FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete products in own company"
  ON products FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

-- Article Field Settings
CREATE TABLE IF NOT EXISTS article_field_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  field_name text NOT NULL,
  is_visible boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, field_name)
);

ALTER TABLE article_field_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view article field settings" ON article_field_settings;
DROP POLICY IF EXISTS "Users can insert article field settings" ON article_field_settings;
DROP POLICY IF EXISTS "Users can update article field settings" ON article_field_settings;

CREATE POLICY "Users can view article field settings"
  ON article_field_settings FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert article field settings"
  ON article_field_settings FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update article field settings"
  ON article_field_settings FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_company ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_account_manager ON customers(account_manager_id);
CREATE INDEX IF NOT EXISTS idx_team_members_company ON team_members(company_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_leads_company ON leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_account_manager ON leads(account_manager_id);
CREATE INDEX IF NOT EXISTS idx_products_company ON products(company_id);

-- ==========================================
-- DEMO DATA - Huize Horeca
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

-- Success message
SELECT 'Database setup complete! 🎉' as message;
SELECT COUNT(*) as total_account_managers FROM team_members WHERE role = 'sales';
