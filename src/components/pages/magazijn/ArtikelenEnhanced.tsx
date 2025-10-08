import React, { useState, useEffect } from 'react';
import { Upload, X, Save, Info } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { DataTable } from '../../common/DataTable';
import { ArtikelenUpload } from './ArtikelenUpload';
import { useFieldSettings } from '../../../hooks/useFieldSettings';

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

interface FieldDefinition {
  name: keyof Product;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'checkbox';
  defaultTab: string;
  step?: string;
}

const FIELD_DEFINITIONS: FieldDefinition[] = [
  { name: 'artikelnummer', label: 'Artikelnummer', type: 'text', defaultTab: 'basis' },
  { name: 'eenheid', label: 'Eenheid', type: 'text', defaultTab: 'basis' },
  { name: 'artikelnaam', label: 'Artikelnaam', type: 'text', defaultTab: 'basis' },
  { name: 'omschrijving', label: 'Omschrijving', type: 'textarea', defaultTab: 'basis' },
  { name: 'inhoud', label: 'Inhoud', type: 'text', defaultTab: 'basis' },
  { name: 'gewicht', label: 'Gewicht (kg)', type: 'number', defaultTab: 'basis', step: '0.01' },
  { name: 'ean_nummer', label: 'EAN Nummer / Barcode', type: 'text', defaultTab: 'basis' },
  { name: 'merk', label: 'Merk', type: 'text', defaultTab: 'basis' },
  { name: 'artikel_type', label: 'Artikel Type', type: 'text', defaultTab: 'basis' },
  { name: 'afbeelding', label: 'Afbeelding URL', type: 'text', defaultTab: 'basis' },
  { name: 'active', label: 'Actief artikel', type: 'checkbox', defaultTab: 'basis' },
  { name: 'geblokkeerd', label: 'Geblokkeerd', type: 'checkbox', defaultTab: 'basis' },
  { name: 'bestelartikel', label: 'Bestelartikel', type: 'checkbox', defaultTab: 'basis' },

  { name: 'leverancier', label: 'Leverancier', type: 'text', defaultTab: 'inkoop' },
  { name: 'artikelnummer_leverancier', label: 'Artikelnummer Leverancier', type: 'text', defaultTab: 'inkoop' },
  { name: 'inkoopprijs', label: 'Inkoopprijs (€)', type: 'number', defaultTab: 'inkoop', step: '0.01' },
  { name: 'kostprijs', label: 'Kostprijs (€)', type: 'number', defaultTab: 'inkoop', step: '0.01' },
  { name: 'inkoopeenheid', label: 'Inkoopeenheid', type: 'text', defaultTab: 'inkoop' },
  { name: 'inkoopaantal', label: 'Inkoopaantal', type: 'number', defaultTab: 'inkoop', step: '0.01' },
  { name: 'minimum_inkoophoeveelheid', label: 'Minimum Inkoophoeveelheid', type: 'number', defaultTab: 'inkoop', step: '0.01' },
  { name: 'leveringstijd', label: 'Leveringstijd', type: 'text', defaultTab: 'inkoop' },
  { name: 'agentschap', label: 'Agentschap', type: 'text', defaultTab: 'inkoop' },
  { name: 'agentschapnummer', label: 'Agentschapnummer', type: 'text', defaultTab: 'inkoop' },
  { name: 'prijs_emballage', label: 'Prijs Emballage (€)', type: 'number', defaultTab: 'inkoop', step: '0.01' },
  { name: 'emballage_artikel', label: 'Emballage Artikel', type: 'text', defaultTab: 'inkoop' },

  { name: 'magazijn', label: 'Magazijn Voorraad', type: 'number', defaultTab: 'voorraad', step: '0.01' },
  { name: 'in_voorraad_fysiek', label: 'Fysieke Voorraad', type: 'number', defaultTab: 'voorraad', step: '0.01' },
  { name: 'besteld', label: 'Besteld', type: 'number', defaultTab: 'voorraad', step: '0.01' },
  { name: 'beschikbaar', label: 'Beschikbaar', type: 'number', defaultTab: 'voorraad', step: '0.01' },
  { name: 'minimumvoorraadniveau', label: 'Minimumvoorraadniveau', type: 'number', defaultTab: 'voorraad', step: '0.01' },
  { name: 'artikel_locatie', label: 'Artikel Locatie', type: 'text', defaultTab: 'voorraad' },
  { name: 'aantal_dozen', label: 'Aantal Dozen', type: 'number', defaultTab: 'voorraad', step: '0.01' },

  { name: 'hoofdcategorie', label: 'Hoofdcategorie', type: 'text', defaultTab: 'categorie' },
  { name: 'sub_categorie', label: 'Sub Categorie', type: 'text', defaultTab: 'categorie' },
  { name: 'categorie', label: 'Categorie', type: 'text', defaultTab: 'categorie' },
  { name: 'additionele_categorie', label: 'Additionele Categorie', type: 'text', defaultTab: 'categorie' },
  { name: 'groep', label: 'Groep', type: 'text', defaultTab: 'categorie' },
  { name: 'additional_group', label: 'Additional Group', type: 'text', defaultTab: 'categorie' },
  { name: 'classificatie', label: 'Classificatie', type: 'text', defaultTab: 'categorie' },
  { name: 'webshop_categorie', label: 'Webshop Categorie', type: 'text', defaultTab: 'categorie' },

  { name: 'abv', label: 'ABV (Alcohol %)', type: 'number', defaultTab: 'dranken', step: '0.01' },
  { name: 'aantal_liter', label: 'Aantal Liter', type: 'number', defaultTab: 'dranken', step: '0.01' },
  { name: 'aantal_in_hectoliter', label: 'Aantal in Hectoliter', type: 'number', defaultTab: 'dranken', step: '0.0001' },
  { name: 'carbonatie', label: 'Carbonatie', type: 'text', defaultTab: 'dranken' },
  { name: 'tapkoppeling', label: 'Tapkoppeling', type: 'text', defaultTab: 'dranken' },
  { name: 'type_sluiting', label: 'Type Sluiting', type: 'text', defaultTab: 'dranken' },
  { name: 'fruitcomponent', label: 'Fruitcomponent', type: 'text', defaultTab: 'dranken' },
  { name: 'land_van_oorsprong', label: 'Land van Oorsprong', type: 'text', defaultTab: 'dranken' },
  { name: 'streek_regio', label: 'Streek/Regio', type: 'text', defaultTab: 'dranken' },

  { name: 'wijnhuis', label: 'Wijnhuis', type: 'text', defaultTab: 'wijn' },
  { name: 'wijnstijl', label: 'Wijnstijl', type: 'text', defaultTab: 'wijn' },
  { name: 'druifsoort', label: 'Druifsoort', type: 'text', defaultTab: 'wijn' },
  { name: 'teeltwijze', label: 'Teeltwijze', type: 'text', defaultTab: 'wijn' },

  { name: 'verkoopprijs_1', label: 'Verkoopprijs 1 (€)', type: 'number', defaultTab: 'verkoop', step: '0.01' },
  { name: 'verkoopprijs_2', label: 'Verkoopprijs 2 (€)', type: 'number', defaultTab: 'verkoop', step: '0.01' },
  { name: 'verkoopprijs_3', label: 'Verkoopprijs 3 (€)', type: 'number', defaultTab: 'verkoop', step: '0.01' },
  { name: 'horeca_adviesprijs', label: 'Horeca Adviesprijs (€)', type: 'number', defaultTab: 'verkoop', step: '0.01' },
  { name: 'kortingsgroep', label: 'Kortingsgroep', type: 'text', defaultTab: 'verkoop' },
  { name: 'webshop', label: 'Beschikbaar in Webshop', type: 'checkbox', defaultTab: 'verkoop' },
  { name: 'slijterij_afhalen', label: 'Slijterij Afhalen', type: 'checkbox', defaultTab: 'verkoop' },
  { name: 'slijterij_bezorgen', label: 'Slijterij Bezorgen', type: 'checkbox', defaultTab: 'verkoop' },

  { name: 'notes', label: 'Notities', type: 'textarea', defaultTab: 'extra' },
];

export function ArtikelenEnhanced() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [activeTab, setActiveTab] = useState('basis');

  const hoofdcategorie = editingProduct?.hoofdcategorie || editingProduct?.category;

  const {
    shouldShowField,
    isFieldDisabled,
    getFieldTab,
    availableTabs,
    loading: settingsLoading
  } = useFieldSettings(hoofdcategorie);

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

  const renderField = (fieldDef: FieldDefinition) => {
    const fieldName = fieldDef.name as string;
    const visible = shouldShowField(fieldName);
    const disabled = isFieldDisabled(fieldName);
    const tab = getFieldTab(fieldName, fieldDef.defaultTab);

    if (!visible) return null;
    if (tab !== activeTab) return null;

    const value = formData[fieldDef.name];
    const inputClass = `w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
    }`;

    const renderInput = () => {
      switch (fieldDef.type) {
        case 'textarea':
          return (
            <textarea
              value={(value as string) || ''}
              onChange={(e) => handleChange(fieldDef.name, e.target.value)}
              disabled={disabled}
              rows={3}
              className={inputClass}
            />
          );
        case 'checkbox':
          return (
            <input
              type="checkbox"
              checked={(value as boolean) || false}
              onChange={(e) => handleChange(fieldDef.name, e.target.checked)}
              disabled={disabled}
              className={`w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 ${
                disabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
            />
          );
        case 'number':
          return (
            <input
              type="number"
              step={fieldDef.step}
              value={(value as number) || ''}
              onChange={(e) => handleChange(fieldDef.name, parseFloat(e.target.value) || undefined as any)}
              disabled={disabled}
              className={inputClass}
            />
          );
        default:
          return (
            <input
              type="text"
              value={(value as string) || ''}
              onChange={(e) => handleChange(fieldDef.name, e.target.value)}
              disabled={disabled}
              className={inputClass}
            />
          );
      }
    };

    if (fieldDef.type === 'checkbox') {
      return (
        <div key={fieldDef.name} className="col-span-2">
          <label className="flex items-center gap-2">
            {renderInput()}
            <span className={`text-sm font-medium ${disabled ? 'text-gray-500' : 'text-slate-700'}`}>
              {fieldDef.label}
            </span>
            {disabled && (
              <div className="relative group">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10">
                  Niet van toepassing voor deze productgroep
                </div>
              </div>
            )}
          </label>
        </div>
      );
    }

    return (
      <div key={fieldDef.name} className={fieldDef.type === 'textarea' ? 'col-span-2' : ''}>
        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
          {fieldDef.label}
          {disabled && (
            <div className="relative group">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10">
                Niet van toepassing voor deze productgroep
              </div>
            </div>
          )}
        </label>
        {renderInput()}
      </div>
    );
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

  const tabLabels: Record<string, string> = {
    basis: 'Basis Gegevens',
    inkoop: 'Inkoop',
    voorraad: 'Voorraad',
    categorie: 'Categorieën',
    dranken: 'Dranken Info',
    wijn: 'Wijn Info',
    verkoop: 'Verkoop',
    extra: 'Extra',
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
          <div className="bg-white rounded-lg max-w-5xl w-full h-[90vh] flex flex-col">
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{formData.artikelnaam}</h2>
                <p className="text-sm text-slate-500">
                  Artikelnummer: {formData.artikelnummer}
                  {hoofdcategorie && ` • ${hoofdcategorie}`}
                </p>
              </div>
              <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {!hoofdcategorie && (
              <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Gebruik <strong>Instellingen → Artikelvelden per Hoofdcategorie</strong> om dit formulier te configureren per productgroep.
                </p>
              </div>
            )}

            <div className="border-b">
              <div className="flex overflow-x-auto">
                {availableTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tabLabels[tab] || tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {settingsLoading ? (
                <div className="text-center py-8 text-slate-600">Laden...</div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {FIELD_DEFINITIONS.map(renderField)}
                </div>
              )}
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
