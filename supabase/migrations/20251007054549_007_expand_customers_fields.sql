/*
  # Expand Customer Fields for Uniconta Integration

  ## Changes to customers table

  This migration adds all fields from Uniconta to support full data import.
  All new fields are optional (nullable) to support gradual data migration.
*/

-- Add financial fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'saldo') THEN
    ALTER TABLE customers ADD COLUMN saldo decimal(12,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'achterstallig') THEN
    ALTER TABLE customers ADD COLUMN achterstallig decimal(12,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'achterstallig_in_valuta') THEN
    ALTER TABLE customers ADD COLUMN achterstallig_in_valuta decimal(12,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'kredietlimiet') THEN
    ALTER TABLE customers ADD COLUMN kredietlimiet decimal(12,2) DEFAULT 0;
  END IF;
END $$;

-- Add extended address fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'adres_1') THEN
    ALTER TABLE customers ADD COLUMN adres_1 text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'adres_2') THEN
    ALTER TABLE customers ADD COLUMN adres_2 text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'adres_3') THEN
    ALTER TABLE customers ADD COLUMN adres_3 text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'afleveradres_1') THEN
    ALTER TABLE customers ADD COLUMN afleveradres_1 text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'afleveradres_2') THEN
    ALTER TABLE customers ADD COLUMN afleveradres_2 text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'afleveradres_3') THEN
    ALTER TABLE customers ADD COLUMN afleveradres_3 text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'postcode_voor_levering') THEN
    ALTER TABLE customers ADD COLUMN postcode_voor_levering text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'plaats_voor_levering') THEN
    ALTER TABLE customers ADD COLUMN plaats_voor_levering text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'delivery_address') THEN
    ALTER TABLE customers ADD COLUMN delivery_address text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'sleutelcode') THEN
    ALTER TABLE customers ADD COLUMN sleutelcode text;
  END IF;
END $$;

-- Add contact fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'contact') THEN
    ALTER TABLE customers ADD COLUMN contact text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'email_voor_contact') THEN
    ALTER TABLE customers ADD COLUMN email_voor_contact text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'www') THEN
    ALTER TABLE customers ADD COLUMN www text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'mobiele_telefoon') THEN
    ALTER TABLE customers ADD COLUMN mobiele_telefoon text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'email_voor_factuur') THEN
    ALTER TABLE customers ADD COLUMN email_voor_factuur text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'email_verzenden') THEN
    ALTER TABLE customers ADD COLUMN email_verzenden text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'e_factuur') THEN
    ALTER TABLE customers ADD COLUMN e_factuur text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'contact_voor_levering') THEN
    ALTER TABLE customers ADD COLUMN contact_voor_levering text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'te_leveren_telefoon') THEN
    ALTER TABLE customers ADD COLUMN te_leveren_telefoon text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'te_leveren_email') THEN
    ALTER TABLE customers ADD COLUMN te_leveren_email text;
  END IF;
END $$;

-- Add business configuration fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'crm_groep') THEN
    ALTER TABLE customers ADD COLUMN crm_groep text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'betaling') THEN
    ALTER TABLE customers ADD COLUMN betaling text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'betalingsformaat') THEN
    ALTER TABLE customers ADD COLUMN betalingsformaat text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'btw_nummer') THEN
    ALTER TABLE customers ADD COLUMN btw_nummer text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'prijslijst') THEN
    ALTER TABLE customers ADD COLUMN prijslijst text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'ons_rekeningnummer') THEN
    ALTER TABLE customers ADD COLUMN ons_rekeningnummer text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'filiaal') THEN
    ALTER TABLE customers ADD COLUMN filiaal text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'geblokkeerd') THEN
    ALTER TABLE customers ADD COLUMN geblokkeerd boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'bankrekening') THEN
    ALTER TABLE customers ADD COLUMN bankrekening text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'transportmethode') THEN
    ALTER TABLE customers ADD COLUMN transportmethode text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'leveringsvoorwaarde') THEN
    ALTER TABLE customers ADD COLUMN leveringsvoorwaarde text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'kvk_nummer') THEN
    ALTER TABLE customers ADD COLUMN kvk_nummer text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'gemaakt') THEN
    ALTER TABLE customers ADD COLUMN gemaakt timestamptz;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'bedrijfsstatus') THEN
    ALTER TABLE customers ADD COLUMN bedrijfsstatus text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'weekdagen') THEN
    ALTER TABLE customers ADD COLUMN weekdagen text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'automatische_orderbevestiging') THEN
    ALTER TABLE customers ADD COLUMN automatische_orderbevestiging boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'bezogtijden') THEN
    ALTER TABLE customers ADD COLUMN bezogtijden text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'weekfactuur') THEN
    ALTER TABLE customers ADD COLUMN weekfactuur text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'account_manager') THEN
    ALTER TABLE customers ADD COLUMN account_manager text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'link_naar_payt') THEN
    ALTER TABLE customers ADD COLUMN link_naar_payt text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'uniconta_synced_at') THEN
    ALTER TABLE customers ADD COLUMN uniconta_synced_at timestamptz;
  END IF;
END $$;

-- Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_customers_btw_nummer ON customers(btw_nummer);
CREATE INDEX IF NOT EXISTS idx_customers_kvk_nummer ON customers(kvk_nummer);
CREATE INDEX IF NOT EXISTS idx_customers_crm_groep ON customers(crm_groep);
CREATE INDEX IF NOT EXISTS idx_customers_account_manager ON customers(account_manager);
CREATE INDEX IF NOT EXISTS idx_customers_geblokkeerd ON customers(geblokkeerd);