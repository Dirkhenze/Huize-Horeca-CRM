/*
  # Create Analytics Views for Trendz AI

  ## Views Created

  ### v_sales_by_customer_period
  - Aggregates sales data per customer per week
  - Useful for detecting abnormal customer behavior
  - Includes revenue, volume, and order count

  ### v_sales_by_group_period
  - Aggregates sales per product group per week
  - Helps identify product category trends
  - Useful for group-level anomaly detection

  ### v_market_benchmark
  - Benchmark data per region/segment per month
  - Calculates growth percentages
  - Identifies markets lagging behind

  ### v_latest_price_per_product
  - Most recent price list per product
  - Used for price list uploads and margin control

  ### v_inventory_by_product
  - Current inventory position per product
  - Shows free stock, on-hand, and minimum levels

  ### v_driver_availability
  - Driver availability schedule
  - Can be expanded to calendar view

  ## Notes
  - All views respect company boundaries
  - Views can be used directly in frontend or via Edge Functions
*/

-- 1) Sales per customer per period (for detecting abnormal customer behavior)
CREATE OR REPLACE VIEW v_sales_by_customer_period AS
SELECT
  o.company_id,
  o.customer_id,
  c.name as customer_name,
  c.region,
  DATE_TRUNC('week', o.order_date) as week,
  SUM(ol.total_net) as revenue_net,
  SUM(ol.qty) as volume_qty,
  COUNT(DISTINCT o.id) as order_count,
  AVG(ol.total_net) as avg_order_value
FROM orders o
JOIN order_lines ol ON ol.order_id = o.id
JOIN customers c ON c.id = o.customer_id
WHERE o.status != 'cancelled'
GROUP BY 1, 2, 3, 4, 5;

-- 2) Sales per product group per period (for group-level behavior analysis)
CREATE OR REPLACE VIEW v_sales_by_group_period AS
SELECT
  p.company_id,
  p.group_id,
  pg.name as group_name,
  DATE_TRUNC('week', o.order_date) as week,
  SUM(ol.total_net) as revenue_net,
  SUM(ol.qty) as volume_qty,
  COUNT(DISTINCT o.id) as order_count,
  COUNT(DISTINCT o.customer_id) as customer_count
FROM orders o
JOIN order_lines ol ON ol.order_id = o.id
JOIN products p ON p.id = ol.product_id
LEFT JOIN product_groups pg ON pg.id = p.group_id
WHERE o.status != 'cancelled'
GROUP BY 1, 2, 3, 4;

-- 3) Market benchmark per segment/region (for market lag detection)
CREATE OR REPLACE VIEW v_market_benchmark AS
WITH rev_by_region AS (
  SELECT
    c.company_id,
    c.region,
    DATE_TRUNC('month', o.order_date) as month,
    SUM(ol.total_net) as revenue_net,
    COUNT(DISTINCT o.customer_id) as customer_count,
    COUNT(DISTINCT o.id) as order_count
  FROM orders o
  JOIN order_lines ol ON ol.order_id = o.id
  JOIN customers c ON c.id = o.customer_id
  WHERE o.status != 'cancelled'
  GROUP BY 1, 2, 3
)
SELECT
  company_id,
  region,
  month,
  revenue_net,
  customer_count,
  order_count,
  LAG(revenue_net) OVER (PARTITION BY company_id, region ORDER BY month) as revenue_prev,
  CASE
    WHEN LAG(revenue_net) OVER (PARTITION BY company_id, region ORDER BY month) > 0
    THEN (revenue_net - LAG(revenue_net) OVER (PARTITION BY company_id, region ORDER BY month))
         / NULLIF(LAG(revenue_net) OVER (PARTITION BY company_id, region ORDER BY month), 0) * 100
    ELSE NULL
  END as growth_pct
FROM rev_by_region;

-- 4) Latest price per product (for price list uploads & margin control)
CREATE OR REPLACE VIEW v_latest_price_per_product AS
SELECT DISTINCT ON (pli.product_id)
  pl.company_id,
  pli.product_id,
  p.sku,
  p.name as product_name,
  pli.net_price,
  pli.currency,
  p.list_price,
  p.cost_price,
  CASE
    WHEN p.cost_price > 0
    THEN ((pli.net_price - p.cost_price) / NULLIF(p.cost_price, 0) * 100)
    ELSE NULL
  END as margin_pct,
  pl.valid_from,
  pl.valid_to,
  pl.id as price_list_id,
  pl.name as price_list_name
FROM price_list_items pli
JOIN price_lists pl ON pl.id = pli.price_list_id
JOIN products p ON p.id = pli.product_id
ORDER BY pli.product_id, pl.valid_from DESC NULLS LAST, pl.created_at DESC;

-- 5) Inventory position per product (warehouse)
CREATE OR REPLACE VIEW v_inventory_by_product AS
SELECT
  i.product_id,
  p.company_id,
  p.sku,
  p.name as product_name,
  p.unit,
  pg.name as group_name,
  SUM(i.on_hand - i.reserved) as stock_free,
  SUM(i.on_hand) as stock_on_hand,
  SUM(i.reserved) as stock_reserved,
  SUM(COALESCE(i.min_level, 0)) as min_level,
  CASE
    WHEN SUM(COALESCE(i.min_level, 0)) > 0 AND SUM(i.on_hand - i.reserved) < SUM(COALESCE(i.min_level, 0))
    THEN true
    ELSE false
  END as needs_reorder
FROM inventory i
JOIN products p ON p.id = i.product_id
LEFT JOIN product_groups pg ON pg.id = p.group_id
GROUP BY 1, 2, 3, 4, 5, 6;

-- 6) Driver availability (expandable to calendar)
CREATE OR REPLACE VIEW v_driver_availability AS
SELECT
  d.id as driver_id,
  d.company_id,
  (d.first_name || ' ' || d.last_name) as driver_name,
  d.email,
  d.phone,
  d.active,
  da.day,
  da.start_time,
  da.end_time,
  EXTRACT(EPOCH FROM (da.end_time - da.start_time)) / 3600 as hours_available
FROM drivers d
JOIN driver_availability da ON da.driver_id = d.id
WHERE d.active = true
ORDER BY d.last_name, d.first_name, da.day, da.start_time;

-- 7) Customer performance summary (useful for Trendz Top Kansen)
CREATE OR REPLACE VIEW v_customer_performance AS
WITH recent_orders AS (
  SELECT
    o.customer_id,
    o.company_id,
    SUM(ol.total_net) as revenue_30d,
    COUNT(DISTINCT o.id) as order_count_30d,
    MAX(o.order_date) as last_order_date
  FROM orders o
  JOIN order_lines ol ON ol.order_id = o.id
  WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days'
    AND o.status != 'cancelled'
  GROUP BY 1, 2
),
prev_orders AS (
  SELECT
    o.customer_id,
    o.company_id,
    SUM(ol.total_net) as revenue_prev_30d,
    COUNT(DISTINCT o.id) as order_count_prev_30d
  FROM orders o
  JOIN order_lines ol ON ol.order_id = o.id
  WHERE o.order_date >= CURRENT_DATE - INTERVAL '60 days'
    AND o.order_date < CURRENT_DATE - INTERVAL '30 days'
    AND o.status != 'cancelled'
  GROUP BY 1, 2
)
SELECT
  c.id as customer_id,
  c.company_id,
  c.customer_number,
  c.name as customer_name,
  c.region,
  c.email,
  c.phone,
  COALESCE(ro.revenue_30d, 0) as revenue_30d,
  COALESCE(ro.order_count_30d, 0) as order_count_30d,
  COALESCE(po.revenue_prev_30d, 0) as revenue_prev_30d,
  COALESCE(po.order_count_prev_30d, 0) as order_count_prev_30d,
  CASE
    WHEN po.revenue_prev_30d > 0
    THEN ((ro.revenue_30d - po.revenue_prev_30d) / NULLIF(po.revenue_prev_30d, 0) * 100)
    ELSE NULL
  END as revenue_growth_pct,
  ro.last_order_date,
  CURRENT_DATE - ro.last_order_date as days_since_last_order
FROM customers c
LEFT JOIN recent_orders ro ON ro.customer_id = c.id
LEFT JOIN prev_orders po ON po.customer_id = c.id;

-- 8) Product performance summary (for inventory and sales insights)
CREATE OR REPLACE VIEW v_product_performance AS
WITH recent_sales AS (
  SELECT
    ol.product_id,
    SUM(ol.qty) as qty_sold_30d,
    SUM(ol.total_net) as revenue_30d,
    COUNT(DISTINCT o.customer_id) as customer_count_30d
  FROM order_lines ol
  JOIN orders o ON o.id = ol.order_id
  WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days'
    AND o.status != 'cancelled'
  GROUP BY 1
)
SELECT
  p.id as product_id,
  p.company_id,
  p.sku,
  p.name as product_name,
  pg.name as group_name,
  p.unit,
  p.list_price,
  p.cost_price,
  COALESCE(rs.qty_sold_30d, 0) as qty_sold_30d,
  COALESCE(rs.revenue_30d, 0) as revenue_30d,
  COALESCE(rs.customer_count_30d, 0) as customer_count_30d,
  COALESCE(inv.stock_on_hand, 0) as stock_on_hand,
  COALESCE(inv.stock_free, 0) as stock_free,
  COALESCE(inv.min_level, 0) as min_level,
  COALESCE(inv.needs_reorder, false) as needs_reorder
FROM products p
LEFT JOIN product_groups pg ON pg.id = p.group_id
LEFT JOIN recent_sales rs ON rs.product_id = p.id
LEFT JOIN v_inventory_by_product inv ON inv.product_id = p.id;
