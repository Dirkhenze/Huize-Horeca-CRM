/*
  # Create Suppliers and Supplier Account Managers Tables

  1. New Tables
    - `suppliers`
      - `id` (uuid, primary key)
      - `company_id` (uuid, references companies)
      - `name` (text, required)
      - `contact_person` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `postal_code` (text)
      - `country` (text)
      - `website` (text)
      - `notes` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `supplier_account_managers`
      - `id` (uuid, primary key)
      - `company_id` (uuid, references companies)
      - `first_name` (text, required)
      - `last_name` (text, required)
      - `email` (text, required)
      - `phone` (text)
      - `mobile` (text)
      - `function_title` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `supplier_am_assignments`
      - `id` (uuid, primary key)
      - `supplier_id` (uuid, references suppliers)
      - `account_manager_id` (uuid, references supplier_account_managers)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their company's data
*/

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact_person text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'Nederland',
  website text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create supplier_account_managers table
CREATE TABLE IF NOT EXISTS supplier_account_managers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  mobile text,
  function_title text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create supplier_am_assignments table for many-to-many relationship
CREATE TABLE IF NOT EXISTS supplier_am_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  account_manager_id uuid REFERENCES supplier_account_managers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(supplier_id, account_manager_id)
);

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_account_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_am_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for suppliers
CREATE POLICY "Users can view suppliers in their company"
  ON suppliers
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert suppliers in their company"
  ON suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update suppliers in their company"
  ON suppliers
  FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete suppliers in their company"
  ON suppliers
  FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- RLS Policies for supplier_account_managers
CREATE POLICY "Users can view supplier AMs in their company"
  ON supplier_account_managers
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert supplier AMs in their company"
  ON supplier_account_managers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update supplier AMs in their company"
  ON supplier_account_managers
  FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete supplier AMs in their company"
  ON supplier_account_managers
  FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- RLS Policies for supplier_am_assignments
CREATE POLICY "Users can view assignments for their company suppliers"
  ON supplier_am_assignments
  FOR SELECT
  TO authenticated
  USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert assignments for their company suppliers"
  ON supplier_am_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    supplier_id IN (
      SELECT id FROM suppliers WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update assignments for their company suppliers"
  ON supplier_am_assignments
  FOR UPDATE
  TO authenticated
  USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  )
  WITH CHECK (
    supplier_id IN (
      SELECT id FROM suppliers WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete assignments for their company suppliers"
  ON supplier_am_assignments
  FOR DELETE
  TO authenticated
  USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_company_id ON suppliers(company_id);
CREATE INDEX IF NOT EXISTS idx_supplier_account_managers_company_id ON supplier_account_managers(company_id);
CREATE INDEX IF NOT EXISTS idx_supplier_am_assignments_supplier_id ON supplier_am_assignments(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_am_assignments_account_manager_id ON supplier_am_assignments(account_manager_id);
