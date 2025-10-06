import React from 'react';
import { SimpleCRUDPage } from '../PageTemplates';

export function AccountmanagersPage() {
  return (
    <SimpleCRUDPage
      title=""
      table="accountmanagers"
      addButtonText="Nieuwe accountmanager"
      columns={[
        {
          key: 'avatar_url',
          label: 'Foto',
          render: (val: string) =>
            val ? (
              <img src={val} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200" />
            ),
        },
        { key: 'name', label: 'Naam', sortable: true },
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
