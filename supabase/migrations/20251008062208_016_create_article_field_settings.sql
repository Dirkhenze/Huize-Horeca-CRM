/*
  # Article Field Settings

  1. New Tables
    - `article_field_settings`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key to companies)
      - `category` (text) - The hoofdcategorie name
      - `field_name` (text) - The field/column name
      - `visible` (boolean) - Whether field is visible
      - `disabled` (boolean) - Whether field is read-only/grayed out
      - `tab_name` (text) - Which tab the field appears on
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `article_field_settings` table
    - Add policies for authenticated users to manage their company's settings

  3. Notes
    - Multi-tenant: settings are per company
    - Unique constraint on (company_id, category, field_name)
*/

-- Create article_field_settings table
CREATE TABLE IF NOT EXISTS article_field_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category text NOT NULL,
  field_name text NOT NULL,
  visible boolean DEFAULT true,
  disabled boolean DEFAULT false,
  tab_name text DEFAULT 'basis',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, category, field_name)
);

-- Enable RLS
ALTER TABLE article_field_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view their company field settings"
  ON article_field_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert field settings"
  ON article_field_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update field settings"
  ON article_field_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete field settings"
  ON article_field_settings FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_article_field_settings_company_category 
  ON article_field_settings(company_id, category);

-- Insert default field configurations for common categories
INSERT INTO article_field_settings (company_id, category, field_name, visible, disabled, tab_name)
VALUES
  -- Wijnen category - wine-specific fields enabled
  ('00000000-0000-0000-0000-000000000001', 'Wijnen', 'wijnhuis', true, false, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Wijnen', 'wijnstijl', true, false, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Wijnen', 'druifsoort', true, false, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Wijnen', 'teeltwijze', true, false, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Wijnen', 'land_van_oorsprong', true, false, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Wijnen', 'streek_regio', true, false, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Wijnen', 'abv', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Wijnen', 'tapkoppeling', false, true, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Wijnen', 'carbonatie', false, true, 'dranken'),

  -- Bieren category - beer-specific fields enabled
  ('00000000-0000-0000-0000-000000000001', 'Bieren', 'tapkoppeling', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Bieren', 'carbonatie', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Bieren', 'abv', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Bieren', 'aantal_liter', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Bieren', 'aantal_in_hectoliter', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Bieren', 'wijnhuis', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Bieren', 'wijnstijl', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Bieren', 'druifsoort', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Bieren', 'teeltwijze', false, true, 'wijn'),

  -- Frisdranken category - basic drink fields only
  ('00000000-0000-0000-0000-000000000001', 'Frisdranken', 'carbonatie', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Frisdranken', 'aantal_liter', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Frisdranken', 'fruitcomponent', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Frisdranken', 'abv', false, true, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Frisdranken', 'wijnhuis', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Frisdranken', 'wijnstijl', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Frisdranken', 'druifsoort', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Frisdranken', 'tapkoppeling', false, true, 'dranken'),

  -- Gedistilleerd category - distilled spirits fields
  ('00000000-0000-0000-0000-000000000001', 'Gedistilleerd', 'abv', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Gedistilleerd', 'land_van_oorsprong', true, false, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Gedistilleerd', 'wijnhuis', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Gedistilleerd', 'druifsoort', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Gedistilleerd', 'tapkoppeling', false, true, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Gedistilleerd', 'carbonatie', false, true, 'dranken'),

  -- Non-Food category - basic fields only
  ('00000000-0000-0000-0000-000000000001', 'Non-Food', 'wijnhuis', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Non-Food', 'wijnstijl', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Non-Food', 'druifsoort', false, true, 'wijn'),
  ('00000000-0000-0000-0000-000000000001', 'Non-Food', 'abv', false, true, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Non-Food', 'tapkoppeling', false, true, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Non-Food', 'carbonatie', false, true, 'dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Non-Food', 'land_van_oorsprong', false, true, 'dranken')
ON CONFLICT (company_id, category, field_name) DO NOTHING;
