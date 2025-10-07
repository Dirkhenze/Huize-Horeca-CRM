/*
  # Expand Products Table for Excel Import

  1. Changes
    - Add `artikelnummer` as alias for `sku` (add column)
    - Add `eenheid` as alias for `unit` (add column)
    - Add `artikelnaam` as alias for `name` (add column)
    - Add `inhoud` (content/package size)
    - Add `kostprijs` as alias for `cost_price`
    - Add `verkoopprijs_1` as alias for `list_price`
    - Add `verkoopprijs_2` (selling price 2)
    - Add `verkoopprijs_3` (selling price 3)
    - Add `category` field
    - Add `supplier` field
    - Add `barcode` field
    - Add `stock_quantity` field
    - Add `min_stock` field
    - Add `notes` field
    - Add `active` boolean field

  2. Notes
    - Keeps existing fields for backward compatibility
    - New fields support Dutch Excel imports
    - All new fields have sensible defaults
*/

DO $$
BEGIN
  -- Add artikelnummer if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'artikelnummer'
  ) THEN
    ALTER TABLE products ADD COLUMN artikelnummer text;
    UPDATE products SET artikelnummer = sku WHERE artikelnummer IS NULL;
  END IF;

  -- Add eenheid if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'eenheid'
  ) THEN
    ALTER TABLE products ADD COLUMN eenheid text DEFAULT '';
    UPDATE products SET eenheid = unit WHERE eenheid = '';
  END IF;

  -- Add artikelnaam if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'artikelnaam'
  ) THEN
    ALTER TABLE products ADD COLUMN artikelnaam text;
    UPDATE products SET artikelnaam = name WHERE artikelnaam IS NULL;
  END IF;

  -- Add inhoud if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'inhoud'
  ) THEN
    ALTER TABLE products ADD COLUMN inhoud text DEFAULT '';
  END IF;

  -- Add kostprijs if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'kostprijs'
  ) THEN
    ALTER TABLE products ADD COLUMN kostprijs decimal(10,2) DEFAULT 0.00;
    UPDATE products SET kostprijs = cost_price WHERE kostprijs = 0.00;
  END IF;

  -- Add verkoopprijs_1 if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'verkoopprijs_1'
  ) THEN
    ALTER TABLE products ADD COLUMN verkoopprijs_1 decimal(10,2) DEFAULT 0.00;
    UPDATE products SET verkoopprijs_1 = list_price WHERE verkoopprijs_1 = 0.00;
  END IF;

  -- Add verkoopprijs_2 if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'verkoopprijs_2'
  ) THEN
    ALTER TABLE products ADD COLUMN verkoopprijs_2 decimal(10,2) DEFAULT 0.00;
  END IF;

  -- Add verkoopprijs_3 if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'verkoopprijs_3'
  ) THEN
    ALTER TABLE products ADD COLUMN verkoopprijs_3 decimal(10,2) DEFAULT 0.00;
  END IF;

  -- Add category if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category'
  ) THEN
    ALTER TABLE products ADD COLUMN category text DEFAULT '';
  END IF;

  -- Add supplier if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'supplier'
  ) THEN
    ALTER TABLE products ADD COLUMN supplier text DEFAULT '';
  END IF;

  -- Add barcode if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'barcode'
  ) THEN
    ALTER TABLE products ADD COLUMN barcode text DEFAULT '';
  END IF;

  -- Add stock_quantity if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity integer DEFAULT 0;
  END IF;

  -- Add min_stock if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'min_stock'
  ) THEN
    ALTER TABLE products ADD COLUMN min_stock integer DEFAULT 0;
  END IF;

  -- Add notes if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'notes'
  ) THEN
    ALTER TABLE products ADD COLUMN notes text DEFAULT '';
  END IF;

  -- Add active if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'active'
  ) THEN
    ALTER TABLE products ADD COLUMN active boolean DEFAULT true;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_artikelnummer ON products(artikelnummer);
CREATE INDEX IF NOT EXISTS idx_products_artikelnaam ON products(artikelnaam);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
