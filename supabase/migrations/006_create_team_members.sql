/*
  # Create Team Members Table

  ## New Tables

  1. `team_members`
     - `id` (uuid, primary key)
     - `company_id` (uuid, references companies)
     - `first_name` (text, not null)
     - `last_name` (text, not null)
     - `email` (text)
     - `phone` (text)
     - `role` (text) - sales, inkoop, logistiek, magazijn, management
     - `department` (text) - voor verdere filtering
     - `is_active` (boolean, default true)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

  ## Security

  - Enable RLS on `team_members` table
  - Add policies for authenticated users to manage team members in their company
*/

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  role text NOT NULL DEFAULT 'sales',
  department text,
  employee_number text,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_employee_number UNIQUE (company_id, employee_number)
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_team_members_company_id ON team_members(company_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "tenant_select_team_members"
  ON team_members FOR SELECT
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_insert_team_members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_update_team_members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid)
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_delete_team_members"
  ON team_members FOR DELETE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed Sales team members for demo company
INSERT INTO team_members (company_id, first_name, last_name, email, phone, role, employee_number, department)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Bobby', 'Klein', 'bobby.klein@huizehoreca.nl', '0612345601', 'sales', 'HH001', 'Verkoop'),
  ('00000000-0000-0000-0000-000000000001', 'Dirk', 'Henze', 'dirk.henze@huizehoreca.nl', '0612345602', 'sales', 'HH002', 'Verkoop'),
  ('00000000-0000-0000-0000-000000000001', 'Emile', 'Metekohy', 'emile.metekohy@huizehoreca.nl', '0612345603', 'sales', 'HH003', 'Verkoop'),
  ('00000000-0000-0000-0000-000000000001', 'Maarten', 'Baas', 'maarten.baas@huizehoreca.nl', '0612345604', 'sales', 'HH004', 'Verkoop'),
  ('00000000-0000-0000-0000-000000000001', 'Patrick', 'Wiersema', 'patrick.wiersema@huizehoreca.nl', '0612345605', 'sales', 'HH005', 'Verkoop'),
  ('00000000-0000-0000-0000-000000000001', 'Paul', 'van Bennekom', 'paul.bennekom@huizehoreca.nl', '0612345606', 'sales', 'HH006', 'Verkoop'),
  ('00000000-0000-0000-0000-000000000001', 'Ron', 'van den Wurf', 'ron.wurf@huizehoreca.nl', '0612345607', 'sales', 'HH007', 'Verkoop'),
  ('00000000-0000-0000-0000-000000000001', 'Man', 'van Drank', 'man.drank@huizehoreca.nl', '0612345608', 'sales', 'HH008', 'Verkoop'),
  ('00000000-0000-0000-0000-000000000001', 'Jan', 'Binnendienst', 'jan.binnen@huizehoreca.nl', '0612345609', 'sales', 'HH009', 'Binnendienst')
ON CONFLICT (company_id, employee_number) DO NOTHING;

-- Add some other department members
INSERT INTO team_members (company_id, first_name, last_name, email, phone, role, employee_number, department)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Lisa', 'van der Berg', 'lisa.berg@huizehoreca.nl', '0612345610', 'inkoop', 'HH010', 'Inkoop'),
  ('00000000-0000-0000-0000-000000000001', 'Mark', 'de Vries', 'mark.vries@huizehoreca.nl', '0612345611', 'inkoop', 'HH011', 'Inkoop'),
  ('00000000-0000-0000-0000-000000000001', 'Jan', 'Jansen', 'jan.jansen@huizehoreca.nl', '0612345612', 'logistiek', 'HH012', 'Logistiek'),
  ('00000000-0000-0000-0000-000000000001', 'Piet', 'Pietersen', 'piet.pietersen@huizehoreca.nl', '0612345613', 'logistiek', 'HH013', 'Logistiek'),
  ('00000000-0000-0000-0000-000000000001', 'Sara', 'Bakker', 'sara.bakker@huizehoreca.nl', '0612345614', 'magazijn', 'HH014', 'Magazijn'),
  ('00000000-0000-0000-0000-000000000001', 'Tom', 'Smit', 'tom.smit@huizehoreca.nl', '0612345615', 'magazijn', 'HH015', 'Magazijn')
ON CONFLICT (company_id, employee_number) DO NOTHING;
