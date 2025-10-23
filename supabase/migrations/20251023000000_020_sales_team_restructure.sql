/*
  # Sales Team & Supplier Account Managers Restructure
  
  1. Nieuwe Tabellen
    - `sales_team` - Interne accountmanagers (Huize Horeca)
    - `supplier_account_managers` - Externe accountmanagers (Leveranciers)
    - `supplier_am_assignments` - N-M relatie tussen leveranciers en AM's
    - `audit_log` - Tracking van wijzigingen
    
  2. Migratie
    - Verplaats bestaande team_members naar sales_team
    - Update alle referenties
    
  3. Security
    - RLS policies voor alle nieuwe tabellen
*/

-- ==========================================
-- SALES TEAM (Intern - Huize Horeca)
-- ==========================================

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

CREATE INDEX idx_sales_team_company ON sales_team(company_id);
CREATE INDEX idx_sales_team_email ON sales_team(email);
CREATE INDEX idx_sales_team_active ON sales_team(is_active);

-- ==========================================
-- SUPPLIER ACCOUNT MANAGERS (Extern)
-- ==========================================

CREATE TABLE IF NOT EXISTS supplier_account_managers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  mobile text,
  
  function_title text,
  
  is_active boolean DEFAULT true,
  notes text,
  avatar_url text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_supplier_am_email ON supplier_account_managers(email);
CREATE INDEX idx_supplier_am_active ON supplier_account_managers(is_active);

-- ==========================================
-- N-M RELATIE: Leveranciers <-> Account Managers
-- ==========================================

CREATE TABLE IF NOT EXISTS supplier_am_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  account_manager_id uuid REFERENCES supplier_account_managers(id) ON DELETE CASCADE NOT NULL,
  
  is_primary boolean DEFAULT false,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id),
  
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(supplier_id, account_manager_id)
);

CREATE INDEX idx_supplier_am_assignments_supplier ON supplier_am_assignments(supplier_id);
CREATE INDEX idx_supplier_am_assignments_am ON supplier_am_assignments(account_manager_id);
CREATE INDEX idx_supplier_am_assignments_primary ON supplier_am_assignments(is_primary);

-- Ensure only one primary AM per supplier
CREATE UNIQUE INDEX idx_one_primary_am_per_supplier 
  ON supplier_am_assignments(supplier_id) 
  WHERE is_primary = true;

-- ==========================================
-- AUDIT LOG
-- ==========================================

CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  
  changed_by uuid REFERENCES auth.users(id),
  changed_by_name text,
  
  old_values jsonb,
  new_values jsonb,
  
  ip_address inet,
  user_agent text,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(changed_by);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- ==========================================
-- MIGRATIE: team_members -> sales_team
-- ==========================================

-- Kopieer alle interne accountmanagers naar sales_team
INSERT INTO sales_team (
  id,
  company_id,
  user_id,
  first_name,
  last_name,
  email,
  phone,
  role,
  function_title,
  employee_number,
  is_active,
  created_at,
  updated_at
)
SELECT 
  id,
  company_id,
  user_id,
  first_name,
  last_name,
  email,
  phone,
  role,
  department,
  employee_number,
  is_active,
  created_at,
  updated_at
FROM team_members
WHERE role = 'sales' OR role = 'user'
ON CONFLICT (id) DO NOTHING;

-- Log de migratie
INSERT INTO audit_log (entity_type, entity_id, action, changed_by_name, new_values)
SELECT 
  'migration',
  id,
  'migrated_to_sales_team',
  'system',
  jsonb_build_object('from', 'team_members', 'to', 'sales_team')
FROM team_members
WHERE role = 'sales' OR role = 'user';

-- ==========================================
-- UPDATE REFERENTIES
-- ==========================================

-- Leads blijven verwijzen naar sales_team (via account_manager_id)
-- We hoeven niets te updaten omdat sales_team dezelfde IDs gebruikt

-- Customers blijven verwijzen naar sales_team
-- Ook hier blijven de IDs hetzelfde

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE sales_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_account_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_am_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Tijdelijk open policies voor development
CREATE POLICY "allow_all_sales_team" ON sales_team
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_supplier_am" ON supplier_account_managers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_assignments" ON supplier_am_assignments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_read_audit_log" ON audit_log
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "allow_insert_audit_log" ON audit_log
  FOR INSERT TO authenticated WITH CHECK (true);

-- ==========================================
-- FUNCTIES: Audit Log Helper
-- ==========================================

CREATE OR REPLACE FUNCTION log_audit_entry(
  p_entity_type text,
  p_entity_id uuid,
  p_action text,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_user_id uuid;
  v_user_name text;
BEGIN
  SELECT auth.uid() INTO v_user_id;
  
  SELECT COALESCE(first_name || ' ' || last_name, email)
  INTO v_user_name
  FROM sales_team
  WHERE user_id = v_user_id
  LIMIT 1;
  
  IF v_user_name IS NULL THEN
    SELECT email INTO v_user_name
    FROM auth.users
    WHERE id = v_user_id;
  END IF;
  
  INSERT INTO audit_log (
    entity_type,
    entity_id,
    action,
    changed_by,
    changed_by_name,
    old_values,
    new_values
  ) VALUES (
    p_entity_type,
    p_entity_id,
    p_action,
    v_user_id,
    v_user_name,
    p_old_values,
    p_new_values
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- TRIGGERS: Auto Audit Log
-- ==========================================

-- Trigger voor supplier_am_assignments wijzigingen
CREATE OR REPLACE FUNCTION audit_supplier_am_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_entry(
      'supplier_am_assignment',
      NEW.id,
      'created',
      NULL,
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_entry(
      'supplier_am_assignment',
      NEW.id,
      'updated',
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_entry(
      'supplier_am_assignment',
      OLD.id,
      'deleted',
      to_jsonb(OLD),
      NULL
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_audit_supplier_am_assignment ON supplier_am_assignments;
CREATE TRIGGER trigger_audit_supplier_am_assignment
  AFTER INSERT OR UPDATE OR DELETE ON supplier_am_assignments
  FOR EACH ROW EXECUTE FUNCTION audit_supplier_am_assignment();

-- ==========================================
-- VIEWS: Helper Views
-- ==========================================

-- View: Leveranciers met primaire AM
CREATE OR REPLACE VIEW suppliers_with_primary_am AS
SELECT 
  s.id as supplier_id,
  s.name as supplier_name,
  s.category,
  sam.id as primary_am_id,
  sam.first_name || ' ' || sam.last_name as primary_am_name,
  sam.email as primary_am_email,
  sam.phone as primary_am_phone
FROM suppliers s
LEFT JOIN supplier_am_assignments saa ON s.id = saa.supplier_id AND saa.is_primary = true
LEFT JOIN supplier_account_managers sam ON saa.account_manager_id = sam.id;

-- ==========================================
-- DEMO DATA
-- ==========================================

-- Voeg een test supplier account manager toe
INSERT INTO supplier_account_managers (
  company_id,
  first_name,
  last_name,
  email,
  phone,
  mobile,
  function_title,
  is_active
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Jan',
  'Bakker',
  'jan.bakker@leverancier-demo.nl',
  '0201234567',
  '0612345678',
  'Accountmanager',
  true
)
ON CONFLICT (email) DO NOTHING;

-- ==========================================
-- VERIFICATIE
-- ==========================================

SELECT 
  'Sales Team migration complete' as status,
  COUNT(*) as migrated_count
FROM sales_team;

SELECT 
  'Supplier AM tables created' as status,
  COUNT(*) as demo_am_count
FROM supplier_account_managers;

SELECT 'Audit log ready' as status;
