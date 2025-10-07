# Huize Horeca CRM Platform
## Projectrapport en Technische Documentatie

**Versie:** 1.0
**Datum:** Oktober 2025
**Status:** Development Phase

---

## Inhoudsopgave

1. [Executive Summary](#1-executive-summary)
2. [Projectcontext en Doelstellingen](#2-projectcontext-en-doelstellingen)
3. [Applicatie Architectuur](#3-applicatie-architectuur)
4. [Technische Implementatie](#4-technische-implementatie)
5. [Database Ontwerp](#5-database-ontwerp)
6. [Beveiliging en Multi-Tenancy](#6-beveiliging-en-multi-tenancy)
7. [AI en Analytics Functionaliteit](#7-ai-en-analytics-functionaliteit)
8. [Integraties](#8-integraties)
9. [Component Library](#9-component-library)
10. [Data Workflow](#10-data-workflow)
11. [Volgende Stappen en Roadmap](#11-volgende-stappen-en-roadmap)

---

## 1. Executive Summary

Huize Horeca CRM is een intelligent sales- en voorraadbeheerplatform ontwikkeld voor de drankengroothandel. Het systeem combineert traditioneel CRM-functionaliteit met AI-gedreven analyses om verkoopkansen te identificeren, voorraad te optimaliseren en klantrelaties te versterken.

### Kernfunctionaliteit
- **Sales Management**: Complete order- en offerteafhandeling
- **AI Analytics**: Intelligente patroonherkenning en voorspellingen
- **Voorraadoptimalisatie**: Real-time inventaris met besteladvies
- **Logistieke Planning**: Route- en chauffeursbeheer
- **Multi-tenant Architectuur**: Veilige data-isolatie per bedrijf

### Technologie Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI**: OpenAI GPT-4 voor analyses en aanbevelingen
- **Integraties**: Uniconta ERP, Google Maps

---

## 2. Projectcontext en Doelstellingen

### 2.1 Bedrijfscontext

**Huize Horeca** is een groothandel in dranken voor de horeca-industrie. Het bedrijf:
- Levert bier, wijn, spirits en frisdranken aan cafés, restaurants en hotels
- Werkt met vertegenwoordigers die klanten bezoeken en orders opnemen
- Gebruikt Uniconta als ERP-systeem voor financiële administratie
- Heeft meerdere leveranciers (brouwerijen, wijnhuizen, gedistilleerden)
- Beschikt over eigen magazijn en bezorgdienst

### 2.2 Uitdagingen

De bestaande werkwijze kent verschillende knelpunten:
- **Data-eilanden**: Klantinformatie verspreid over Excel, email en Uniconta
- **Reactief werken**: Geen proactieve signalering van kansen of problemen
- **Handmatig werk**: Orders en prijslijsten worden met de hand verwerkt
- **Gebrek aan inzicht**: Moeilijk om patronen en trends te ontdekken
- **Inefficiënte routes**: Logistieke planning niet geoptimaliseerd

### 2.3 Projectdoelstellingen

Het CRM-platform is ontwikkeld om:
1. **Verhogen van omzet** door proactieve identificatie van cross-sell kansen
2. **Verbeteren van klanttevredenheid** via betere service en voorspelbaarheid
3. **Optimaliseren van voorraad** om voorraadkosten te verlagen
4. **Automatiseren van processen** zoals prijslijst-uploads en route-planning
5. **Data-gedreven beslissingen** mogelijk maken door AI-analyses

### 2.4 Doelgroepen

- **Vertegenwoordigers**: Dagelijks klantcontact, orders en offertes
- **Inkoop**: Bestellen bij leveranciers, voorraadbeheer
- **Logistiek**: Route-planning en bezorgbeheer
- **Management**: Strategische beslissingen, rapportages
- **Administratie**: Facturering, prijsbeheer

---

## 3. Applicatie Architectuur

### 3.1 Modulaire Opbouw

Het platform is opgedeeld in 7 functionele modules:

#### **Sales** (Verkoop & Relatiebeheer)
- Prijzenbeheer met CSV upload functionaliteit
- Offertes maken en beheren
- Sales analytics dashboard met AI-inzichten
- Prijslijsten per klant of klantgroep

#### **Inkoop**
- Artikelen invoeren en beheren
- Besteladvies op basis van voorraad en verkooppatronen
- Leveranciersbeheer
- Inkoopprijzen en marges

#### **Logistiek**
- Auto's en voertuigen beheren
- Chauffeurs met beschikbaarheid
- Route-planning en optimalisatie
- Bezorgschema's

#### **Magazijn**
- Artikeloverzicht met voorraadniveaus
- Voorraadmutaties traceren
- Min/max voorraadniveaus
- Warehouse locaties

#### **Verkoop**
- Klantenorders invoeren en traceren
- Facturenbeheer
- Ordergeschiedenis per klant
- Betaalstatus

#### **Trendz** (AI Analytics)
- Dashboard met belangrijkste KPI's
- Top kansen identificatie
- Anomalie detectie (afwijkend koopgedrag)
- Predictive analytics

#### **Contacten**
- Klanten database met regio-indeling
- Leveranciers overzicht
- Accountmanagers en vertegenwoordigers
- Team beheer

#### **Instellingen**
- API keys beheer (OpenAI, Uniconta, Google Maps)
- Gebruikersbeheer
- Bedrijfsinstellingen
- Veilige opslag van credentials

### 3.2 Technische Architectuur

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages: Sales, Inkoop, Logistiek, Magazijn, etc     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Reusable Components: StatsCard, CustomerSelector   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ (API Calls)
┌─────────────────────────────────────────────────────────────┐
│              Supabase Backend Infrastructure                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database (Multi-tenant met RLS)          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Edge Functions (Deno)                               │   │
│  │  • price-upload: CSV parsing & validation            │   │
│  │  • analytics-customer: Klantanalyse                  │   │
│  │  • analytics-products: Product insights              │   │
│  │  • setup-user-company: JWT claims                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Auth & Row Level Security                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  External Integrations                       │
│  • OpenAI API (GPT-4): AI analyses en aanbevelingen         │
│  • Uniconta API: ERP data synchronisatie                    │
│  • Google Maps API: Route optimalisatie                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Technische Implementatie

### 4.1 Frontend Stack

**Framework**: React 18 met TypeScript
- Type-veilige ontwikkeling voor minder bugs
- Component-based architectuur voor herbruikbaarheid
- Hooks (useState, useEffect) voor state management

**Styling**: Tailwind CSS
- Utility-first approach voor snelle ontwikkeling
- Responsive design out-of-the-box
- Custom color palette voor Huize Horeca branding

**Build Tool**: Vite
- Snelle development server
- Optimized production builds
- Hot Module Replacement (HMR)

**Icon Library**: Lucide React
- 1000+ consistent icons
- Tree-shakeable voor kleine bundle size
- Customizable via props

### 4.2 Backend Stack

**Database**: Supabase (PostgreSQL)
- Relationele database met ACID garanties
- Real-time subscriptions mogelijk
- PostGIS extensie voor geo-data
- Full-text search capabilities

**API Layer**: Supabase Edge Functions
- Serverless Deno runtime
- Automatische scaling
- Low latency door edge deployment
- CORS-compliant

**Authentication**: Supabase Auth
- Email/password authentication
- JWT-based sessions
- Row Level Security integration
- Password reset flows

### 4.3 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── AIInsightCard.tsx
│   │   │   ├── CSVPreview.tsx
│   │   │   ├── CustomerSelector.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── UserMenu.tsx
│   │   └── pages/               # Page components
│   │       ├── sales/
│   │       ├── inkoop/
│   │       ├── logistiek/
│   │       ├── magazijn/
│   │       ├── verkoop/
│   │       ├── trendz/
│   │       ├── contacten/
│   │       └── settings/
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication state
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── types.ts             # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── functions/               # Edge Functions
│   │   ├── price-upload/
│   │   ├── analytics-customer/
│   │   ├── analytics-products/
│   │   └── setup-user-company/
│   └── migrations/              # Database migrations
│       ├── 001_create_core_schema.sql
│       ├── 002_create_analytics_views.sql
│       ├── 003_create_api_keys_table.sql
│       ├── 004_improve_rls_policies.sql
│       └── 005_seed_demo_data.sql
└── public/                      # Static assets
```

---

## 5. Database Ontwerp

### 5.1 Core Entiteiten

Het datamodel bestaat uit de volgende hoofdtabellen:

#### **Companies**
Multi-tenant basis: elk bedrijf heeft eigen data-isolatie
```sql
companies (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
)
```

#### **Users & Authentication**
Gekoppeld aan Supabase Auth systeem
```sql
user_companies (
  user_id uuid REFERENCES auth.users,
  company_id uuid REFERENCES companies,
  role text DEFAULT 'user',
  PRIMARY KEY (user_id, company_id)
)
```

#### **Customers (Klanten)**
```sql
customers (
  id uuid PRIMARY KEY,
  company_id uuid REFERENCES companies,
  customer_number text UNIQUE NOT NULL,
  name text NOT NULL,
  region text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'NL',
  created_at timestamptz DEFAULT now()
)
```

#### **Products (Artikelen)**
```sql
products (
  id uuid PRIMARY KEY,
  company_id uuid REFERENCES companies,
  group_id uuid REFERENCES product_groups,
  sku text NOT NULL,
  name text NOT NULL,
  description text,
  unit text DEFAULT 'piece',
  list_price decimal(10,2),
  cost_price decimal(10,2),
  active boolean DEFAULT true,
  UNIQUE(company_id, sku)
)
```

#### **Product Groups**
```sql
product_groups (
  id uuid PRIMARY KEY,
  company_id uuid REFERENCES companies,
  name text NOT NULL,
  description text
)
```

#### **Orders**
```sql
orders (
  id uuid PRIMARY KEY,
  company_id uuid REFERENCES companies,
  customer_id uuid REFERENCES customers,
  order_number text NOT NULL,
  order_date date DEFAULT CURRENT_DATE,
  delivery_date date,
  status text DEFAULT 'draft',
  total_net decimal(12,2),
  total_vat decimal(12,2),
  total_gross decimal(12,2),
  UNIQUE(company_id, order_number)
)
```

#### **Order Lines**
```sql
order_lines (
  id uuid PRIMARY KEY,
  order_id uuid REFERENCES orders ON DELETE CASCADE,
  product_id uuid REFERENCES products,
  qty decimal(10,2) NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  discount_pct decimal(5,2) DEFAULT 0,
  total_net decimal(12,2)
)
```

#### **Inventory (Voorraad)**
```sql
inventory (
  id uuid PRIMARY KEY,
  product_id uuid REFERENCES products,
  warehouse_location text DEFAULT 'main',
  on_hand decimal(10,2) DEFAULT 0,
  reserved decimal(10,2) DEFAULT 0,
  available decimal(10,2) GENERATED ALWAYS AS (on_hand - reserved) STORED,
  min_level decimal(10,2),
  max_level decimal(10,2),
  UNIQUE(product_id, warehouse_location)
)
```

#### **Price Lists (Prijslijsten)**
```sql
price_lists (
  id uuid PRIMARY KEY,
  company_id uuid REFERENCES companies,
  name text NOT NULL,
  valid_from date,
  valid_to date,
  active boolean DEFAULT true
)

price_list_items (
  id uuid PRIMARY KEY,
  price_list_id uuid REFERENCES price_lists ON DELETE CASCADE,
  product_id uuid REFERENCES products,
  net_price decimal(10,2) NOT NULL,
  currency text DEFAULT 'EUR',
  UNIQUE(price_list_id, product_id)
)
```

#### **Drivers & Routes (Logistiek)**
```sql
drivers (
  id uuid PRIMARY KEY,
  company_id uuid REFERENCES companies,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  license_number text,
  active boolean DEFAULT true
)

driver_availability (
  id uuid PRIMARY KEY,
  driver_id uuid REFERENCES drivers ON DELETE CASCADE,
  day date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  UNIQUE(driver_id, day, start_time)
)
```

#### **API Keys (Integraties)**
```sql
api_keys (
  id uuid PRIMARY KEY,
  company_id uuid REFERENCES companies,
  service_name text NOT NULL,
  api_key text,
  api_secret text,
  config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  last_tested timestamptz,
  test_status text DEFAULT 'pending',
  UNIQUE(company_id, service_name)
)
```

### 5.2 Analytics Views

Voor betere performance zijn er analytics views:

```sql
CREATE VIEW customer_stats AS
SELECT
  c.id,
  c.name,
  COUNT(DISTINCT o.id) as total_orders,
  SUM(o.total_net) as total_revenue,
  AVG(o.total_net) as avg_order_value,
  MAX(o.order_date) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;
```

---

## 6. Beveiliging en Multi-Tenancy

### 6.1 Row Level Security (RLS)

Alle tabellen zijn beveiligd met PostgreSQL Row Level Security. Dit betekent dat gebruikers alleen data van hun eigen bedrijf kunnen zien.

#### JWT-based Access Control

Gebruikers krijgen een JWT token met `company_id` claim:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "app_metadata": {
    "company_id": "company-uuid"
  }
}
```

#### RLS Policy Patroon

Voor elke tabel met `company_id`:
```sql
CREATE POLICY "tenant_select_[table]"
  ON [table] FOR SELECT
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_insert_[table]"
  ON [table] FOR INSERT
  TO authenticated
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_update_[table]"
  ON [table] FOR UPDATE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid)
  WITH CHECK (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "tenant_delete_[table]"
  ON [table] FOR DELETE
  TO authenticated
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);
```

### 6.2 Data Isolatie

**Voordelen:**
- Complete data-scheiding tussen bedrijven
- Geen mogelijkheid tot data lekkage
- GDPR-compliant
- Performant door index op company_id

**Setup Process:**
1. Gebruiker registreert account
2. Edge function `setup-user-company` wordt aangeroepen
3. Gebruiker wordt gekoppeld aan bedrijf in `user_companies`
4. `company_id` wordt toegevoegd aan JWT claims via Admin API
5. Alle queries filteren automatisch op company_id via RLS

### 6.3 API Security

**Edge Functions:**
- CORS headers voor cross-origin requests
- Bearer token authentication
- Input validation en sanitization
- Rate limiting (via Supabase)

**Credentials Management:**
- API keys opgeslagen in `api_keys` tabel
- Encrypted at rest door Supabase
- Alleen toegankelijk voor eigen bedrijf via RLS
- Test functionaliteit om connecties te verifiëren

---

## 7. AI en Analytics Functionaliteit

### 7.1 OpenAI Integratie

Het platform gebruikt GPT-4 voor intelligente analyses:

#### **Customer Anomaly Detection**
Detecteert afwijkend koopgedrag bij klanten
```typescript
// Edge Function: analytics-customer
const prompt = `
Analyseer de orderhistorie van deze klant:
- Huidige periode: ${currentOrders}
- Vorige periode: ${previousOrders}

Identificeer:
1. Significante veranderingen in orderfrequentie
2. Verschuivingen in productmix
3. Waarschuwingssignalen (churn risk)
4. Groeikansen (upsell, cross-sell)

Geef concrete actiepunten voor de vertegenwoordiger.
`;
```

#### **Product Insights**
Analyseert verkooppatronen per product
```typescript
// Edge Function: analytics-products
const prompt = `
Analyseer de verkoopdata van dit product:
- Verkoopcijfers: ${salesData}
- Voorraadniveaus: ${inventory}
- Seizoenspatronen: ${seasonality}

Bepaal:
1. Is er een trend (opwaarts/neerwaarts)?
2. Wat is de optimale voorraad?
3. Zijn er prijsaanpassingen nodig?
4. Welke klanten moeten we targeten?
`;
```

### 7.2 Trendz Dashboard

Het AI-dashboard combineert meerdere analyses:

**Top Kansen**
- Cross-sell mogelijkheden (klanten die product A kopen maar niet B)
- Klanten met afnemende orders (churn risk)
- High-value klanten die lange tijd niet besteld hebben
- Seizoensgebonden aanbevelingen

**Anomalie Detectie**
- Plotselinge dalingen in ordervolume
- Afwijkende productmix
- Onverwachte prijsgevoeligheid
- Regionale trends

**Predictive Analytics**
- Voorspelling volgende ordermoment
- Geschatte orderwaarde
- Kans op churn
- Lifetime value berekening

### 7.3 AI Prompt Engineering

Alle AI-prompts volgen een vast patroon:

1. **Context**: Beschrijf de situatie en dataset
2. **Doel**: Wat moet de AI analyseren?
3. **Output format**: Gestructureerde JSON response
4. **Constraints**: Nederlandse taal, specifieke format

**Voorbeeld Response Format:**
```json
{
  "summary": "Korte samenvatting in 1-2 zinnen",
  "insights": [
    {
      "type": "warning|opportunity|trend",
      "title": "Korte titel",
      "description": "Gedetailleerde uitleg",
      "priority": "high|medium|low",
      "action": "Concrete actiestap"
    }
  ],
  "metrics": {
    "key": "value"
  }
}
```

---

## 8. Integraties

### 8.1 Uniconta ERP

**Doel**: Synchronisatie van klantgegevens, orders en factuurbeheer

**Data Flow:**
```
Uniconta → API → Edge Function → Supabase
```

**Sync Points:**
- Klantgegevens (dagelijks)
- Productcatalogus (wekelijks)
- Orders (real-time bij creatie)
- Facturen (dagelijks)
- Betalingen (dagelijks)

**API Endpoints:**
- `GET /customers` - Klantgegevens ophalen
- `POST /orders` - Order naar Uniconta sturen
- `GET /invoices` - Factuurbeheer

### 8.2 Google Maps API

**Doel**: Route-optimalisatie voor bezorging

**Functionaliteit:**
- Adres geocoding
- Afstand en reistijd berekening
- Route optimalisatie (TSP algorithm)
- Verkeersinformatie

**Use Case:**
```typescript
// Optimaliseer bezorgroute voor chauffeur
const stops = [
  { customer: "Café De Brug", address: "..." },
  { customer: "Bar Central", address: "..." },
  // ...
];

const optimizedRoute = await optimizeRoute(stops, {
  startLocation: "warehouse",
  maxDuration: "8 hours",
  vehicleType: "van"
});
```

### 8.3 Price Upload Functionality

**CSV Upload Flow:**

1. **Upload**: Gebruiker selecteert CSV bestand
2. **Validation**:
   - Check kolommen (SKU, prijs, valuta)
   - Valideer datatypes
   - Controleer of producten bestaan
3. **Preview**: Toon eerste 5 rijen ter verificatie
4. **Import**:
   - Maak nieuwe price list aan
   - Voeg items toe aan price_list_items
   - Markeer oude prijslijst als inactief
5. **Feedback**: Toon aantal geïmporteerde items en eventuele warnings

**Edge Function: price-upload**
```typescript
const parseCSV = (file: File) => {
  // Parse CSV met papaparse
  // Valideer verplichte kolommen
  // Match SKU's met products tabel
  // Return validated data + warnings
};

const importPrices = async (data, priceListName) => {
  // Maak price_list aan
  // Bulk insert price_list_items
  // Return statistics
};
```

---

## 9. Component Library

### 9.1 Design System

**Kleuren:**
- Primary: Huize Horeca blauw (`#1e40af`)
- Secondary: Grijs tinten voor UI
- Success: Groen (`#10b981`)
- Warning: Geel (`#f59e0b`)
- Error: Rood (`#ef4444`)

**Typography:**
- Headings: Font weight 600-700
- Body: Font weight 400
- Small text: Font weight 400, size 0.875rem

**Spacing:**
- Consistent 8px grid systeem
- Padding: 4px, 8px, 12px, 16px, 24px, 32px
- Gap: 4px, 8px, 12px, 16px

### 9.2 Reusable Components

#### **StatsCard**
KPI kaarten voor dashboards
```tsx
<StatsCard
  title="Totale omzet"
  value="€ 128.450"
  change={12.5}
  icon={DollarSign}
  color="green"
  loading={false}
/>
```

**Props:**
- `title`: Titel van de metric
- `value`: Waarde (string of number)
- `change`: Percentage verandering
- `changeLabel`: Label voor change
- `icon`: Lucide icon component
- `color`: blue|green|red|yellow|purple
- `loading`: Loading state (skeleton)

#### **CustomerSelector**
Dropdown met zoekfunctie
```tsx
<CustomerSelector
  onSelect={(customer) => setSelected(customer)}
  selectedId={customerId}
/>
```

**Features:**
- Live search filtering
- Toont klantnummer, naam, regio
- Click-outside om te sluiten
- Keyboard navigation
- Loading state

#### **CSVPreview**
Real-time CSV validatie en preview
```tsx
<CSVPreview
  file={uploadedFile}
  requiredColumns={['sku', 'prijs']}
  onValidation={(result) => setValid(result.valid)}
/>
```

**Features:**
- Parse CSV/Excel
- Valideer kolommen
- Toon eerste 5 rijen
- Error en warning meldingen
- Visuele feedback (groen/rood)

#### **QuickActions**
Grid van actieknoppen
```tsx
<QuickActions
  actions={[
    {
      id: 'new-order',
      label: 'Nieuwe order',
      icon: Plus,
      onClick: handleNewOrder,
      color: 'blue'
    }
  ]}
/>
```

**Features:**
- 2-koloms grid layout
- Icon + label
- Configureerbare kleuren
- Responsive design

#### **DataTable**
Generieke tabel component (in development)
```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Naam' },
    { key: 'amount', label: 'Bedrag', format: 'currency' }
  ]}
  data={rows}
  onRowClick={handleRowClick}
/>
```

**Geplande features:**
- Sorteerbaar
- Filterbaar
- Paginering
- Export naar CSV
- Column visibility toggle

---

## 10. Data Workflow

### 10.1 Typische User Journey

#### **Vertegenwoordiger: Order Plaatsen**

1. Login via Auth systeem
2. Navigeer naar "Verkoop" → "Klantenorders"
3. Klik "Nieuwe order"
4. Selecteer klant via CustomerSelector
5. Voeg producten toe (zoek op SKU of naam)
6. Prijs wordt automatisch opgehaald uit price_list
7. Bereken totaal (inclusief BTW)
8. Sla order op
9. Order wordt gesynchroniseerd naar Uniconta (toekomstig)

**Database transactie:**
```sql
BEGIN;
  INSERT INTO orders (...) VALUES (...);
  INSERT INTO order_lines (...) VALUES (...);
  UPDATE inventory SET reserved = reserved + qty WHERE product_id = ...;
COMMIT;
```

#### **Inkoop: Besteladvies**

1. Navigeer naar "Inkoop" → "Besteladvies"
2. Systeem analyseert:
   - Huidige voorraad
   - Gereserveerde voorraad
   - Gemiddelde verkoop (laatste 30 dagen)
   - Min/max niveaus
3. Genereer advies per product:
   ```
   Bestel = max(0, (gem_verkoop * leadtime) + safety_stock - available)
   ```
4. Filter producten onder min-niveau
5. Exporteer besteladvies naar CSV
6. Upload naar leverancier portal

#### **Management: AI Insights**

1. Navigeer naar "Trendz" → "Dashboard"
2. View real-time KPI's via StatsCard components
3. Bekijk "Top Kansen" sectie
4. Klik op klant voor gedetailleerde analyse
5. Edge function roept OpenAI aan:
   ```
   User → Frontend → Edge Function → OpenAI API → Response
   ```
6. AI genereert aanbevelingen in JSON
7. Frontend toont actiepunten visueel
8. Manager kan actiepunt toewijzen aan vertegenwoordiger

### 10.2 Data Synchronisatie Flow

```
┌──────────────────────────────────────────────────────────┐
│                    External Systems                       │
│  • Uniconta (ERP)                                        │
│  • Leverancier Portals                                   │
│  • Email (Orders)                                        │
└──────────────────────────────────────────────────────────┘
                          ↓
                    ETL Process
          (Edge Functions / Scheduled Jobs)
                          ↓
┌──────────────────────────────────────────────────────────┐
│                  Supabase Database                        │
│  • Normalized data                                       │
│  • Historical records                                    │
│  • Audit logs                                            │
└──────────────────────────────────────────────────────────┘
                          ↓
                    Real-time Subscriptions
                          ↓
┌──────────────────────────────────────────────────────────┐
│                    React Frontend                         │
│  • Live updates                                          │
│  • Optimistic UI                                         │
│  • Offline queue                                         │
└──────────────────────────────────────────────────────────┘
```

### 10.3 Caching Strategy

**Frontend Caching:**
- React Query (of SWR) voor API responses
- Cache time: 5 minuten voor statische data
- Revalidate on focus voor dynamische data
- Optimistic updates voor betere UX

**Database Caching:**
- Materialized views voor analytics
- Refresh strategy: elke nacht om 02:00
- Indexes op frequently queried columns

---

## 11. Volgende Stappen en Roadmap

### 11.1 Korte Termijn (0-3 maanden)

#### **1. Database Migraties Uitvoeren**
- Run alle migrations in Supabase
- Seed demo data voor testing
- Verify RLS policies werken correct

#### **2. Edge Functions Deployen**
- Deploy price-upload function
- Deploy analytics functions
- Test met echte API keys
- Setup monitoring en logging

#### **3. Frontend-Backend Koppeling**
- Vervang dummy data door Supabase queries
- Implement error handling
- Add loading states
- Test alle CRUD operaties

#### **4. Authentication Flow**
- Signup + login werkt volledig
- Password reset functionaliteit
- Email verificatie (optioneel)
- Session management

#### **5. Uniconta Integratie (Fase 1)**
- Authenticatie opzetten
- Klanten synchroniseren (read-only)
- Test data mapping
- Error handling bij sync failures

### 11.2 Middellange Termijn (3-6 maanden)

#### **1. AI Features Uitbreiden**
- Demand forecasting per product
- Churn prediction model
- Automated email drafts voor vertegenwoordigers
- Sentiment analysis van klantcommunicatie

#### **2. Logistieke Optimalisatie**
- Google Maps integratie
- Route optimization algoritme
- Driver app (mobile)
- Real-time tracking

#### **3. Advanced Rapportages**
- PDF facturen genereren
- Excel exports
- Custom dashboards per rol
- Scheduled email reports

#### **4. Mobile Responsiveness**
- Optimize voor tablets
- Dedicated mobile views
- Offline support (PWA)

#### **5. Uniconta Integratie (Fase 2)**
- Bidirectionele sync (read/write)
- Real-time webhooks
- Conflict resolution
- Automated invoice posting

### 11.3 Lange Termijn (6-12 maanden)

#### **1. Multi-Channel Expansion**
- WhatsApp bot voor orders
- Email parsing (orders uit emails)
- Marketplace integraties
- B2B webshop voor klanten

#### **2. Advanced Analytics**
- Machine learning models
- Customer segmentation
- Price optimization engine
- Inventory optimization (AI)

#### **3. Ecosystem Features**
- Supplier portal
- Customer self-service portal
- API voor third-party integraties
- Webhook system voor partners

#### **4. Enterprise Features**
- Advanced user permissions
- Audit logging
- Compliance tools (GDPR)
- Multi-warehouse support

### 11.4 Technische Verbeteringen

#### **Code Quality**
- [ ] Unit tests (Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Code coverage > 80%

#### **Performance**
- [ ] Lazy loading van routes
- [ ] Image optimization
- [ ] Code splitting
- [ ] Bundle size < 500KB

#### **DevOps**
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated deployments
- [ ] Staging environment
- [ ] Monitoring (Sentry, LogRocket)

#### **Documentation**
- [ ] API documentation (Swagger)
- [ ] Component storybook
- [ ] User manual
- [ ] Video tutorials

### 11.5 Business Metrics (KPI's)

Voor het meten van succes:

**Gebruikers Acceptatie:**
- 80% van vertegenwoordigers gebruikt systeem dagelijks
- Gemiddelde sessie > 15 minuten
- < 5% bounce rate na onboarding

**Operationele Efficiency:**
- 30% reductie in tijd voor order processing
- 50% minder voorraad-outs
- 20% betere route-efficiency

**Revenue Impact:**
- 15% toename in cross-sell
- 10% verbetering in customer retention
- 5% stijging in gemiddelde orderwaarde

**Cost Savings:**
- 25% reductie in voorraadkosten
- 30% minder handmatig data-entry werk
- 20% lagere bezorgkosten

---

## Bijlagen

### A. Technische Requirements

**Minimale Server Specs (indien self-hosted):**
- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB SSD
- Network: 100Mbps

**Browser Support:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Dependencies:**
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@supabase/supabase-js": "^2.57.4",
  "lucide-react": "^0.344.0",
  "tailwindcss": "^3.4.1"
}
```

### B. API Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/functions/v1/price-upload` | POST | Upload CSV prijslijst |
| `/functions/v1/analytics-customer` | GET | Klant analyse |
| `/functions/v1/analytics-products` | GET | Product insights |
| `/functions/v1/setup-user-company` | POST | Setup company in JWT |

### C. Database Schema Diagram

```
companies
    ↓ (1:N)
┌─────────────────────────────────────┐
│ customers  products  drivers  users │
└─────────────────────────────────────┘
         ↓           ↓         ↓
    orders ←→ order_lines  driver_availability
         ↓
    invoices
```

### D. Contact & Support

**Development Team:**
- Frontend: React + TypeScript
- Backend: Supabase + Edge Functions
- AI Integration: OpenAI GPT-4

**Project Status:**
- Phase: Development
- Version: 1.0 (MVP)
- Last Updated: Oktober 2025

---

## Conclusie

Het Huize Horeca CRM platform biedt een moderne, schaalbare oplossing voor sales- en voorraadbeheer in de drankengroothandel. Door de combinatie van traditionele CRM-functionaliteit met AI-gedreven analytics, creëren we een systeem dat niet alleen efficiënter werkt, maar ook proactief kansen identificeert.

De multi-tenant architectuur met Row Level Security garandeert veilige data-isolatie, terwijl de modulaire opbouw toekomstige uitbreidingen eenvoudig maakt. Met de geplande Uniconta-integratie en verdere AI-features wordt het platform een centraal systeem voor alle sales- en logistieke processen.

De volgende stappen focussen op het voltooien van de core functionaliteit, het testen met echte gebruikers, en het iteratief verbeteren op basis van feedback. Met een duidelijke roadmap en meetbare KPI's is het platform goed gepositioneerd om waarde te leveren voor Huize Horeca en haar klanten.

---

**Document Versie:** 1.0
**Laatste Update:** Oktober 2025
**Status:** Final Draft
