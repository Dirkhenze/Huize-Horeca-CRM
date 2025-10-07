import React, { useState, useEffect } from 'react';
import { Upload, Edit2, X, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { DataTable } from '../../common/DataTable';
import { KlantenUpload } from './KlantenUpload';

interface Customer {
  id: string;
  customer_number: string;
  name: string;
  adres_1?: string;
  city?: string;
  phone?: string;
  mobiele_telefoon?: string;
}

export function Klanten() {
  const [showUpload, setShowUpload] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('customer_number', { ascending: true });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
  };

  const handleSave = async () => {
    if (!editingCustomer) return;

    try {
      const { error } = await supabase
        .from('customers')
        .update(formData)
        .eq('id', editingCustomer.id);

      if (error) throw error;

      await fetchCustomers();
      setEditingCustomer(null);
      setFormData({});
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Er is een fout opgetreden bij het opslaan');
    }
  };

  const handleCancel = () => {
    setEditingCustomer(null);
    setFormData({});
  };

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

  if (loading) {
    return <div className="text-center py-8">Laden...</div>;
  }

  const columns = [
    { key: 'customer_number', label: 'Klantnummer', sortable: true },
    { key: 'name', label: 'Naam', sortable: true },
    { key: 'adres_1', label: 'Adres' },
    { key: 'city', label: 'Plaats', sortable: true },
    { key: 'phone', label: 'Telefoon' },
    { key: 'mobiele_telefoon', label: 'Mobiele telefoon' },
    {
      key: 'actions',
      label: 'Acties',
      render: (row: Customer) => (
        <button
          onClick={() => handleEdit(row)}
          className="text-blue-600 hover:text-blue-700 p-1"
          title="Bewerken"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )
    }
  ];

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

      <DataTable columns={columns} data={customers} searchPlaceholder="Zoek klanten..." />

      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Klant bewerken</h2>
              <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Klantnummer</label>
                <input
                  type="text"
                  value={formData.customer_number || ''}
                  onChange={(e) => setFormData({ ...formData, customer_number: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Naam</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
                <input
                  type="text"
                  value={formData.adres_1 || ''}
                  onChange={(e) => setFormData({ ...formData, adres_1: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plaats</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefoon</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobiele telefoon</label>
                <input
                  type="text"
                  value={formData.mobiele_telefoon || ''}
                  onChange={(e) => setFormData({ ...formData, mobiele_telefoon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Annuleren
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
