/*
  # Create Core Schema for Huize Horeca ERP

  ## New Tables

  ### Companies
  - `id` (uuid, primary key)
  - `name` (text) - Company name
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### Customers
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `customer_number` (text, unique per company)
  - `name` (text)
  - `region` (text) - For market segmentation
  - `email` (text)
  - `phone` (text)
  - `address` (text)
  - `city` (text)
  - `postal_code` (text)
  - `country` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### Product Groups
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `name` (text)
  - `description` (text)
  - `created_at` (timestamptz)

  ### Products
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `group_id` (uuid, foreign key)
  - `sku` (text, unique per company)
  - `name` (text)
  - `description` (text)
  - `unit` (text) - e.g., 'liter', 'kg', 'piece'
  - `list_price` (decimal)
  - `cost_price` (decimal)
  - `uniconta_id` (text) - External system reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### Orders
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `customer_id` (uuid, foreign key)
  - `order_number` (text, unique per company)
  - `order_date` (date)
  - `delivery_date` (date)
  - `status` (text) - 'draft', 'confirmed', 'delivered', 'invoiced', 'cancelled'
  - `notes` (text)
  - `uniconta_id` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### Order Lines
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key)
  - `product_id` (uuid, foreign key)
  - `qty` (decimal)
  - `unit_price` (decimal)
  - `discount_pct` (decimal)
  - `total_net` (decimal)
  - `created_at` (timestamptz)

  ### Inventory
  - `id` (uuid, primary key)
  - `product_id` (uuid, foreign key)
  - `warehouse_location` (text)
  - `on_hand` (decimal)
  - `reserved` (decimal)
  - `min_level` (decimal)
  - `updated_at` (timestamptz)

  ### Price Lists
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `name` (text)
  - `valid_from` (date)
  - `valid_to` (date)
  - `created_at` (timestamptz)

  ### Price List Items
  - `id` (uuid, primary key)
  - `price_list_id` (uuid, foreign key)
  - `product_id` (uuid, foreign key)
  - `net_price` (decimal)
  - `currency` (text)
  - `created_at` (timestamptz)

  ### Drivers
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `first_name` (text)
  - `last_name` (text)
  - `email` (text)
  - `phone` (text)
  - `license_number` (text)
  - `active` (boolean)
  - `created_at` (timestamptz)

  ### Driver Availability
  - `id` (uuid, primary key)
  - `driver_id` (uuid, foreign key)
  - `day` (date)
  - `start_time` (time)
  - `end_time` (time)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users based on company_id
*/

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM user_companies WHERE company_id = id));

-- User Companies (junction table for multi-tenancy)
CREATE TABLE IF NOT EXISTS user_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_id)
);

ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own company memberships"
  ON user_companies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  customer_number text NOT NULL,
  name text NOT NULL,
  region text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'NL',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, customer_number)
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view customers in own company"
  ON customers FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert customers in own company"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update customers in own company"
  ON customers FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete customers in own company"
  ON customers FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

-- Product Groups
CREATE TABLE IF NOT EXISTS product_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view product groups in own company"
  ON product_groups FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert product groups in own company"
  ON product_groups FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update product groups in own company"
  ON product_groups FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete product groups in own company"
  ON product_groups FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  group_id uuid REFERENCES product_groups(id) ON DELETE SET NULL,
  sku text NOT NULL,
  name text NOT NULL,
  description text,
  unit text DEFAULT 'piece',
  list_price decimal(10,2) DEFAULT 0,
  cost_price decimal(10,2) DEFAULT 0,
  uniconta_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, sku)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view products in own company"
  ON products FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert products in own company"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update products in own company"
  ON products FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete products in own company"
  ON products FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  order_number text NOT NULL,
  order_date date NOT NULL DEFAULT CURRENT_DATE,
  delivery_date date,
  status text DEFAULT 'draft',
  notes text,
  uniconta_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, order_number)
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view orders in own company"
  ON orders FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert orders in own company"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update orders in own company"
  ON orders FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete orders in own company"
  ON orders FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

-- Order Lines
CREATE TABLE IF NOT EXISTS order_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  qty decimal(10,2) NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  discount_pct decimal(5,2) DEFAULT 0,
  total_net decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view order lines in own company"
  ON order_lines FOR SELECT
  TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can insert order lines in own company"
  ON order_lines FOR INSERT
  TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can update order lines in own company"
  ON order_lines FOR UPDATE
  TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())))
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can delete order lines in own company"
  ON order_lines FOR DELETE
  TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  warehouse_location text DEFAULT 'main',
  on_hand decimal(10,2) DEFAULT 0,
  reserved decimal(10,2) DEFAULT 0,
  min_level decimal(10,2) DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, warehouse_location)
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inventory in own company"
  ON inventory FOR SELECT
  TO authenticated
  USING (product_id IN (SELECT id FROM products WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can insert inventory in own company"
  ON inventory FOR INSERT
  TO authenticated
  WITH CHECK (product_id IN (SELECT id FROM products WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can update inventory in own company"
  ON inventory FOR UPDATE
  TO authenticated
  USING (product_id IN (SELECT id FROM products WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())))
  WITH CHECK (product_id IN (SELECT id FROM products WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can delete inventory in own company"
  ON inventory FOR DELETE
  TO authenticated
  USING (product_id IN (SELECT id FROM products WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

-- Price Lists
CREATE TABLE IF NOT EXISTS price_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  valid_from date,
  valid_to date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view price lists in own company"
  ON price_lists FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert price lists in own company"
  ON price_lists FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update price lists in own company"
  ON price_lists FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete price lists in own company"
  ON price_lists FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

-- Price List Items
CREATE TABLE IF NOT EXISTS price_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price_list_id uuid REFERENCES price_lists(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  net_price decimal(10,2) NOT NULL,
  currency text DEFAULT 'EUR',
  created_at timestamptz DEFAULT now(),
  UNIQUE(price_list_id, product_id)
);

ALTER TABLE price_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view price list items in own company"
  ON price_list_items FOR SELECT
  TO authenticated
  USING (price_list_id IN (SELECT id FROM price_lists WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can insert price list items in own company"
  ON price_list_items FOR INSERT
  TO authenticated
  WITH CHECK (price_list_id IN (SELECT id FROM price_lists WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can update price list items in own company"
  ON price_list_items FOR UPDATE
  TO authenticated
  USING (price_list_id IN (SELECT id FROM price_lists WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())))
  WITH CHECK (price_list_id IN (SELECT id FROM price_lists WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can delete price list items in own company"
  ON price_list_items FOR DELETE
  TO authenticated
  USING (price_list_id IN (SELECT id FROM price_lists WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  license_number text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view drivers in own company"
  ON drivers FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert drivers in own company"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can update drivers in own company"
  ON drivers FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete drivers in own company"
  ON drivers FOR DELETE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid()));

-- Driver Availability
CREATE TABLE IF NOT EXISTS driver_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE NOT NULL,
  day date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(driver_id, day, start_time)
);

ALTER TABLE driver_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view driver availability in own company"
  ON driver_availability FOR SELECT
  TO authenticated
  USING (driver_id IN (SELECT id FROM drivers WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can insert driver availability in own company"
  ON driver_availability FOR INSERT
  TO authenticated
  WITH CHECK (driver_id IN (SELECT id FROM drivers WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can update driver availability in own company"
  ON driver_availability FOR UPDATE
  TO authenticated
  USING (driver_id IN (SELECT id FROM drivers WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())))
  WITH CHECK (driver_id IN (SELECT id FROM drivers WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

CREATE POLICY "Users can delete driver availability in own company"
  ON driver_availability FOR DELETE
  TO authenticated
  USING (driver_id IN (SELECT id FROM drivers WHERE company_id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_company ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_number ON customers(customer_number);
CREATE INDEX IF NOT EXISTS idx_products_company ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_group ON products(group_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_company ON orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_lines_order ON order_lines(order_id);
CREATE INDEX IF NOT EXISTS idx_order_lines_product ON order_lines(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_drivers_company ON drivers(company_id);
CREATE INDEX IF NOT EXISTS idx_driver_availability_driver ON driver_availability(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_availability_day ON driver_availability(day);
