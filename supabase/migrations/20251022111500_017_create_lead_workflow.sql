/*
  # Lead→Klant Onboarding Workflow

  ## Overview
  Complete workflow system for managing leads from registration to active Uniconta customer.
  Tracks the full journey: lead source → contact → quote → registration form → customer.

  ## New Tables

  ### 1. `leads`
  Main lead tracking table with all contact and business information.

  **Columns:**
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key → companies)
  - `datum_invoer` (date) - Entry date
  - `accountmanager_id` (uuid, foreign key → team_members) - Assigned account manager
  - `herkomst` (text) - Lead source
  - `bedrijfsnaam` (text, required) - Business name
  - `klanttype` (text) - Customer type category
  - `contactpersoon` (text) - Contact person
  - `telefoonnummer` (text) - Phone number
  - `mobiel` (text) - Mobile number
  - `email_algemeen` (text) - General email
  - `email_factuur` (text) - Invoice email
  - `straat_huisnummer` (text) - Street and number
  - `postcode` (text) - Postal code
  - `plaats` (text) - City
  - `iban` (text) - Bank account
  - `tenaamstelling` (text) - Account holder name
  - `bedrijfsleider` (text) - Business owner
  - `telefoon_bedrijfsleider` (text) - Business owner phone
  - `datum_eerste_contact` (date) - First contact date
  - `datum_bezoek` (date) - Visit date
  - `datum_assortiment` (date) - Assortment discussion date
  - `datum_offerte` (date) - Quote date
  - `datum_offerte_verstuurd` (date) - Quote sent date
  - `volgende_actie` (text) - Next action
  - `datum_volgende_actie` (date) - Next action date
  - `opmerkingen` (text) - Notes
  - `status` (text) - Lead, In behandeling, Offerte, Formulier gemaild, Klant actief
  - `uniconta_klantnummer` (text) - Uniconta customer number (readonly)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `leversituaties`
  Delivery situation information linked to leads.

  **Columns:**
  - `id` (uuid, primary key)
  - `lead_id` (uuid, foreign key → leads, unique)
  - `afleveradres` (text) - Delivery address
  - `afleverwensen` (text) - Delivery preferences
  - `aanvulling` (text) - Additional information
  - `voorkeursdagen` (text[]) - Preferred days (Ma, Di, Wo, Do, Vr)
  - `tijden` (text[]) - Time preferences (Ochtend, Middag)
  - `minimale_bestelhoeveelheid` (text) - Minimum order quantity
  - `chauffeursinstructies` (text) - Driver instructions
  - `akkoord_voorwaarden` (boolean, required) - Terms accepted
  - `handtekening_url` (text) - Signature file URL
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `klantformulieren`
  Customer registration forms linked to leads.

  **Columns:**
  - `id` (uuid, primary key)
  - `lead_id` (uuid, foreign key → leads, unique)
  - `juridische_naam` (text, required) - Legal name
  - `handelsnaam` (text) - Trade name
  - `btw_nummer` (text) - VAT number
  - `kvk_nummer` (text) - Chamber of Commerce number
  - `factuur_email` (text, required) - Invoice email
  - `betaalconditie` (text) - Payment terms (14 dagen, 30 dagen, 45 dagen)
  - `bezorgadres` (text) - Delivery address
  - `contactpersonen` (jsonb) - Contact persons array
  - `opmerkingen_admin` (text) - Admin notes
  - `bijlagen_urls` (text[]) - Attachment URLs
  - `datum_ingevuld` (date) - Form filled date
  - `klaar_om_te_mailen` (boolean) - Ready to email
  - `datum_verzonden` (date) - Sent date
  - `uniconta_klantnummer` (text) - Uniconta customer number
  - `verzendstatus` (text) - Concept, Verzonden, Mislukt
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `tijdlijnacties`
  Timeline of all actions related to leads.

  **Columns:**
  - `id` (uuid, primary key)
  - `lead_id` (uuid, foreign key → leads)
  - `actie_type` (text) - Contact, Bezoek, Offerte, Formulier, Activatie
  - `verantwoordelijke_id` (uuid, foreign key → team_members)
  - `datum` (date)
  - `notities` (text)
  - `bijlage_url` (text)
  - `created_at` (timestamptz)

  ### 5. `emailberichten`
  Email messages sent during the workflow.

  **Columns:**
  - `id` (uuid, primary key)
  - `lead_id` (uuid, foreign key → leads)
  - `aan` (text) - To email
  - `cc` (text) - CC email
  - `onderwerp` (text) - Subject
  - `inhoud_html` (text) - HTML content
  - `bijlagen_urls` (text[]) - Attachment URLs
  - `datum_verzonden` (timestamptz) - Sent date
  - `status` (text) - Verzonden, Mislukt
  - `created_at` (timestamptz)

  ## Security
  All tables have RLS enabled with company-based access control.
  Users can only access records from their own company.

  ## Indexes
  - Foreign keys for performance
  - Status fields for filtering
  - Date fields for sorting and reporting
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  datum_invoer date DEFAULT CURRENT_DATE,
  accountmanager_id uuid REFERENCES team_members(id) ON DELETE SET NULL,
  herkomst text,
  bedrijfsnaam text NOT NULL,
  klanttype text,
  contactpersoon text,
  telefoonnummer text,
  mobiel text,
  email_algemeen text,
  email_factuur text,
  straat_huisnummer text,
  postcode text,
  plaats text,
  iban text,
  tenaamstelling text,
  bedrijfsleider text,
  telefoon_bedrijfsleider text,
  datum_eerste_contact date,
  datum_bezoek date,
  datum_assortiment date,
  datum_offerte date,
  datum_offerte_verstuurd date,
  volgende_actie text,
  datum_volgende_actie date,
  opmerkingen text,
  status text DEFAULT 'Lead' CHECK (status IN ('Lead', 'In behandeling', 'Offerte', 'Formulier gemaild', 'Klant actief')),
  uniconta_klantnummer text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leversituaties table
CREATE TABLE IF NOT EXISTS leversituaties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
  afleveradres text,
  afleverwensen text,
  aanvulling text,
  voorkeursdagen text[] DEFAULT '{}',
  tijden text[] DEFAULT '{}',
  minimale_bestelhoeveelheid text,
  chauffeursinstructies text,
  akkoord_voorwaarden boolean DEFAULT false,
  handtekening_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create klantformulieren table
CREATE TABLE IF NOT EXISTS klantformulieren (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
  juridische_naam text NOT NULL,
  handelsnaam text,
  btw_nummer text,
  kvk_nummer text,
  factuur_email text NOT NULL,
  betaalconditie text CHECK (betaalconditie IN ('14 dagen', '30 dagen', '45 dagen')),
  bezorgadres text,
  contactpersonen jsonb DEFAULT '[]'::jsonb,
  opmerkingen_admin text,
  bijlagen_urls text[] DEFAULT '{}',
  datum_ingevuld date,
  klaar_om_te_mailen boolean DEFAULT false,
  datum_verzonden date,
  uniconta_klantnummer text,
  verzendstatus text DEFAULT 'Concept' CHECK (verzendstatus IN ('Concept', 'Verzonden', 'Mislukt')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tijdlijnacties table
CREATE TABLE IF NOT EXISTS tijdlijnacties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  actie_type text NOT NULL CHECK (actie_type IN ('Contact', 'Bezoek', 'Offerte', 'Formulier', 'Activatie', 'Notitie')),
  verantwoordelijke_id uuid REFERENCES team_members(id) ON DELETE SET NULL,
  datum date DEFAULT CURRENT_DATE,
  notities text,
  bijlage_url text,
  created_at timestamptz DEFAULT now()
);

-- Create emailberichten table
CREATE TABLE IF NOT EXISTS emailberichten (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  aan text NOT NULL,
  cc text,
  onderwerp text NOT NULL,
  inhoud_html text NOT NULL,
  bijlagen_urls text[] DEFAULT '{}',
  datum_verzonden timestamptz DEFAULT now(),
  status text DEFAULT 'Verzonden' CHECK (status IN ('Verzonden', 'Mislukt')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_company ON leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_accountmanager ON leads(accountmanager_id);
CREATE INDEX IF NOT EXISTS idx_tijdlijnacties_lead ON tijdlijnacties(lead_id);
CREATE INDEX IF NOT EXISTS idx_tijdlijnacties_datum ON tijdlijnacties(datum DESC);
CREATE INDEX IF NOT EXISTS idx_emailberichten_lead ON emailberichten(lead_id);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE leversituaties ENABLE ROW LEVEL SECURITY;
ALTER TABLE klantformulieren ENABLE ROW LEVEL SECURITY;
ALTER TABLE tijdlijnacties ENABLE ROW LEVEL SECURITY;
ALTER TABLE emailberichten ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "Users can view leads from their company"
  ON leads FOR SELECT
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM team_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert leads for their company"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (
    SELECT company_id FROM team_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update leads from their company"
  ON leads FOR UPDATE
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM team_members WHERE user_id = auth.uid()
  ))
  WITH CHECK (company_id IN (
    SELECT company_id FROM team_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete leads from their company"
  ON leads FOR DELETE
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM team_members WHERE user_id = auth.uid()
  ));

-- RLS Policies for leversituaties
CREATE POLICY "Users can view leversituaties from their company"
  ON leversituaties FOR SELECT
  TO authenticated
  USING (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert leversituaties for their company"
  ON leversituaties FOR INSERT
  TO authenticated
  WITH CHECK (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can update leversituaties from their company"
  ON leversituaties FOR UPDATE
  TO authenticated
  USING (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can delete leversituaties from their company"
  ON leversituaties FOR DELETE
  TO authenticated
  USING (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

-- RLS Policies for klantformulieren
CREATE POLICY "Users can view klantformulieren from their company"
  ON klantformulieren FOR SELECT
  TO authenticated
  USING (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert klantformulieren for their company"
  ON klantformulieren FOR INSERT
  TO authenticated
  WITH CHECK (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can update klantformulieren from their company"
  ON klantformulieren FOR UPDATE
  TO authenticated
  USING (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can delete klantformulieren from their company"
  ON klantformulieren FOR DELETE
  TO authenticated
  USING (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

-- RLS Policies for tijdlijnacties
CREATE POLICY "Users can view tijdlijnacties from their company"
  ON tijdlijnacties FOR SELECT
  TO authenticated
  USING (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert tijdlijnacties for their company"
  ON tijdlijnacties FOR INSERT
  TO authenticated
  WITH CHECK (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

-- RLS Policies for emailberichten
CREATE POLICY "Users can view emailberichten from their company"
  ON emailberichten FOR SELECT
  TO authenticated
  USING (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert emailberichten for their company"
  ON emailberichten FOR INSERT
  TO authenticated
  WITH CHECK (lead_id IN (
    SELECT id FROM leads WHERE company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  ));

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leversituaties_updated_at
  BEFORE UPDATE ON leversituaties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_klantformulieren_updated_at
  BEFORE UPDATE ON klantformulieren
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
