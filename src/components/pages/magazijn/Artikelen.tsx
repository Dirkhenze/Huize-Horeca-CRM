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
  inhoud?: string;
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

  hoofdcategorie?: string;
  artikel_locatie?: string;
  gewicht?: number;
  minimumvoorraadniveau?: number;
  leverancier?: string;
  artikelnummer_leverancier?: string;
  groep?: string;
  aantal_dozen?: number;
  geblokkeerd?: boolean;
  magazijn?: number;
  besteld?: number;
  beschikbaar?: number;
  minimum_inkoophoeveelheid?: number;
  afbeelding?: string;
  leveringstijd?: string;
  prijs_emballage?: number;
  additionele_categorie?: string;
  emballage_artikel?: string;
  in_voorraad_fysiek?: number;
  additional_group?: string;
  sub_categorie?: string;
  aantal_in_hectoliter?: number;
  aantal_liter?: number;
  abv?: number;
  agentschap?: string;
  agentschapnummer?: string;
  artikel_type?: string;
  bestelartikel?: boolean;
  carbonatie?: string;
  categorie?: string;
  classificatie?: string;
  druifsoort?: string;
  ean_nummer?: string;
  fruitcomponent?: string;
  horeca_adviesprijs?: number;
  inkoopaantal?: number;
  inkoopeenheid?: string;
  inkoopprijs?: number;
  kortingsgroep?: string;
  land_van_oorsprong?: string;
  merk?: string;
  omschrijving?: string;
  slijterij_afhalen?: boolean;
  slijterij_bezorgen?: boolean;
  streek_regio?: string;
  tapkoppeling?: string;
  teeltwijze?: string;
  type_sluiting?: string;
  webshop?: boolean;
  webshop_categorie?: string;
  wijnhuis?: string;
  wijnstijl?: string;

  created_at: string;
  updated_at: string;
}

type TabKey = 'basis' | 'inkoop' | 'voorraad' | 'categorie' | 'dranken' | 'wijn' | 'verkoop' | 'extra';

export function Artikelen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [activeTab, setActiveTab] = useState<TabKey>('basis');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('artikelnummer', { ascending: true });

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    } catch (error: any) {
      console.error('Exception fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setActiveTab('basis');
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
    setActiveTab('basis');
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

  const tabs = [
    { key: 'basis' as TabKey, label: 'Basis Gegevens' },
    { key: 'inkoop' as TabKey, label: 'Inkoop' },
    { key: 'voorraad' as TabKey, label: 'Voorraad' },
    { key: 'categorie' as TabKey, label: 'Categorieën' },
    { key: 'dranken' as TabKey, label: 'Dranken Info' },
    { key: 'wijn' as TabKey, label: 'Wijn Info' },
    { key: 'verkoop' as TabKey, label: 'Verkoop' },
    { key: 'extra' as TabKey, label: 'Extra' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basis':
        return (
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

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Omschrijving
              </label>
              <textarea
                value={formData.omschrijving || ''}
                onChange={(e) => handleChange('omschrijving', e.target.value)}
                rows={3}
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
                Gewicht (kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.gewicht || ''}
                onChange={(e) => handleChange('gewicht', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                EAN Nummer / Barcode
              </label>
              <input
                type="text"
                value={formData.ean_nummer || formData.barcode || ''}
                onChange={(e) => {
                  handleChange('ean_nummer', e.target.value);
                  handleChange('barcode', e.target.value);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Merk
              </label>
              <input
                type="text"
                value={formData.merk || ''}
                onChange={(e) => handleChange('merk', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Artikel Type
              </label>
              <input
                type="text"
                value={formData.artikel_type || ''}
                onChange={(e) => handleChange('artikel_type', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Afbeelding URL
              </label>
              <input
                type="text"
                value={formData.afbeelding || ''}
                onChange={(e) => handleChange('afbeelding', e.target.value)}
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

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.geblokkeerd === true}
                  onChange={(e) => handleChange('geblokkeerd', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Geblokkeerd</span>
              </label>
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.bestelartikel === true}
                  onChange={(e) => handleChange('bestelartikel', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Bestelartikel</span>
              </label>
            </div>
          </div>
        );

      case 'inkoop':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Leverancier
              </label>
              <input
                type="text"
                value={formData.leverancier || formData.supplier || ''}
                onChange={(e) => {
                  handleChange('leverancier', e.target.value);
                  handleChange('supplier', e.target.value);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Artikelnummer Leverancier
              </label>
              <input
                type="text"
                value={formData.artikelnummer_leverancier || ''}
                onChange={(e) => handleChange('artikelnummer_leverancier', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Inkoopprijs (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.inkoopprijs || ''}
                onChange={(e) => handleChange('inkoopprijs', parseFloat(e.target.value) || undefined)}
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
                Inkoopeenheid
              </label>
              <input
                type="text"
                value={formData.inkoopeenheid || ''}
                onChange={(e) => handleChange('inkoopeenheid', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Inkoopaantal
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.inkoopaantal || ''}
                onChange={(e) => handleChange('inkoopaantal', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Minimum Inkoophoeveelheid
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minimum_inkoophoeveelheid || ''}
                onChange={(e) => handleChange('minimum_inkoophoeveelheid', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Leveringstijd
              </label>
              <input
                type="text"
                value={formData.leveringstijd || ''}
                onChange={(e) => handleChange('leveringstijd', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Agentschap
              </label>
              <input
                type="text"
                value={formData.agentschap || ''}
                onChange={(e) => handleChange('agentschap', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Agentschapnummer
              </label>
              <input
                type="text"
                value={formData.agentschapnummer || ''}
                onChange={(e) => handleChange('agentschapnummer', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prijs Emballage (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.prijs_emballage || ''}
                onChange={(e) => handleChange('prijs_emballage', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Emballage Artikel
              </label>
              <input
                type="text"
                value={formData.emballage_artikel || ''}
                onChange={(e) => handleChange('emballage_artikel', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'voorraad':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Magazijn Voorraad
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.magazijn || formData.stock_quantity || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || undefined;
                  handleChange('magazijn', val);
                  handleChange('stock_quantity', val);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                In Voorraad (Fysiek)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.in_voorraad_fysiek || ''}
                onChange={(e) => handleChange('in_voorraad_fysiek', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Besteld
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.besteld || ''}
                onChange={(e) => handleChange('besteld', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Beschikbaar
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.beschikbaar || ''}
                onChange={(e) => handleChange('beschikbaar', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Minimumvoorraadniveau
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minimumvoorraadniveau || formData.min_stock || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || undefined;
                  handleChange('minimumvoorraadniveau', val);
                  handleChange('min_stock', val);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Artikel Locatie
              </label>
              <input
                type="text"
                value={formData.artikel_locatie || ''}
                onChange={(e) => handleChange('artikel_locatie', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Aantal Dozen
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.aantal_dozen || ''}
                onChange={(e) => handleChange('aantal_dozen', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'categorie':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hoofdcategorie
              </label>
              <input
                type="text"
                value={formData.hoofdcategorie || ''}
                onChange={(e) => handleChange('hoofdcategorie', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sub Categorie
              </label>
              <input
                type="text"
                value={formData.sub_categorie || ''}
                onChange={(e) => handleChange('sub_categorie', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Categorie
              </label>
              <input
                type="text"
                value={formData.categorie || formData.category || ''}
                onChange={(e) => {
                  handleChange('categorie', e.target.value);
                  handleChange('category', e.target.value);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additionele Categorie
              </label>
              <input
                type="text"
                value={formData.additionele_categorie || ''}
                onChange={(e) => handleChange('additionele_categorie', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Groep
              </label>
              <input
                type="text"
                value={formData.groep || ''}
                onChange={(e) => handleChange('groep', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Group
              </label>
              <input
                type="text"
                value={formData.additional_group || ''}
                onChange={(e) => handleChange('additional_group', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Classificatie
              </label>
              <input
                type="text"
                value={formData.classificatie || ''}
                onChange={(e) => handleChange('classificatie', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Webshop Categorie
              </label>
              <input
                type="text"
                value={formData.webshop_categorie || ''}
                onChange={(e) => handleChange('webshop_categorie', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'dranken':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ABV (Alcohol %)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.abv || ''}
                onChange={(e) => handleChange('abv', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Aantal Liter
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.aantal_liter || ''}
                onChange={(e) => handleChange('aantal_liter', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Aantal in Hectoliter
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.aantal_in_hectoliter || ''}
                onChange={(e) => handleChange('aantal_in_hectoliter', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Carbonatie
              </label>
              <input
                type="text"
                value={formData.carbonatie || ''}
                onChange={(e) => handleChange('carbonatie', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tapkoppeling
              </label>
              <input
                type="text"
                value={formData.tapkoppeling || ''}
                onChange={(e) => handleChange('tapkoppeling', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type Sluiting
              </label>
              <input
                type="text"
                value={formData.type_sluiting || ''}
                onChange={(e) => handleChange('type_sluiting', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fruitcomponent
              </label>
              <input
                type="text"
                value={formData.fruitcomponent || ''}
                onChange={(e) => handleChange('fruitcomponent', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Land van Oorsprong
              </label>
              <input
                type="text"
                value={formData.land_van_oorsprong || ''}
                onChange={(e) => handleChange('land_van_oorsprong', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Streek/Regio
              </label>
              <input
                type="text"
                value={formData.streek_regio || ''}
                onChange={(e) => handleChange('streek_regio', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'wijn':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Wijnhuis
              </label>
              <input
                type="text"
                value={formData.wijnhuis || ''}
                onChange={(e) => handleChange('wijnhuis', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Wijnstijl
              </label>
              <input
                type="text"
                value={formData.wijnstijl || ''}
                onChange={(e) => handleChange('wijnstijl', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Druifsoort
              </label>
              <input
                type="text"
                value={formData.druifsoort || ''}
                onChange={(e) => handleChange('druifsoort', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Teeltwijze
              </label>
              <input
                type="text"
                value={formData.teeltwijze || ''}
                onChange={(e) => handleChange('teeltwijze', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Land van Oorsprong
              </label>
              <input
                type="text"
                value={formData.land_van_oorsprong || ''}
                onChange={(e) => handleChange('land_van_oorsprong', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Streek/Regio
              </label>
              <input
                type="text"
                value={formData.streek_regio || ''}
                onChange={(e) => handleChange('streek_regio', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'verkoop':
        return (
          <div className="grid grid-cols-2 gap-6">
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
                value={formData.verkoopprijs_2 || ''}
                onChange={(e) => handleChange('verkoopprijs_2', parseFloat(e.target.value) || undefined)}
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
                value={formData.verkoopprijs_3 || ''}
                onChange={(e) => handleChange('verkoopprijs_3', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Horeca Adviesprijs (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.horeca_adviesprijs || ''}
                onChange={(e) => handleChange('horeca_adviesprijs', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kortingsgroep
              </label>
              <input
                type="text"
                value={formData.kortingsgroep || ''}
                onChange={(e) => handleChange('kortingsgroep', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.webshop === true}
                  onChange={(e) => handleChange('webshop', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Beschikbaar in Webshop</span>
              </label>
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.slijterij_afhalen === true}
                  onChange={(e) => handleChange('slijterij_afhalen', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Slijterij Afhalen</span>
              </label>
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.slijterij_bezorgen === true}
                  onChange={(e) => handleChange('slijterij_bezorgen', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Slijterij Bezorgen</span>
              </label>
            </div>
          </div>
        );

      case 'extra':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notities
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
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
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{formData.artikelnaam}</h2>
                <p className="text-sm text-slate-500">Artikelnummer: {formData.artikelnummer}</p>
              </div>
              <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="border-b">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                      activeTab === tab.key
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {renderTabContent()}
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
