import React, { useState, useEffect } from 'react';
import { Upload, Edit2, X, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { DataTable } from '../../common/DataTable';
import { ArtikelenUpload } from './ArtikelenUpload';

interface Product {
  id: string;
  company_id: string;
  artikelnummer: string;
  eenheid: string;
  artikelnaam: string;
  inhoud: string;
  kostprijs: number;
  verkoopprijs_1: number;
  verkoopprijs_2?: number;
  verkoopprijs_3?: number;
  category?: string;
  supplier?: string;
  barcode?: string;
  stock_quantity?: number;
  min_stock?: number;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function Artikelen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setDebugInfo('Fetching products...');

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('artikelnummer', { ascending: true });

      if (error) {
        console.error('Error fetching products:', error);
        setDebugInfo(`Error: ${error.message}`);
        setProducts([]);
      } else {
        setDebugInfo(`Loaded ${data?.length || 0} products successfully`);
        setProducts(data || []);
      }
    } catch (error: any) {
      console.error('Exception fetching products:', error);
      setDebugInfo(`Connection failed: ${error.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingProduct.id);

      if (error) {
        console.error('Error updating product:', error);
        alert(`Fout bij opslaan: ${error.message}`);
        return;
      }

      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...p, ...formData } as Product : p
      ));

      setEditingProduct(null);
      setFormData({});
    } catch (error: any) {
      console.error('Exception updating product:', error);
      alert(`Fout bij opslaan: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({});
  };

  const handleChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showUpload) {
    return (
      <div>
        <button
          onClick={() => setShowUpload(false)}
          className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-700"
        >
          ← Terug naar overzicht
        </button>
        <ArtikelenUpload />
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Laden...</div>;
  }

  const columns = [
    { key: 'artikelnummer', label: 'Artikelnummer', sortable: true },
    { key: 'eenheid', label: 'Eenheid' },
    { key: 'artikelnaam', label: 'Artikelnaam', sortable: true },
    { key: 'inhoud', label: 'Inhoud' },
    {
      key: 'kostprijs',
      label: 'Kostprijs',
      render: (value: number) => `€ ${value?.toFixed(2) || '0.00'}`,
    },
    {
      key: 'verkoopprijs_1',
      label: 'Verkoopprijs 1',
      sortable: true,
      render: (value: number) => `€ ${value?.toFixed(2) || '0.00'}`,
    },
  ];

  return (
    <div>
      {debugInfo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <strong>Debug:</strong> {debugInfo} | Total products: {products.length}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Upload className="w-4 h-4" />
          Upload Artikelen
        </button>
      </div>

      <DataTable columns={columns} data={products} searchPlaceholder="Zoek artikelen..." onEdit={handleEdit} />

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{formData.artikelnaam}</h2>
                <p className="text-sm text-slate-500">Artikelnummer: {formData.artikelnummer}</p>
              </div>
              <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Artikelnummer *
                  </label>
                  <input
                    type="text"
                    value={formData.artikelnummer || ''}
                    onChange={(e) => handleChange('artikelnummer', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Eenheid
                  </label>
                  <input
                    type="text"
                    value={formData.eenheid || ''}
                    onChange={(e) => handleChange('eenheid', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Artikelnaam *
                  </label>
                  <input
                    type="text"
                    value={formData.artikelnaam || ''}
                    onChange={(e) => handleChange('artikelnaam', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Inhoud
                  </label>
                  <input
                    type="text"
                    value={formData.inhoud || ''}
                    onChange={(e) => handleChange('inhoud', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categorie
                  </label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kostprijs (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.kostprijs || 0}
                    onChange={(e) => handleChange('kostprijs', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Verkoopprijs 1 (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.verkoopprijs_1 || 0}
                    onChange={(e) => handleChange('verkoopprijs_1', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Verkoopprijs 2 (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.verkoopprijs_2 || 0}
                    onChange={(e) => handleChange('verkoopprijs_2', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Verkoopprijs 3 (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.verkoopprijs_3 || 0}
                    onChange={(e) => handleChange('verkoopprijs_3', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Leverancier
                  </label>
                  <input
                    type="text"
                    value={formData.supplier || ''}
                    onChange={(e) => handleChange('supplier', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Barcode / EAN
                  </label>
                  <input
                    type="text"
                    value={formData.barcode || ''}
                    onChange={(e) => handleChange('barcode', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Voorraad
                  </label>
                  <input
                    type="number"
                    value={formData.stock_quantity || 0}
                    onChange={(e) => handleChange('stock_quantity', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Voorraad
                  </label>
                  <input
                    type="number"
                    value={formData.min_stock || 0}
                    onChange={(e) => handleChange('min_stock', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notities
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active !== false}
                      onChange={(e) => handleChange('active', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Actief artikel</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end gap-3 bg-slate-50">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition"
              >
                Annuleren
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
