import React from 'react';
import { SimpleCRUDPage } from './PageTemplates';

export function ArtikelenInvoeren() {
  return (
    <SimpleCRUDPage
      title="Artikelen invoeren"
      table="products"
      addButtonText="Nieuw artikel"
      columns={[
        { key: 'sku', label: 'SKU', sortable: true },
        { key: 'name', label: 'Naam', sortable: true },
        { key: 'category', label: 'Categorie', sortable: true },
        {
          key: 'purchase_price',
          label: 'Inkoopprijs',
          render: (val: number) => `€ ${val?.toFixed(2) || '0.00'}`,
        },
        {
          key: 'standard_price',
          label: 'Verkoopprijs',
          render: (val: number) => `€ ${val?.toFixed(2) || '0.00'}`,
        },
      ]}
    />
  );
}

export function Besteladvies() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Besteladvies</h1>
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <p className="text-slate-600 text-center">
          AI-gedreven besteladvies op basis van historische verkoop en voorraadniveaus
        </p>
      </div>
    </div>
  );
}

export function Autos() {
  return (
    <SimpleCRUDPage
      title="Auto's"
      table="vehicles"
      addButtonText="Nieuwe auto"
      columns={[
        { key: 'license_plate', label: 'Kenteken', sortable: true },
        { key: 'brand', label: 'Merk', sortable: true },
        { key: 'model', label: 'Model', sortable: true },
        { key: 'capacity_kg', label: 'Laadvermogen (kg)', sortable: true },
        {
          key: 'status',
          label: 'Status',
          render: (val: string) => (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                val === 'actief'
                  ? 'bg-green-100 text-green-700'
                  : val === 'onderhoud'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {val}
            </span>
          ),
        },
      ]}
    />
  );
}

export function Chauffeurs() {
  return (
    <SimpleCRUDPage
      title="Chauffeurs"
      table="drivers"
      addButtonText="Nieuwe chauffeur"
      columns={[
        { key: 'name', label: 'Naam', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Telefoon' },
        { key: 'license_type', label: 'Rijbewijs' },
        {
          key: 'is_active',
          label: 'Status',
          render: (val: boolean) => (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                val ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {val ? 'Actief' : 'Inactief'}
            </span>
          ),
        },
      ]}
    />
  );
}

export function Routes() {
  return (
    <SimpleCRUDPage
      title="Routes"
      table="routes"
      addButtonText="Nieuwe route"
      columns={[
        { key: 'route_number', label: 'Route nr.', sortable: true },
        { key: 'date', label: 'Datum', sortable: true },
        {
          key: 'status',
          label: 'Status',
          render: (val: string) => (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                val === 'voltooid'
                  ? 'bg-green-100 text-green-700'
                  : val === 'onderweg'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {val}
            </span>
          ),
        },
        {
          key: 'total_distance_km',
          label: 'Afstand (km)',
          render: (val: number) => val?.toFixed(1) || '0',
        },
      ]}
    />
  );
}

export function Voorraad() {
  return (
    <SimpleCRUDPage
      title="Voorraad"
      table="stock"
      columns={[
        { key: 'location', label: 'Locatie', sortable: true },
        { key: 'quantity_available', label: 'Beschikbaar', sortable: true },
        { key: 'quantity_reserved', label: 'Gereserveerd', sortable: true },
        { key: 'minimum_stock', label: 'Minimum voorraad', sortable: true },
        {
          key: 'last_counted',
          label: 'Laatste telling',
          render: (val: string) => (val ? new Date(val).toLocaleDateString('nl-NL') : '-'),
        },
      ]}
    />
  );
}

export function Artikelen() {
  return <ArtikelenInvoeren />;
}

export function Klantenorders() {
  return (
    <SimpleCRUDPage
      title="Klantenorders"
      table="orders"
      addButtonText="Nieuwe order"
      columns={[
        { key: 'order_number', label: 'Order nr.', sortable: true },
        { key: 'order_date', label: 'Orderdatum', sortable: true },
        { key: 'delivery_date', label: 'Leverdatum', sortable: true },
        {
          key: 'total_amount',
          label: 'Bedrag',
          render: (val: number) => `€ ${val?.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) || '0,00'}`,
        },
        {
          key: 'status',
          label: 'Status',
          render: (val: string) => (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                val === 'geleverd'
                  ? 'bg-green-100 text-green-700'
                  : val === 'bevestigd'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {val}
            </span>
          ),
        },
      ]}
    />
  );
}

export function Facturen() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Facturen</h1>
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <p className="text-slate-600 text-center">
          Factuuroverzicht en beheer (integratie met Uniconta)
        </p>
      </div>
    </div>
  );
}
