import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface FieldSetting {
  id?: string;
  company_id: string;
  category: string;
  field_name: string;
  visible: boolean;
  disabled: boolean;
  tab_name: string;
}

const ALL_FIELDS = [
  { name: 'artikelnummer', label: 'Artikelnummer', defaultTab: 'basis' },
  { name: 'eenheid', label: 'Eenheid', defaultTab: 'basis' },
  { name: 'artikelnaam', label: 'Artikelnaam', defaultTab: 'basis' },
  { name: 'omschrijving', label: 'Omschrijving', defaultTab: 'basis' },
  { name: 'inhoud', label: 'Inhoud', defaultTab: 'basis' },
  { name: 'gewicht', label: 'Gewicht', defaultTab: 'basis' },
  { name: 'ean_nummer', label: 'EAN Nummer', defaultTab: 'basis' },
  { name: 'merk', label: 'Merk', defaultTab: 'basis' },
  { name: 'artikel_type', label: 'Artikel Type', defaultTab: 'basis' },
  { name: 'afbeelding', label: 'Afbeelding', defaultTab: 'basis' },

  { name: 'leverancier', label: 'Leverancier', defaultTab: 'inkoop' },
  { name: 'artikelnummer_leverancier', label: 'Artikelnr. Leverancier', defaultTab: 'inkoop' },
  { name: 'inkoopprijs', label: 'Inkoopprijs', defaultTab: 'inkoop' },
  { name: 'kostprijs', label: 'Kostprijs', defaultTab: 'inkoop' },
  { name: 'inkoopeenheid', label: 'Inkoopeenheid', defaultTab: 'inkoop' },
  { name: 'inkoopaantal', label: 'Inkoopaantal', defaultTab: 'inkoop' },
  { name: 'minimum_inkoophoeveelheid', label: 'Min. Inkoophoeveelheid', defaultTab: 'inkoop' },
  { name: 'leveringstijd', label: 'Leveringstijd', defaultTab: 'inkoop' },
  { name: 'agentschap', label: 'Agentschap', defaultTab: 'inkoop' },
  { name: 'agentschapnummer', label: 'Agentschapnummer', defaultTab: 'inkoop' },
  { name: 'prijs_emballage', label: 'Prijs Emballage', defaultTab: 'inkoop' },
  { name: 'emballage_artikel', label: 'Emballage Artikel', defaultTab: 'inkoop' },

  { name: 'magazijn', label: 'Magazijn Voorraad', defaultTab: 'voorraad' },
  { name: 'in_voorraad_fysiek', label: 'Fysieke Voorraad', defaultTab: 'voorraad' },
  { name: 'besteld', label: 'Besteld', defaultTab: 'voorraad' },
  { name: 'beschikbaar', label: 'Beschikbaar', defaultTab: 'voorraad' },
  { name: 'minimumvoorraadniveau', label: 'Min. Voorraadniveau', defaultTab: 'voorraad' },
  { name: 'artikel_locatie', label: 'Artikel Locatie', defaultTab: 'voorraad' },
  { name: 'aantal_dozen', label: 'Aantal Dozen', defaultTab: 'voorraad' },

  { name: 'hoofdcategorie', label: 'Hoofdcategorie', defaultTab: 'categorie' },
  { name: 'sub_categorie', label: 'Sub Categorie', defaultTab: 'categorie' },
  { name: 'categorie', label: 'Categorie', defaultTab: 'categorie' },
  { name: 'additionele_categorie', label: 'Additionele Categorie', defaultTab: 'categorie' },
  { name: 'groep', label: 'Groep', defaultTab: 'categorie' },
  { name: 'additional_group', label: 'Additional Group', defaultTab: 'categorie' },
  { name: 'classificatie', label: 'Classificatie', defaultTab: 'categorie' },
  { name: 'webshop_categorie', label: 'Webshop Categorie', defaultTab: 'categorie' },

  { name: 'abv', label: 'ABV (Alcohol %)', defaultTab: 'dranken' },
  { name: 'aantal_liter', label: 'Aantal Liter', defaultTab: 'dranken' },
  { name: 'aantal_in_hectoliter', label: 'Aantal in Hectoliter', defaultTab: 'dranken' },
  { name: 'carbonatie', label: 'Carbonatie', defaultTab: 'dranken' },
  { name: 'tapkoppeling', label: 'Tapkoppeling', defaultTab: 'dranken' },
  { name: 'type_sluiting', label: 'Type Sluiting', defaultTab: 'dranken' },
  { name: 'fruitcomponent', label: 'Fruitcomponent', defaultTab: 'dranken' },
  { name: 'land_van_oorsprong', label: 'Land van Oorsprong', defaultTab: 'dranken' },
  { name: 'streek_regio', label: 'Streek/Regio', defaultTab: 'dranken' },

  { name: 'wijnhuis', label: 'Wijnhuis', defaultTab: 'wijn' },
  { name: 'wijnstijl', label: 'Wijnstijl', defaultTab: 'wijn' },
  { name: 'druifsoort', label: 'Druifsoort', defaultTab: 'wijn' },
  { name: 'teeltwijze', label: 'Teeltwijze', defaultTab: 'wijn' },

  { name: 'verkoopprijs_1', label: 'Verkoopprijs 1', defaultTab: 'verkoop' },
  { name: 'verkoopprijs_2', label: 'Verkoopprijs 2', defaultTab: 'verkoop' },
  { name: 'verkoopprijs_3', label: 'Verkoopprijs 3', defaultTab: 'verkoop' },
  { name: 'horeca_adviesprijs', label: 'Horeca Adviesprijs', defaultTab: 'verkoop' },
  { name: 'kortingsgroep', label: 'Kortingsgroep', defaultTab: 'verkoop' },
  { name: 'webshop', label: 'Webshop', defaultTab: 'verkoop' },
  { name: 'slijterij_afhalen', label: 'Slijterij Afhalen', defaultTab: 'verkoop' },
  { name: 'slijterij_bezorgen', label: 'Slijterij Bezorgen', defaultTab: 'verkoop' },
];

const CATEGORIES = [
  'Wijnen',
  'Bieren',
  'Frisdranken',
  'Gedistilleerd',
  'Non-Food',
  'Levensmiddelen',
  'Techniek & Apparatuur'
];

const TABS = [
  { value: 'basis', label: 'Basis Gegevens' },
  { value: 'inkoop', label: 'Inkoop' },
  { value: 'voorraad', label: 'Voorraad' },
  { value: 'categorie', label: 'Categorieën' },
  { value: 'dranken', label: 'Dranken Info' },
  { value: 'wijn', label: 'Wijn Info' },
  { value: 'verkoop', label: 'Verkoop' },
  { value: 'extra', label: 'Extra' },
];

export function ArtikelveldenInstellingen() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [fieldSettings, setFieldSettings] = useState<Record<string, FieldSetting>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const COMPANY_ID = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadFieldSettings();
  }, [selectedCategory]);

  const loadFieldSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('article_field_settings')
        .select('*')
        .eq('company_id', COMPANY_ID)
        .eq('category', selectedCategory);

      if (error) throw error;

      const settingsMap: Record<string, FieldSetting> = {};

      data?.forEach(setting => {
        settingsMap[setting.field_name] = setting;
      });

      ALL_FIELDS.forEach(field => {
        if (!settingsMap[field.name]) {
          settingsMap[field.name] = {
            company_id: COMPANY_ID,
            category: selectedCategory,
            field_name: field.name,
            visible: true,
            disabled: false,
            tab_name: field.defaultTab,
          };
        }
      });

      setFieldSettings(settingsMap);
    } catch (err: any) {
      console.error('Error loading field settings:', err);
      setMessage({ type: 'error', text: 'Fout bij laden instellingen' });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName: string, key: keyof FieldSetting, value: any) => {
    setFieldSettings(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        [key]: value,
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const settingsToSave = Object.values(fieldSettings);

      for (const setting of settingsToSave) {
        if (setting.id) {
          const { error } = await supabase
            .from('article_field_settings')
            .update({
              visible: setting.visible,
              disabled: setting.disabled,
              tab_name: setting.tab_name,
              updated_at: new Date().toISOString(),
            })
            .eq('id', setting.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('article_field_settings')
            .insert({
              company_id: setting.company_id,
              category: setting.category,
              field_name: setting.field_name,
              visible: setting.visible,
              disabled: setting.disabled,
              tab_name: setting.tab_name,
            });

          if (error) throw error;
        }
      }

      setMessage({ type: 'success', text: 'Instellingen opgeslagen!' });
      await loadFieldSettings();
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setMessage({ type: 'error', text: `Fout bij opslaan: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Weet je zeker dat je de standaardinstellingen wilt herstellen?')) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('article_field_settings')
        .delete()
        .eq('company_id', COMPANY_ID)
        .eq('category', selectedCategory);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Standaardinstellingen hersteld!' });
      await loadFieldSettings();
    } catch (err: any) {
      console.error('Error resetting settings:', err);
      setMessage({ type: 'error', text: `Fout bij resetten: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Artikelvelden per Hoofdcategorie</h2>
        <p className="text-slate-600">
          Configureer welke velden zichtbaar zijn en op welk tabblad ze verschijnen per productcategorie
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex h-[calc(100vh-240px)]">
          <div className="w-64 border-r border-slate-200 bg-slate-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Categorieën</h3>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg mb-1 transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Veldinstellingen voor: {selectedCategory}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Opslaan...' : 'Opslaan'}
                  </button>
                </div>
              </div>
            </div>

            {message && (
              <div className={`mx-6 mt-4 p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message.text}
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="text-center py-8 text-slate-600">Laden...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                          Veldnaam
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 border-b border-slate-200">
                          Zichtbaar
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 border-b border-slate-200">
                          Grijs (Niet Bewerken)
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                          Tabblad
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ALL_FIELDS.map((field, index) => {
                        const setting = fieldSettings[field.name];
                        if (!setting) return null;

                        return (
                          <tr
                            key={field.name}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                          >
                            <td className="px-4 py-3 text-sm text-slate-900 border-b border-slate-200">
                              {field.label}
                            </td>
                            <td className="px-4 py-3 text-center border-b border-slate-200">
                              <input
                                type="checkbox"
                                checked={setting.visible}
                                onChange={(e) => handleFieldChange(field.name, 'visible', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center border-b border-slate-200">
                              <input
                                type="checkbox"
                                checked={setting.disabled}
                                onChange={(e) => handleFieldChange(field.name, 'disabled', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 border-b border-slate-200">
                              <select
                                value={setting.tab_name}
                                onChange={(e) => handleFieldChange(field.name, 'tab_name', e.target.value)}
                                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {TABS.map(tab => (
                                  <option key={tab.value} value={tab.value}>
                                    {tab.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
