import React from 'react';
import { SimpleCRUDPage } from '../PageTemplates';

export function Klanten() {
  return (
    <SimpleCRUDPage
      title=""
      table="customers"
      addButtonText="Nieuwe klant"
      columns={[
        { key: 'name', label: 'Naam', sortable: true },
        { key: 'contact_person', label: 'Contactpersoon', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Telefoon' },
        { key: 'city', label: 'Plaats', sortable: true },
        { key: 'customer_type', label: 'Type' },
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
