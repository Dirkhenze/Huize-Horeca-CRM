export interface Customer {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  customer_type: string;
  credit_limit: number;
  payment_terms: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: 'Brouwerijen' | 'Wijnen' | 'Food' | '';
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  payment_terms: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountManager {
  id: string;
  supplier_id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  supplier_id: string | null;
  unit: string;
  units_per_package: number;
  purchase_price: number;
  standard_price: number;
  barcode: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  order_date: string;
  delivery_date: string | null;
  status: 'concept' | 'bevestigd' | 'gepickt' | 'geleverd' | 'gefactureerd';
  total_amount: number;
  notes: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  capacity_kg: number;
  capacity_m3: number;
  status: 'actief' | 'onderhoud' | 'buiten_dienst';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  license_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  route_number: string;
  date: string;
  driver_id: string | null;
  vehicle_id: string | null;
  status: 'gepland' | 'onderweg' | 'voltooid';
  start_time: string | null;
  end_time: string | null;
  total_distance_km: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface AIInsight {
  id: string;
  insight_type: string;
  customer_id: string | null;
  product_id: string | null;
  title: string;
  description: string;
  score: number;
  recommended_action: string;
  status: 'nieuw' | 'bekeken' | 'actie_ondernomen' | 'genegeerd';
  generated_at: string;
  expires_at: string | null;
  metadata: any;
}

export interface TeamMember {
  id: string;
  user_id: string | null;
  name: string;
  role: 'sales' | 'inkoop' | 'logistiek' | 'magazijn' | '';
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stock {
  id: string;
  product_id: string;
  quantity_available: number;
  quantity_reserved: number;
  minimum_stock: number;
  location: string;
  last_counted: string | null;
  updated_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  customer_id: string | null;
  quote_date: string;
  valid_until: string | null;
  status: 'concept' | 'verzonden' | 'geaccepteerd' | 'afgewezen' | 'verlopen';
  total_amount: number;
  notes: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type NavCategory = 'sales' | 'inkoop' | 'logistiek' | 'magazijn' | 'verkoop' | 'trendz';
