import React, { useState } from 'react';
import { ArrowLeft, Save, Info } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Lead, TeamMember } from '../../../lib/types';

interface LeadFormProps {
  lead: Lead | null;
  accountManagers: TeamMember[];
  onSave: () => void;
  onCancel: () => void;
}

const KLANTTYPE_OPTIONS = [
  'Brouwerijen',
  'Cafés',
  'Restaurants',
  'Hotels & Herbergen',
  'Detailhandel & Retail',
  'Evenementen & Festivals',
  'Sportverenigingen',
  'Clubs',
  'Buurthuizen',
  'Zorglocaties',
  'Overig'
];

const HERKOMST_OPTIONS = [
  'Website',
  'Telefoon',
  'Email',
  'Referral',
  'Beurs',
  'LinkedIn',
  'Andere'
];

export default function LeadForm({ lead, accountManagers, onSave, onCancel }: LeadFormProps) {
  console.log('🎨 [LeadForm] Rendering with', accountManagers?.length || 0, 'account managers');

  const [formData, setFormData] = useState({
    datum_invoer: lead?.datum_invoer || new Date().toISOString().split('T')[0],
    accountmanager_id: lead?.accountmanager_id || '',
    herkomst: lead?.herkomst || '',
    bedrijfsnaam: lead?.bedrijfsnaam || '',
    klanttype: lead?.klanttype || '',
    contactpersoon: lead?.contactpersoon || '',
    telefoonnummer: lead?.telefoonnummer || '',
    mobiel: lead?.mobiel || '',
    email_algemeen: lead?.email_algemeen || '',
    email_factuur: lead?.email_factuur || '',
    straat_huisnummer: lead?.straat_huisnummer || '',
    postcode: lead?.postcode || '',
    plaats: lead?.plaats || '',
    iban: lead?.iban || '',
    tenaamstelling: lead?.tenaamstelling || '',
    bedrijfsleider: lead?.bedrijfsleider || '',
    telefoon_bedrijfsleider: lead?.telefoon_bedrijfsleider || '',
    datum_eerste_contact: lead?.datum_eerste_contact || '',
    datum_bezoek: lead?.datum_bezoek || '',
    datum_assortiment: lead?.datum_assortiment || '',
    datum_offerte: lead?.datum_offerte || '',
    datum_offerte_verstuurd: lead?.datum_offerte_verstuurd || '',
    volgende_actie: lead?.volgende_actie || '',
    datum_volgende_actie: lead?.datum_volgende_actie || '',
    opmerkingen: lead?.opmerkingen || '',
    status: lead?.status || 'Lead'
  });

  const [saving, setSaving] = useState(false);
  const [showKlanttypeInfo, setShowKlanttypeInfo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (!teamMember) throw new Error('No company found');

      const leadData = {
        ...formData,
        company_id: teamMember.company_id,
        accountmanager_id: formData.accountmanager_id || null,
        datum_eerste_contact: formData.datum_eerste_contact || null,
        datum_bezoek: formData.datum_bezoek || null,
        datum_assortiment: formData.datum_assortiment || null,
        datum_offerte: formData.datum_offerte || null,
        datum_offerte_verstuurd: formData.datum_offerte_verstuurd || null,
        datum_volgende_actie: formData.datum_volgende_actie || null
      };

      if (lead) {
        const { error } = await supabase
          .from('leads')
          .update(leadData)
          .eq('id', lead.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('leads')
          .insert(leadData);

        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Fout bij opslaan van lead');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lead ? 'Lead bewerken' : 'Nieuwe lead'}
          </h1>
          <p className="text-gray-600 mt-1">Vul alle gegevens in voor de nieuwe lead</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basisgegevens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Datum invoer
              </label>
              <input
                type="date"
                required
                value={formData.datum_invoer}
                onChange={(e) => setFormData({ ...formData, datum_invoer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accountmanager <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.accountmanager_id}
                onChange={(e) => setFormData({ ...formData, accountmanager_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecteer accountmanager</option>
                {accountManagers && accountManagers.length > 0 ? (
                  accountManagers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.first_name} {manager.last_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Geen accountmanagers beschikbaar</option>
                )}
              </select>
              {accountManagers && accountManagers.length === 0 && (
                <p className="mt-1 text-sm text-orange-600">
                  ⚠️ Geen accountmanagers geladen. Voer eerst de SQL fix uit.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Herkomst
              </label>
              <select
                value={formData.herkomst}
                onChange={(e) => setFormData({ ...formData, herkomst: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecteer herkomst</option>
                {HERKOMST_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                Klanttype
                <button
                  type="button"
                  onClick={() => setShowKlanttypeInfo(!showKlanttypeInfo)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Info className="w-4 h-4" />
                </button>
              </label>
              <select
                value={formData.klanttype}
                onChange={(e) => setFormData({ ...formData, klanttype: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecteer klanttype</option>
                {KLANTTYPE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bedrijfsgegevens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrijfsnaam <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.bedrijfsnaam}
                onChange={(e) => setFormData({ ...formData, bedrijfsnaam: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Straat & huisnummer
              </label>
              <input
                type="text"
                value={formData.straat_huisnummer}
                onChange={(e) => setFormData({ ...formData, straat_huisnummer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode
              </label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plaats
              </label>
              <input
                type="text"
                value={formData.plaats}
                onChange={(e) => setFormData({ ...formData, plaats: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrijfsleider
              </label>
              <input
                type="text"
                value={formData.bedrijfsleider}
                onChange={(e) => setFormData({ ...formData, bedrijfsleider: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefoon bedrijfsleider
              </label>
              <input
                type="tel"
                value={formData.telefoon_bedrijfsleider}
                onChange={(e) => setFormData({ ...formData, telefoon_bedrijfsleider: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contactgegevens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contactpersoon
              </label>
              <input
                type="text"
                value={formData.contactpersoon}
                onChange={(e) => setFormData({ ...formData, contactpersoon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefoonnummer
              </label>
              <input
                type="tel"
                value={formData.telefoonnummer}
                onChange={(e) => setFormData({ ...formData, telefoonnummer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobiel
              </label>
              <input
                type="tel"
                value={formData.mobiel}
                onChange={(e) => setFormData({ ...formData, mobiel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email algemeen
              </label>
              <input
                type="email"
                value={formData.email_algemeen}
                onChange={(e) => setFormData({ ...formData, email_algemeen: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email factuur
              </label>
              <input
                type="email"
                value={formData.email_factuur}
                onChange={(e) => setFormData({ ...formData, email_factuur: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IBAN
              </label>
              <input
                type="text"
                value={formData.iban}
                onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenaamstelling
              </label>
              <input
                type="text"
                value={formData.tenaamstelling}
                onChange={(e) => setFormData({ ...formData, tenaamstelling: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow datums</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Eerste contact
              </label>
              <input
                type="date"
                value={formData.datum_eerste_contact}
                onChange={(e) => setFormData({ ...formData, datum_eerste_contact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bezoek gepland
              </label>
              <input
                type="date"
                value={formData.datum_bezoek}
                onChange={(e) => setFormData({ ...formData, datum_bezoek: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assortiment besproken
              </label>
              <input
                type="date"
                value={formData.datum_assortiment}
                onChange={(e) => setFormData({ ...formData, datum_assortiment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offerte gemaakt
              </label>
              <input
                type="date"
                value={formData.datum_offerte}
                onChange={(e) => setFormData({ ...formData, datum_offerte: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offerte verstuurd
              </label>
              <input
                type="date"
                value={formData.datum_offerte_verstuurd}
                onChange={(e) => setFormData({ ...formData, datum_offerte_verstuurd: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Datum volgende actie
              </label>
              <input
                type="date"
                value={formData.datum_volgende_actie}
                onChange={(e) => setFormData({ ...formData, datum_volgende_actie: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Volgende stap & opmerkingen</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volgende actie
              </label>
              <input
                type="text"
                value={formData.volgende_actie}
                onChange={(e) => setFormData({ ...formData, volgende_actie: e.target.value })}
                placeholder="Bijv: Bellen voor vervolgafspraak"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opmerkingen
              </label>
              <textarea
                rows={4}
                value={formData.opmerkingen}
                onChange={(e) => setFormData({ ...formData, opmerkingen: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Lead">Lead</option>
                <option value="In behandeling">In behandeling</option>
                <option value="Offerte">Offerte</option>
                <option value="Formulier gemaild">Formulier gemaild</option>
                <option value="Klant actief">Klant actief</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors"
          >
            Annuleren
          </button>
        </div>
      </form>

      {showKlanttypeInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Klanttype Categorieën</h3>
                <button
                  onClick={() => setShowKlanttypeInfo(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-2 text-sm">
              <p><strong>Brouwerijen</strong> — brouwerijen en bierproducenten</p>
              <p><strong>Cafés</strong> — bruine cafés, nacht- en feestcafés</p>
              <p><strong>Restaurants</strong> — alle typen restaurants</p>
              <p><strong>Hotels & Herbergen</strong> — hotels en pensions</p>
              <p><strong>Detailhandel & Retail</strong> — slijterijen, supermarkten, delicatessenzaken</p>
              <p><strong>Evenementen & Festivals</strong> — festivals, cateraars, evenementenlocaties</p>
              <p><strong>Sportverenigingen</strong> — sportverenigingen en sportclubs</p>
              <p><strong>Clubs</strong> — sociale clubs en verenigingen</p>
              <p><strong>Buurthuizen</strong> — gemeenschapscentra</p>
              <p><strong>Zorglocaties</strong> — zorginstellingen</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
