/*
  # Expand Products Table - Complete Field Set

  1. New Columns Added
    - hoofdcategorie (text) - Main category
    - artikel_locatie (text) - Article location
    - gewicht (numeric) - Weight
    - minimumvoorraadniveau (numeric) - Minimum stock level
    - leverancier (text) - Supplier
    - artikelnummer_leverancier (text) - Supplier article number
    - groep (text) - Group
    - aantal_dozen (numeric) - Number of boxes
    - geblokkeerd (boolean) - Blocked status
    - magazijn (numeric) - Warehouse stock
    - besteld (numeric) - Ordered quantity
    - beschikbaar (numeric) - Available quantity
    - minimum_inkoophoeveelheid (numeric) - Minimum purchase quantity
    - afbeelding (text) - Image URL
    - leveringstijd (text) - Delivery time
    - prijs_emballage (numeric) - Packaging price
    - additionele_categorie (text) - Additional category
    - emballage_artikel (text) - Packaging article
    - in_voorraad_fysiek (numeric) - Physical stock
    - additional_group (text) - Additional group
    - sub_categorie (text) - Sub category
    - aantal_in_hectoliter (numeric) - Quantity in hectoliter
    - aantal_liter (numeric) - Quantity in liter
    - abv (numeric) - Alcohol by volume percentage
    - agentschap (text) - Agency
    - agentschapnummer (text) - Agency number
    - artikel_type (text) - Article type
    - bestelartikel (boolean) - Order article flag
    - carbonatie (text) - Carbonation
    - categorie (text) - Category
    - classificatie (text) - Classification
    - druifsoort (text) - Grape variety
    - ean_nummer (text) - EAN number
    - fruitcomponent (text) - Fruit component
    - horeca_adviesprijs (numeric) - Horeca recommended price
    - inhoud (text) - Content/Volume
    - inkoopaantal (numeric) - Purchase quantity
    - inkoopeenheid (text) - Purchase unit
    - inkoopprijs (numeric) - Purchase price
    - kortingsgroep (text) - Discount group
    - land_van_oorsprong (text) - Country of origin
    - merk (text) - Brand
    - omschrijving (text) - Description
    - slijterij_afhalen (boolean) - Liquor store pickup
    - slijterij_bezorgen (boolean) - Liquor store delivery
    - streek_regio (text) - Region
    - tapkoppeling (text) - Tap coupling
    - teeltwijze (text) - Cultivation method
    - type_sluiting (text) - Closure type
    - webshop (boolean) - Webshop availability
    - webshop_categorie (text) - Webshop category
    - wijnhuis (text) - Winery
    - wijnstijl (text) - Wine style

  2. Notes
    - All new fields are nullable to allow gradual data entry
    - Boolean fields default to false where applicable
    - Numeric fields use numeric type for precision
    - Text fields for flexibility in data entry
*/

-- Add all new columns to products table
DO $$ 
BEGIN
  -- Basic product information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'hoofdcategorie') THEN
    ALTER TABLE products ADD COLUMN hoofdcategorie text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'artikel_locatie') THEN
    ALTER TABLE products ADD COLUMN artikel_locatie text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'gewicht') THEN
    ALTER TABLE products ADD COLUMN gewicht numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'minimumvoorraadniveau') THEN
    ALTER TABLE products ADD COLUMN minimumvoorraadniveau numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'leverancier') THEN
    ALTER TABLE products ADD COLUMN leverancier text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'artikelnummer_leverancier') THEN
    ALTER TABLE products ADD COLUMN artikelnummer_leverancier text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'groep') THEN
    ALTER TABLE products ADD COLUMN groep text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'aantal_dozen') THEN
    ALTER TABLE products ADD COLUMN aantal_dozen numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'geblokkeerd') THEN
    ALTER TABLE products ADD COLUMN geblokkeerd boolean DEFAULT false;
  END IF;

  -- Inventory fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'magazijn') THEN
    ALTER TABLE products ADD COLUMN magazijn numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'besteld') THEN
    ALTER TABLE products ADD COLUMN besteld numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'beschikbaar') THEN
    ALTER TABLE products ADD COLUMN beschikbaar numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'minimum_inkoophoeveelheid') THEN
    ALTER TABLE products ADD COLUMN minimum_inkoophoeveelheid numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'afbeelding') THEN
    ALTER TABLE products ADD COLUMN afbeelding text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'leveringstijd') THEN
    ALTER TABLE products ADD COLUMN leveringstijd text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'prijs_emballage') THEN
    ALTER TABLE products ADD COLUMN prijs_emballage numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'additionele_categorie') THEN
    ALTER TABLE products ADD COLUMN additionele_categorie text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'emballage_artikel') THEN
    ALTER TABLE products ADD COLUMN emballage_artikel text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'in_voorraad_fysiek') THEN
    ALTER TABLE products ADD COLUMN in_voorraad_fysiek numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'additional_group') THEN
    ALTER TABLE products ADD COLUMN additional_group text;
  END IF;

  -- Category fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sub_categorie') THEN
    ALTER TABLE products ADD COLUMN sub_categorie text;
  END IF;

  -- Beverage specific fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'aantal_in_hectoliter') THEN
    ALTER TABLE products ADD COLUMN aantal_in_hectoliter numeric(10,4);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'aantal_liter') THEN
    ALTER TABLE products ADD COLUMN aantal_liter numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'abv') THEN
    ALTER TABLE products ADD COLUMN abv numeric(5,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'agentschap') THEN
    ALTER TABLE products ADD COLUMN agentschap text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'agentschapnummer') THEN
    ALTER TABLE products ADD COLUMN agentschapnummer text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'artikel_type') THEN
    ALTER TABLE products ADD COLUMN artikel_type text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'bestelartikel') THEN
    ALTER TABLE products ADD COLUMN bestelartikel boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'carbonatie') THEN
    ALTER TABLE products ADD COLUMN carbonatie text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'categorie') THEN
    ALTER TABLE products ADD COLUMN categorie text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'classificatie') THEN
    ALTER TABLE products ADD COLUMN classificatie text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'druifsoort') THEN
    ALTER TABLE products ADD COLUMN druifsoort text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'ean_nummer') THEN
    ALTER TABLE products ADD COLUMN ean_nummer text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'fruitcomponent') THEN
    ALTER TABLE products ADD COLUMN fruitcomponent text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'horeca_adviesprijs') THEN
    ALTER TABLE products ADD COLUMN horeca_adviesprijs numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'inhoud') THEN
    ALTER TABLE products ADD COLUMN inhoud text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'inkoopaantal') THEN
    ALTER TABLE products ADD COLUMN inkoopaantal numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'inkoopeenheid') THEN
    ALTER TABLE products ADD COLUMN inkoopeenheid text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'inkoopprijs') THEN
    ALTER TABLE products ADD COLUMN inkoopprijs numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'kortingsgroep') THEN
    ALTER TABLE products ADD COLUMN kortingsgroep text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'land_van_oorsprong') THEN
    ALTER TABLE products ADD COLUMN land_van_oorsprong text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'merk') THEN
    ALTER TABLE products ADD COLUMN merk text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'omschrijving') THEN
    ALTER TABLE products ADD COLUMN omschrijving text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'slijterij_afhalen') THEN
    ALTER TABLE products ADD COLUMN slijterij_afhalen boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'slijterij_bezorgen') THEN
    ALTER TABLE products ADD COLUMN slijterij_bezorgen boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'streek_regio') THEN
    ALTER TABLE products ADD COLUMN streek_regio text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tapkoppeling') THEN
    ALTER TABLE products ADD COLUMN tapkoppeling text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'teeltwijze') THEN
    ALTER TABLE products ADD COLUMN teeltwijze text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'type_sluiting') THEN
    ALTER TABLE products ADD COLUMN type_sluiting text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'webshop') THEN
    ALTER TABLE products ADD COLUMN webshop boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'webshop_categorie') THEN
    ALTER TABLE products ADD COLUMN webshop_categorie text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'wijnhuis') THEN
    ALTER TABLE products ADD COLUMN wijnhuis text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'wijnstijl') THEN
    ALTER TABLE products ADD COLUMN wijnstijl text;
  END IF;
END $$;
