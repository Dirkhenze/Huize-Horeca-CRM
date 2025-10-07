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
  adres_2?: string;
  adres_3?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  phone?: string;
  mobiele_telefoon?: string;
  email?: string;
  email_voor_contact?: string;
  www?: string;
  contact?: string;
  afleveradres_1?: string;
  afleveradres_2?: string;
  afleveradres_3?: string;
  postcode_voor_levering?: string;
  plaats_voor_levering?: string;
  delivery_address?: string;
  sleutelcode?: string;
  contact_voor_levering?: string;
  te_leveren_telefoon?: string;
  te_leveren_email?: string;
  saldo?: number;
  achterstallig?: number;
  achterstallig_in_valuta?: number;
  kredietlimiet?: number;
  email_voor_factuur?: string;
  email_verzenden?: string;
  e_factuur?: string;
  crm_groep?: string;
  betaling?: string;
  betalingsformaat?: string;
  btw_nummer?: string;
  prijslijst?: string;
  ons_rekeningnummer?: string;
  filiaal?: string;
  geblokkeerd?: boolean;
  bankrekening?: string;
  transportmethode?: string;
  leveringsvoorwaarde?: string;
  kvk_nummer?: string;
  gemaakt?: string;
  bedrijfsstatus?: string;
  weekdagen?: string;
  automatische_orderbevestiging?: boolean;
  bezogtijden?: string;
  weekfactuur?: string;
  account_manager?: string;
  link_naar_payt?: string;
  region?: string;
}

type TabType = 'basis' | 'adres' | 'levering' | 'contact' | 'financieel' | 'business';

export function Klanten() {
  const [showUpload, setShowUpload] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [activeTab, setActiveTab] = useState<TabType>('basis');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('customer_number', { ascending: true });

      if (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      } else {
        setCustomers(data || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setActiveTab('basis');
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
    setActiveTab('basis');
  };

  const updateField = (field: keyof Customer, value: any) => {
    setFormData({ ...formData, [field]: value });
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

  const tabs = [
    { id: 'basis' as TabType, label: 'Basis' },
    { id: 'adres' as TabType, label: 'Adres' },
    { id: 'levering' as TabType, label: 'Levering' },
    { id: 'contact' as TabType, label: 'Contact' },
    { id: 'financieel' as TabType, label: 'Financieel' },
    { id: 'business' as TabType, label: 'Business' },
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
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{formData.name}</h2>
                <p className="text-sm text-slate-500">Klantnummer: {formData.customer_number}</p>
              </div>
              <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="border-b">
              <div className="flex px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'basis' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Klantnummer *</label>
                    <input
                      type="text"
                      value={formData.customer_number || ''}
                      onChange={(e) => updateField('customer_number', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Naam *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Regio</label>
                    <input
                      type="text"
                      value={formData.region || ''}
                      onChange={(e) => updateField('region', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Manager</label>
                    <input
                      type="text"
                      value={formData.account_manager || ''}
                      onChange={(e) => updateField('account_manager', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'adres' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Adres 1</label>
                      <input
                        type="text"
                        value={formData.adres_1 || ''}
                        onChange={(e) => updateField('adres_1', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Adres 2</label>
                      <input
                        type="text"
                        value={formData.adres_2 || ''}
                        onChange={(e) => updateField('adres_2', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Adres 3</label>
                      <input
                        type="text"
                        value={formData.adres_3 || ''}
                        onChange={(e) => updateField('adres_3', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Postcode</label>
                      <input
                        type="text"
                        value={formData.postal_code || ''}
                        onChange={(e) => updateField('postal_code', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Plaats</label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => updateField('city', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Land</label>
                      <input
                        type="text"
                        value={formData.country || ''}
                        onChange={(e) => updateField('country', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'levering' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Afleveradres 1</label>
                      <input
                        type="text"
                        value={formData.afleveradres_1 || ''}
                        onChange={(e) => updateField('afleveradres_1', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Afleveradres 2</label>
                      <input
                        type="text"
                        value={formData.afleveradres_2 || ''}
                        onChange={(e) => updateField('afleveradres_2', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Afleveradres 3</label>
                      <input
                        type="text"
                        value={formData.afleveradres_3 || ''}
                        onChange={(e) => updateField('afleveradres_3', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Postcode voor levering</label>
                      <input
                        type="text"
                        value={formData.postcode_voor_levering || ''}
                        onChange={(e) => updateField('postcode_voor_levering', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Plaats voor levering</label>
                      <input
                        type="text"
                        value={formData.plaats_voor_levering || ''}
                        onChange={(e) => updateField('plaats_voor_levering', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
                      <input
                        type="text"
                        value={formData.delivery_address || ''}
                        onChange={(e) => updateField('delivery_address', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sleutelcode</label>
                      <input
                        type="text"
                        value={formData.sleutelcode || ''}
                        onChange={(e) => updateField('sleutelcode', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bezorgtijden</label>
                      <input
                        type="text"
                        value={formData.bezogtijden || ''}
                        onChange={(e) => updateField('bezogtijden', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contact voor levering</label>
                      <input
                        type="text"
                        value={formData.contact_voor_levering || ''}
                        onChange={(e) => updateField('contact_voor_levering', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Te leveren telefoon</label>
                      <input
                        type="text"
                        value={formData.te_leveren_telefoon || ''}
                        onChange={(e) => updateField('te_leveren_telefoon', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Te leveren e-mail</label>
                      <input
                        type="email"
                        value={formData.te_leveren_email || ''}
                        onChange={(e) => updateField('te_leveren_email', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Telefoon</label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mobiele telefoon</label>
                      <input
                        type="text"
                        value={formData.mobiele_telefoon || ''}
                        onChange={(e) => updateField('mobiele_telefoon', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">E-mail voor contact</label>
                      <input
                        type="email"
                        value={formData.email_voor_contact || ''}
                        onChange={(e) => updateField('email_voor_contact', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                      <input
                        type="text"
                        value={formData.www || ''}
                        onChange={(e) => updateField('www', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contact persoon</label>
                      <input
                        type="text"
                        value={formData.contact || ''}
                        onChange={(e) => updateField('contact', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financieel' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Saldo</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.saldo || ''}
                        onChange={(e) => updateField('saldo', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Achterstallig</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.achterstallig || ''}
                        onChange={(e) => updateField('achterstallig', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Achterstallig in valuta</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.achterstallig_in_valuta || ''}
                        onChange={(e) => updateField('achterstallig_in_valuta', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Kredietlimiet</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.kredietlimiet || ''}
                        onChange={(e) => updateField('kredietlimiet', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">E-mail voor factuur</label>
                      <input
                        type="email"
                        value={formData.email_voor_factuur || ''}
                        onChange={(e) => updateField('email_voor_factuur', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Betaling</label>
                      <input
                        type="text"
                        value={formData.betaling || ''}
                        onChange={(e) => updateField('betaling', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Betalingsformaat</label>
                      <input
                        type="text"
                        value={formData.betalingsformaat || ''}
                        onChange={(e) => updateField('betalingsformaat', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bankrekening</label>
                      <input
                        type="text"
                        value={formData.bankrekening || ''}
                        onChange={(e) => updateField('bankrekening', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'business' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">BTW nummer</label>
                      <input
                        type="text"
                        value={formData.btw_nummer || ''}
                        onChange={(e) => updateField('btw_nummer', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">KVK nummer</label>
                      <input
                        type="text"
                        value={formData.kvk_nummer || ''}
                        onChange={(e) => updateField('kvk_nummer', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CRM-groep</label>
                      <input
                        type="text"
                        value={formData.crm_groep || ''}
                        onChange={(e) => updateField('crm_groep', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Prijslijst</label>
                      <input
                        type="text"
                        value={formData.prijslijst || ''}
                        onChange={(e) => updateField('prijslijst', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Filiaal</label>
                      <input
                        type="text"
                        value={formData.filiaal || ''}
                        onChange={(e) => updateField('filiaal', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Transportmethode</label>
                      <input
                        type="text"
                        value={formData.transportmethode || ''}
                        onChange={(e) => updateField('transportmethode', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Leveringsvoorwaarde</label>
                      <input
                        type="text"
                        value={formData.leveringsvoorwaarde || ''}
                        onChange={(e) => updateField('leveringsvoorwaarde', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bedrijfsstatus</label>
                      <input
                        type="text"
                        value={formData.bedrijfsstatus || ''}
                        onChange={(e) => updateField('bedrijfsstatus', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Weekdagen</label>
                      <input
                        type="text"
                        value={formData.weekdagen || ''}
                        onChange={(e) => updateField('weekdagen', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Weekfactuur</label>
                      <input
                        type="text"
                        value={formData.weekfactuur || ''}
                        onChange={(e) => updateField('weekfactuur', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="geblokkeerd"
                        checked={formData.geblokkeerd || false}
                        onChange={(e) => updateField('geblokkeerd', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="geblokkeerd" className="text-sm font-medium text-slate-700">
                        Geblokkeerd
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="auto_orderbevestiging"
                        checked={formData.automatische_orderbevestiging || false}
                        onChange={(e) => updateField('automatische_orderbevestiging', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="auto_orderbevestiging" className="text-sm font-medium text-slate-700">
                        Automatische orderbevestiging
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t">
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
