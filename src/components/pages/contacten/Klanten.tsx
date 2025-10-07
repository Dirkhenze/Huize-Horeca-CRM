import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { SimpleCRUDPage } from '../PageTemplates';
import { KlantenUpload } from './KlantenUpload';
import { supabase } from '../../../lib/supabase';

export function Klanten() {
  const [showUpload, setShowUpload] = useState(false);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    linkUserToCompany();
  }, []);

  const linkUserToCompany = async () => {
    setLinking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/link-user-to-demo-company`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      await supabase.auth.refreshSession();
    } catch (error) {
      console.error('Error linking user:', error);
    } finally {
      setLinking(false);
    }
  };

  if (linking) {
    return <div className="text-center py-8">Account instellen...</div>;
  }

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
