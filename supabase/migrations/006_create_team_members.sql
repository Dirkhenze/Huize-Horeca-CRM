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
