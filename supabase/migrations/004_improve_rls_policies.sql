/*
  # Improve RLS Policies with JWT Company ID Pattern

  ## Changes

  1. **Add company_id to JWT claims**
     - Uses auth.jwt() ->> 'company_id' pattern
     - More performant than subquery lookups
     - Standard multi-tenant pattern

  2. **Update all RLS policies**
     - Replace subquery-based policies with JWT claim checks
     - Add policies for tables that reference other tables
     - Ensure all CRUD operations are covered

  3. **Performance improvements**
     - Direct JWT claim access is faster than joining user_companies
     - Indexes already in place support these queries

  ## Notes
  - For production: Set company_id in JWT during signup via Auth hook
  - Service role key bypasses RLS (use for ETL/cron jobs)
  - User tokens must include company_id claim for these policies to work
*/

-- Drop existing policies and recreate with JWT pattern
-- Companies
DROP POLICY IF EXISTS "Users can view own company" ON companies;
CREATE POLICY "tenant_select_companies"
  ON companies FOR SELECT
  TO authenticated
  USING (id = (auth.jwt() ->> 'company_id')::uuid);

-- Customers
DROP POLICY IF EXISTS "Users can view customers in own company" ON customers;
DROP POLICY IF EXISTS "Users can insert customers in own company" ON customers;
DROP POLICY IF EXISTS "Users can update customers in own company" ON customers;
DROP POLICY IF EXISTS "Users can delete customers in own company" ON customers;

CREATE POLICY "tenant_select_customers"
  ON customers FOR SELECT
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_insert_customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_update_customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid)
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_delete_customers"
  ON customers FOR DELETE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

-- Product Groups
DROP POLICY IF EXISTS "Users can view product groups in own company" ON product_groups;
DROP POLICY IF EXISTS "Users can insert product groups in own company" ON product_groups;
DROP POLICY IF EXISTS "Users can update product groups in own company" ON product_groups;
DROP POLICY IF EXISTS "Users can delete product groups in own company" ON product_groups;

CREATE POLICY "tenant_select_product_groups"
  ON product_groups FOR SELECT
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_insert_product_groups"
  ON product_groups FOR INSERT
  TO authenticated
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_update_product_groups"
  ON product_groups FOR UPDATE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid)
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_delete_product_groups"
  ON product_groups FOR DELETE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

-- Products
DROP POLICY IF EXISTS "Users can view products in own company" ON products;
DROP POLICY IF EXISTS "Users can insert products in own company" ON products;
DROP POLICY IF EXISTS "Users can update products in own company" ON products;
DROP POLICY IF EXISTS "Users can delete products in own company" ON products;

CREATE POLICY "tenant_select_products"
  ON products FOR SELECT
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_insert_products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_update_products"
  ON products FOR UPDATE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid)
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_delete_products"
  ON products FOR DELETE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

-- Orders
DROP POLICY IF EXISTS "Users can view orders in own company" ON orders;
DROP POLICY IF EXISTS "Users can insert orders in own company" ON orders;
DROP POLICY IF EXISTS "Users can update orders in own company" ON orders;
DROP POLICY IF EXISTS "Users can delete orders in own company" ON orders;

CREATE POLICY "tenant_select_orders"
  ON orders FOR SELECT
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_insert_orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_update_orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid)
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_delete_orders"
  ON orders FOR DELETE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

-- Order Lines (via join to orders)
DROP POLICY IF EXISTS "Users can view order lines in own company" ON order_lines;
DROP POLICY IF EXISTS "Users can insert order lines in own company" ON order_lines;
DROP POLICY IF EXISTS "Users can update order lines in own company" ON order_lines;
DROP POLICY IF EXISTS "Users can delete order lines in own company" ON order_lines;

CREATE POLICY "tenant_select_order_lines"
  ON order_lines FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id
        AND o.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_insert_order_lines"
  ON order_lines FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id
        AND o.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_update_order_lines"
  ON order_lines FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id
        AND o.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id
        AND o.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_delete_order_lines"
  ON order_lines FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id
        AND o.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

-- Inventory (via join to products)
DROP POLICY IF EXISTS "Users can view inventory in own company" ON inventory;
DROP POLICY IF EXISTS "Users can insert inventory in own company" ON inventory;
DROP POLICY IF EXISTS "Users can update inventory in own company" ON inventory;
DROP POLICY IF EXISTS "Users can delete inventory in own company" ON inventory;

CREATE POLICY "tenant_select_inventory"
  ON inventory FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_id
        AND p.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_insert_inventory"
  ON inventory FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_id
        AND p.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_update_inventory"
  ON inventory FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_id
        AND p.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_id
        AND p.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_delete_inventory"
  ON inventory FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_id
        AND p.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

-- Price Lists
DROP POLICY IF EXISTS "Users can view price lists in own company" ON price_lists;
DROP POLICY IF EXISTS "Users can insert price lists in own company" ON price_lists;
DROP POLICY IF EXISTS "Users can update price lists in own company" ON price_lists;
DROP POLICY IF EXISTS "Users can delete price lists in own company" ON price_lists;

CREATE POLICY "tenant_select_price_lists"
  ON price_lists FOR SELECT
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_insert_price_lists"
  ON price_lists FOR INSERT
  TO authenticated
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_update_price_lists"
  ON price_lists FOR UPDATE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid)
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_delete_price_lists"
  ON price_lists FOR DELETE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

-- Price List Items (via join to price_lists)
DROP POLICY IF EXISTS "Users can view price list items in own company" ON price_list_items;
DROP POLICY IF EXISTS "Users can insert price list items in own company" ON price_list_items;
DROP POLICY IF EXISTS "Users can update price list items in own company" ON price_list_items;
DROP POLICY IF EXISTS "Users can delete price list items in own company" ON price_list_items;

CREATE POLICY "tenant_select_price_list_items"
  ON price_list_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM price_lists pl
      WHERE pl.id = price_list_id
        AND pl.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_insert_price_list_items"
  ON price_list_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM price_lists pl
      WHERE pl.id = price_list_id
        AND pl.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_update_price_list_items"
  ON price_list_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM price_lists pl
      WHERE pl.id = price_list_id
        AND pl.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM price_lists pl
      WHERE pl.id = price_list_id
        AND pl.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_delete_price_list_items"
  ON price_list_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM price_lists pl
      WHERE pl.id = price_list_id
        AND pl.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

-- Drivers
DROP POLICY IF EXISTS "Users can view drivers in own company" ON drivers;
DROP POLICY IF EXISTS "Users can insert drivers in own company" ON drivers;
DROP POLICY IF EXISTS "Users can update drivers in own company" ON drivers;
DROP POLICY IF EXISTS "Users can delete drivers in own company" ON drivers;

CREATE POLICY "tenant_select_drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_insert_drivers"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_update_drivers"
  ON drivers FOR UPDATE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid)
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_delete_drivers"
  ON drivers FOR DELETE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

-- Driver Availability (via join to drivers)
DROP POLICY IF EXISTS "Users can view driver availability in own company" ON driver_availability;
DROP POLICY IF EXISTS "Users can insert driver availability in own company" ON driver_availability;
DROP POLICY IF EXISTS "Users can update driver availability in own company" ON driver_availability;
DROP POLICY IF EXISTS "Users can delete driver availability in own company" ON driver_availability;

CREATE POLICY "tenant_select_driver_availability"
  ON driver_availability FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM drivers d
      WHERE d.id = driver_id
        AND d.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_insert_driver_availability"
  ON driver_availability FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM drivers d
      WHERE d.id = driver_id
        AND d.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_update_driver_availability"
  ON driver_availability FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM drivers d
      WHERE d.id = driver_id
        AND d.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM drivers d
      WHERE d.id = driver_id
        AND d.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY "tenant_delete_driver_availability"
  ON driver_availability FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM drivers d
      WHERE d.id = driver_id
        AND d.company_id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

-- API Keys
DROP POLICY IF EXISTS "Users can view api keys in own company" ON api_keys;
DROP POLICY IF EXISTS "Users can insert api keys in own company" ON api_keys;
DROP POLICY IF EXISTS "Users can update api keys in own company" ON api_keys;
DROP POLICY IF EXISTS "Users can delete api keys in own company" ON api_keys;

CREATE POLICY "tenant_select_api_keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_insert_api_keys"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_update_api_keys"
  ON api_keys FOR UPDATE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid)
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_delete_api_keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);
