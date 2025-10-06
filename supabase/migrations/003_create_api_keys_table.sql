/*
  # Create API Keys Storage Table

  ## New Tables

  ### api_keys
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key to companies)
  - `service_name` (text) - Name of the service (OpenAI, Uniconta, etc.)
  - `api_key` (text) - Encrypted API key
  - `api_secret` (text) - Optional API secret for OAuth services
  - `config` (jsonb) - Additional configuration as JSON
  - `is_active` (boolean) - Whether the key is active
  - `last_tested` (timestamptz) - Last time connection was tested
  - `test_status` (text) - Result of last test: 'success', 'failed', 'pending'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on api_keys table
  - Only users in the same company can view/manage keys
  - Keys should be encrypted at rest (handled by Supabase vault)

  ## Notes
  - For production, consider using Supabase Vault for storing sensitive keys
  - This table stores service credentials per company for multi-tenant support
*/

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  service_name text NOT NULL,
  api_key text,
  api_secret text,
  config jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_tested timestamptz,
  test_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, service_name)
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view api keys in own company"
  ON api_keys FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert api keys in own company"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update api keys in own company"
  ON api_keys FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete api keys in own company"
  ON api_keys FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_api_keys_company ON api_keys(company_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys(service_name);
