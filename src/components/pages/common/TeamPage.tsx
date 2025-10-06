import React from 'react';
import { SimpleCRUDPage } from '../PageTemplates';
import { NavCategory } from '../../../lib/types';

interface TeamPageProps {
  category: NavCategory;
}

export function TeamPage({ category }: TeamPageProps) {
  const getRoleFilter = () => {
    switch (category) {
      case 'sales':
        return 'sales';
      case 'inkoop':
        return 'inkoop';
      case 'logistiek':
        return 'logistiek';
      case 'magazijn':
        return 'magazijn';
      default:
        return '';
    }
  };

  return (
    <SimpleCRUDPage
      title="Team"
      table="team_members"
      addButtonText="Nieuw teamlid"
      columns={[
        { key: 'name', label: 'Naam', sortable: true },
        {
          key: 'role',
          label: 'Rol',
          render: (val: string) =>
            val ? (
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                {val}
              </span>
            ) : (
              '-'
            ),
        },
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
