/*
  # Seed Demo Data for Development

  ## Demo Company Setup

  1. **Company**: Huize Horeca Demo
  2. **Customers**: 5 demo customers in various regions
  3. **Product Groups**: Bier, Wijn, Spirits, Food
  4. **Products**: 10 demo products with realistic data
  5. **Warehouse**: Main warehouse with inventory
  6. **Drivers**: 2 demo drivers with availability
  7. **Orders**: Sample orders with line items
  8. **Price Lists**: Demo price list

  ## Notes
  - This data is for development/testing only
  - Run this AFTER user signup to connect demo company to user
  - User must have company_id set in JWT claims
*/

-- Insert demo company
INSERT INTO companies (id, name, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Huize Horeca Demo', now())
ON CONFLICT (id) DO NOTHING;

-- Insert demo customers
INSERT INTO customers (company_id, customer_number, name, region, email, phone, address, city, postal_code, country)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'CUST001', 'Café De Brug', 'Noord', 'info@cafedebrug.nl', '0201234567', 'Brugstraat 12', 'Amsterdam', '1012 AB', 'NL'),
  ('00000000-0000-0000-0000-000000000001', 'CUST002', 'Restaurant Het Anker', 'Zuid', 'contact@hetanker.nl', '0207654321', 'Ankerplein 8', 'Rotterdam', '3011 CD', 'NL'),
  ('00000000-0000-0000-0000-000000000001', 'CUST003', 'Bar Central', 'Oost', 'info@barcentral.nl', '0301112233', 'Centrumstraat 45', 'Utrecht', '3511 EF', 'NL'),
  ('00000000-0000-0000-0000-000000000001', 'CUST004', 'Hotel De Gouden Leeuw', 'West', 'receptie@goudenleeuw.nl', '0505556677', 'Hotelweg 23', 'Den Haag', '2511 GH', 'NL'),
  ('00000000-0000-0000-0000-000000000001', 'CUST005', 'Eetcafé De Vriendschap', 'Centrum', 'info@devriendschap.nl', '0208889900', 'Vriendschapsplein 5', 'Amsterdam', '1013 IJ', 'NL')
ON CONFLICT (company_id, customer_number) DO NOTHING;

-- Insert product groups
INSERT INTO product_groups (company_id, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Bier', 'Bier en bierproducten'),
  ('00000000-0000-0000-0000-000000000001', 'Wijn', 'Rode, witte en rosé wijnen'),
  ('00000000-0000-0000-0000-000000000001', 'Spirits', 'Sterke dranken'),
  ('00000000-0000-0000-0000-000000000001', 'Frisdrank', 'Frisdranken en mixers')
ON CONFLICT DO NOTHING;

-- Insert demo products
INSERT INTO products (company_id, group_id, sku, name, description, unit, list_price, cost_price)
SELECT
  '00000000-0000-0000-0000-000000000001',
  pg.id,
  vals.sku,
  vals.name,
  vals.description,
  vals.unit,
  vals.list_price,
  vals.cost_price
FROM product_groups pg
CROSS JOIN LATERAL (
  VALUES
    ('PILS-30L', 'Pils Fust 30L', 'Premium pils fust 30 liter', 'liter', 85.00, 65.00),
    ('SPEC-20L', 'Speciaal Bier 20L', 'Speciaal bier fust 20 liter', 'liter', 72.00, 55.00)
) AS vals(sku, name, description, unit, list_price, cost_price)
WHERE pg.name = 'Bier' AND pg.company_id = '00000000-0000-0000-0000-000000000001'
ON CONFLICT (company_id, sku) DO NOTHING;

INSERT INTO products (company_id, group_id, sku, name, description, unit, list_price, cost_price)
SELECT
  '00000000-0000-0000-0000-000000000001',
  pg.id,
  vals.sku,
  vals.name,
  vals.description,
  vals.unit,
  vals.list_price,
  vals.cost_price
FROM product_groups pg
CROSS JOIN LATERAL (
  VALUES
    ('WINE-R-6x75', 'Huiswijn Rood 6x75cl', 'Huiswijn rood per doos', 'case', 28.00, 18.00),
    ('WINE-W-6x75', 'Huiswijn Wit 6x75cl', 'Huiswijn wit per doos', 'case', 28.00, 18.00),
    ('WINE-P-6x75', 'Prosecco 6x75cl', 'Prosecco mousserende wijn', 'case', 45.00, 32.00)
) AS vals(sku, name, description, unit, list_price, cost_price)
WHERE pg.name = 'Wijn' AND pg.company_id = '00000000-0000-0000-0000-000000000001'
ON CONFLICT (company_id, sku) DO NOTHING;

INSERT INTO products (company_id, group_id, sku, name, description, unit, list_price, cost_price)
SELECT
  '00000000-0000-0000-0000-000000000001',
  pg.id,
  vals.sku,
  vals.name,
  vals.description,
  vals.unit,
  vals.list_price,
  vals.cost_price
FROM product_groups pg
CROSS JOIN LATERAL (
  VALUES
    ('VODKA-1L', 'Vodka 1L', 'Premium vodka 1 liter', 'liter', 18.50, 12.00),
    ('GIN-70CL', 'Gin 70cl', 'Premium gin 70cl', 'piece', 22.00, 15.00),
    ('WHISKY-70CL', 'Whisky 70cl', 'Blended whisky 70cl', 'piece', 25.00, 17.50)
) AS vals(sku, name, description, unit, list_price, cost_price)
WHERE pg.name = 'Spirits' AND pg.company_id = '00000000-0000-0000-0000-000000000001'
ON CONFLICT (company_id, sku) DO NOTHING;

INSERT INTO products (company_id, group_id, sku, name, description, unit, list_price, cost_price)
SELECT
  '00000000-0000-0000-0000-000000000001',
  pg.id,
  vals.sku,
  vals.name,
  vals.description,
  vals.unit,
  vals.list_price,
  vals.cost_price
FROM product_groups pg
CROSS JOIN LATERAL (
  VALUES
    ('COLA-24x33', 'Cola 24x33cl', 'Cola blikjes per tray', 'case', 12.00, 8.00),
    ('TONIC-24x20', 'Tonic Water 24x20cl', 'Tonic water per tray', 'case', 15.00, 10.00)
) AS vals(sku, name, description, unit, list_price, cost_price)
WHERE pg.name = 'Frisdrank' AND pg.company_id = '00000000-0000-0000-0000-000000000001'
ON CONFLICT (company_id, sku) DO NOTHING;

-- Insert inventory for products
INSERT INTO inventory (product_id, warehouse_location, on_hand, reserved, min_level)
SELECT
  p.id,
  'main',
  CASE
    WHEN p.unit = 'liter' THEN 150
    WHEN p.unit = 'case' THEN 80
    ELSE 50
  END as on_hand,
  CASE
    WHEN p.unit = 'liter' THEN 15
    WHEN p.unit = 'case' THEN 8
    ELSE 5
  END as reserved,
  CASE
    WHEN p.unit = 'liter' THEN 50
    WHEN p.unit = 'case' THEN 30
    ELSE 20
  END as min_level
FROM products p
WHERE p.company_id = '00000000-0000-0000-0000-000000000001'
ON CONFLICT (product_id, warehouse_location) DO NOTHING;

-- Insert sales team (accountmanagers)
INSERT INTO team_members (company_id, first_name, last_name, email, phone, role, employee_number, department, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Bobby', 'Klein', 'bobby.klein@huizehoreca.nl', '0612345601', 'sales', 'HH001', 'Verkoop', true),
  ('00000000-0000-0000-0000-000000000001', 'Dirk', 'Henze', 'dirk.henze@huizehoreca.nl', '0612345602', 'sales', 'HH002', 'Verkoop', true),
  ('00000000-0000-0000-0000-000000000001', 'Emile', 'Metekohy', 'emile.metekohy@huizehoreca.nl', '0612345603', 'sales', 'HH003', 'Verkoop', true),
  ('00000000-0000-0000-0000-000000000001', 'Maarten', 'Baas', 'maarten.baas@huizehoreca.nl', '0612345604', 'sales', 'HH004', 'Verkoop', true),
  ('00000000-0000-0000-0000-000000000001', 'Patrick', 'Wiersema', 'patrick.wiersema@huizehoreca.nl', '0612345605', 'sales', 'HH005', 'Verkoop', true),
  ('00000000-0000-0000-0000-000000000001', 'Paul', 'van Bennekom', 'paul.bennekom@huizehoreca.nl', '0612345606', 'sales', 'HH006', 'Verkoop', true),
  ('00000000-0000-0000-0000-000000000001', 'Ron', 'van den Wurf', 'ron.wurf@huizehoreca.nl', '0612345607', 'sales', 'HH007', 'Verkoop', true),
  ('00000000-0000-0000-0000-000000000001', 'Man', 'van Drank', 'man.drank@huizehoreca.nl', '0612345608', 'sales', 'HH008', 'Slijterij', true),
  ('00000000-0000-0000-0000-000000000001', 'Jan', 'Binnendienst', 'jan.binnen@huizehoreca.nl', '0612345609', 'sales', 'HH009', 'Binnendienst', true)
ON CONFLICT (company_id, employee_number) DO NOTHING;

-- Insert inkoop team
INSERT INTO team_members (company_id, first_name, last_name, email, phone, role, employee_number, department, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Lisa', 'van der Berg', 'lisa.berg@huizehoreca.nl', '0612345610', 'inkoop', 'HH010', 'Inkoop', true),
  ('00000000-0000-0000-0000-000000000001', 'Mark', 'de Vries', 'mark.vries@huizehoreca.nl', '0612345611', 'inkoop', 'HH011', 'Inkoop', true)
ON CONFLICT (company_id, employee_number) DO NOTHING;

-- Insert logistiek team
INSERT INTO team_members (company_id, first_name, last_name, email, phone, role, employee_number, department, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Kees', 'Janssen', 'kees.janssen@huizehoreca.nl', '0612345612', 'logistiek', 'HH012', 'Logistiek', true),
  ('00000000-0000-0000-0000-000000000001', 'Frank', 'Peters', 'frank.peters@huizehoreca.nl', '0612345613', 'logistiek', 'HH013', 'Logistiek', true)
ON CONFLICT (company_id, employee_number) DO NOTHING;

-- Insert magazijn team
INSERT INTO team_members (company_id, first_name, last_name, email, phone, role, employee_number, department, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Sara', 'Bakker', 'sara.bakker@huizehoreca.nl', '0612345614', 'magazijn', 'HH014', 'Magazijn', true),
  ('00000000-0000-0000-0000-000000000001', 'Tom', 'Smit', 'tom.smit@huizehoreca.nl', '0612345615', 'magazijn', 'HH015', 'Magazijn', true)
ON CONFLICT (company_id, employee_number) DO NOTHING;

-- Insert demo drivers
INSERT INTO drivers (company_id, first_name, last_name, email, phone, license_number, active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Jan', 'Jansen', 'jan.jansen@huizehoreca.test', '0612345678', 'BE123456', true),
  ('00000000-0000-0000-0000-000000000001', 'Piet', 'Pietersen', 'piet.pietersen@huizehoreca.test', '0687654321', 'BE654321', true)
ON CONFLICT DO NOTHING;

-- Insert driver availability
INSERT INTO driver_availability (driver_id, day, start_time, end_time)
SELECT
  d.id,
  vals.day,
  vals.start_time,
  vals.end_time
FROM drivers d
CROSS JOIN LATERAL (
  VALUES
    ('2025-10-13'::date, '08:00'::time, '16:00'::time),
    ('2025-10-14'::date, '08:00'::time, '16:00'::time),
    ('2025-10-15'::date, '08:00'::time, '16:00'::time),
    ('2025-10-16'::date, '10:00'::time, '18:00'::time),
    ('2025-10-17'::date, '10:00'::time, '18:00'::time)
) AS vals(day, start_time, end_time)
WHERE d.company_id = '00000000-0000-0000-0000-000000000001'
  AND d.first_name = 'Jan'
ON CONFLICT (driver_id, day, start_time) DO NOTHING;

INSERT INTO driver_availability (driver_id, day, start_time, end_time)
SELECT
  d.id,
  vals.day,
  vals.start_time,
  vals.end_time
FROM drivers d
CROSS JOIN LATERAL (
  VALUES
    ('2025-10-13'::date, '09:00'::time, '17:00'::time),
    ('2025-10-14'::date, '09:00'::time, '17:00'::time),
    ('2025-10-16'::date, '08:00'::time, '16:00'::time),
    ('2025-10-17'::date, '08:00'::time, '16:00'::time)
) AS vals(day, start_time, end_time)
WHERE d.company_id = '00000000-0000-0000-0000-000000000001'
  AND d.first_name = 'Piet'
ON CONFLICT (driver_id, day, start_time) DO NOTHING;

-- Insert demo price list
INSERT INTO price_lists (company_id, name, valid_from, valid_to)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Standaard Prijslijst 2025', '2025-01-01', '2025-12-31')
ON CONFLICT DO NOTHING;

-- Insert price list items
INSERT INTO price_list_items (price_list_id, product_id, net_price, currency)
SELECT
  pl.id,
  p.id,
  p.list_price * 0.95, -- 5% discount
  'EUR'
FROM price_lists pl
CROSS JOIN products p
WHERE pl.company_id = '00000000-0000-0000-0000-000000000001'
  AND p.company_id = '00000000-0000-0000-0000-000000000001'
  AND pl.name = 'Standaard Prijslijst 2025'
ON CONFLICT (price_list_id, product_id) DO NOTHING;

-- Insert demo orders
INSERT INTO orders (company_id, customer_id, order_number, order_date, delivery_date, status)
SELECT
  '00000000-0000-0000-0000-000000000001',
  c.id,
  'ORD-' || LPAD((ROW_NUMBER() OVER ())::text, 5, '0'),
  CURRENT_DATE - (ROW_NUMBER() OVER ()) * INTERVAL '1 day',
  CURRENT_DATE - (ROW_NUMBER() OVER ()) * INTERVAL '1 day' + INTERVAL '2 days',
  CASE
    WHEN ROW_NUMBER() OVER () <= 2 THEN 'delivered'
    WHEN ROW_NUMBER() OVER () <= 4 THEN 'confirmed'
    ELSE 'draft'
  END
FROM customers c
WHERE c.company_id = '00000000-0000-0000-0000-000000000001'
  AND c.customer_number IN ('CUST001', 'CUST002', 'CUST003')
ON CONFLICT (company_id, order_number) DO NOTHING;

-- Insert order lines for the orders
INSERT INTO order_lines (order_id, product_id, qty, unit_price, discount_pct, total_net)
SELECT
  o.id,
  p.id,
  CASE
    WHEN p.unit = 'liter' THEN 3
    WHEN p.unit = 'case' THEN 5
    ELSE 2
  END as qty,
  p.list_price,
  5.0 as discount_pct,
  CASE
    WHEN p.unit = 'liter' THEN 3 * p.list_price * 0.95
    WHEN p.unit = 'case' THEN 5 * p.list_price * 0.95
    ELSE 2 * p.list_price * 0.95
  END as total_net
FROM orders o
CROSS JOIN LATERAL (
  SELECT * FROM products
  WHERE company_id = '00000000-0000-0000-0000-000000000001'
  ORDER BY random()
  LIMIT 3
) p
WHERE o.company_id = '00000000-0000-0000-0000-000000000001'
ON CONFLICT DO NOTHING;
