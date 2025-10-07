import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { SimpleCRUDPage } from '../PageTemplates';
import { KlantenUpload } from './KlantenUpload';

export function Klanten() {
  const [showUpload, setShowUpload] = useState(false);

  if (showUpload) {
    return (
      <div>
        <button
          onClick={() => setShowUpload(false)}
          className="mb-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Terug naar overzicht
        </button>
        <KlantenUpload />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          <Upload className="w-4 h-4" />
          Upload Klanten
        </button>
      </div>
      <SimpleCRUDPage
        title=""
        table="customers"
        addButtonText="Nieuwe klant"
        columns={[
          { key: 'customer_number', label: 'Klantnummer', sortable: true },
          { key: 'name', label: 'Naam', sortable: true },
          { key: 'region', label: 'Regio', sortable: true },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Telefoon' },
          { key: 'city', label: 'Plaats', sortable: true },
          { key: 'country', label: 'Land' },
        ]}
      />
    </div>
  );
}
