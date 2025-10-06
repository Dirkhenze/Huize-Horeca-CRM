import React from 'react';
import { SimpleCRUDPage } from '../PageTemplates';

export function Leveranciers() {
  return (
    <SimpleCRUDPage
      title=""
      table="suppliers"
      addButtonText="Nieuwe leverancier"
      columns={[
        { key: 'name', label: 'Naam', sortable: true },
        {
          key: 'category',
          label: 'Categorie',
          sortable: true,
          render: (val: string) =>
            val ? (
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                {val}
              </span>
            ) : (
              '-'
            ),
        },
        { key: 'contact_person', label: 'Contactpersoon' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Telefoon' },
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
