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

export interface SalesTeamMember {
  id: string;
  company_id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  role: string;
  function_title: string;
  team_name: string;
  employee_number: string;
  is_active: boolean;
  notes: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierAccountManager {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  function_title: string;
  is_active: boolean;
  notes: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierAMAssignment {
  id: string;
  supplier_id: string;
  account_manager_id: string;
  is_primary: boolean;
  assigned_at: string;
  assigned_by: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
  account_manager?: SupplierAccountManager;
}

export interface AuditLogEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changed_by: string | null;
  changed_by_name: string;
  old_values: any;
  new_values: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
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
  company_id?: string;
  first_name: string;
  last_name: string;
  name?: string;
  role: 'sales' | 'inkoop' | 'logistiek' | 'magazijn' | '';
  email: string;
  phone: string;
  department?: string;
  avatar_url?: string;
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

export interface Lead {
  id: string;
  company_id: string;

  temporary_customer_id?: string;

  company_name: string;
  customer_type: string;
  account_manager_id: string | null;

  address: string;
  postal_code: string;
  city: string;
  region: string;
  delivery_address: string;

  delivery_preference_days: string;
  delivery_time_slots: string;
  delivery_instructions: string;

  contact_person: string;
  email: string;
  phone: string;
  contact_role: string;
  secondary_contact_name: string;
  secondary_contact_email: string;
  secondary_contact_phone: string;

  iban: string;
  account_holder_name: string;
  payment_terms: string;
  btw_number: string;

  assortment_interests: string;
  business_notes: string;

  status: 'Lead' | 'In behandeling' | 'Offerte' | 'Formulier gemaild' | 'Klant actief';
  uniconta_customer_id: string;
  notes: string;

  created_at: string;
  updated_at: string;
}

export interface Leversituatie {
  id: string;
  lead_id: string;
  afleveradres: string;
  afleverwensen: string;
  aanvulling: string;
  voorkeursdagen: string[];
  tijden: string[];
  minimale_bestelhoeveelheid: string;
  chauffeursinstructies: string;
  akkoord_voorwaarden: boolean;
  handtekening_url: string;
  created_at: string;
  updated_at: string;
}

export interface ContactPersoon {
  naam: string;
  functie: string;
  telefoon: string;
  email: string;
}

export interface Klantformulier {
  id: string;
  lead_id: string;
  juridische_naam: string;
  handelsnaam: string;
  btw_nummer: string;
  kvk_nummer: string;
  factuur_email: string;
  betaalconditie: '14 dagen' | '30 dagen' | '45 dagen' | '';
  bezorgadres: string;
  contactpersonen: ContactPersoon[];
  opmerkingen_admin: string;
  bijlagen_urls: string[];
  datum_ingevuld: string | null;
  klaar_om_te_mailen: boolean;
  datum_verzonden: string | null;
  uniconta_klantnummer: string;
  verzendstatus: 'Concept' | 'Verzonden' | 'Mislukt';
  created_at: string;
  updated_at: string;
}

export interface Tijdlijnactie {
  id: string;
  lead_id: string;
  actie_type: 'Contact' | 'Bezoek' | 'Offerte' | 'Formulier' | 'Activatie' | 'Notitie';
  verantwoordelijke_id: string | null;
  datum: string;
  notities: string;
  bijlage_url: string;
  created_at: string;
}

export interface Emailbericht {
  id: string;
  lead_id: string;
  aan: string;
  cc: string;
  onderwerp: string;
  inhoud_html: string;
  bijlagen_urls: string[];
  datum_verzonden: string;
  status: 'Verzonden' | 'Mislukt';
  created_at: string;
}

export type NavCategory = 'sales' | 'inkoop' | 'logistiek' | 'magazijn' | 'verkoop' | 'trendz' | 'contacten';
