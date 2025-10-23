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
    company_name: lead?.company_name || '',
    customer_type: lead?.customer_type || '',
    account_manager_id: lead?.account_manager_id || '',

    address: lead?.address || '',
    postal_code: lead?.postal_code || '',
    city: lead?.city || '',
    region: lead?.region || '',
    delivery_address: lead?.delivery_address || '',

    delivery_preference_days: lead?.delivery_preference_days || '',
    delivery_time_slots: lead?.delivery_time_slots || '',
    delivery_instructions: lead?.delivery_instructions || '',

    contact_person: lead?.contact_person || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    contact_role: lead?.contact_role || '',
    secondary_contact_name: lead?.secondary_contact_name || '',
    secondary_contact_email: lead?.secondary_contact_email || '',
    secondary_contact_phone: lead?.secondary_contact_phone || '',

    iban: lead?.iban || '',
    account_holder_name: lead?.account_holder_name || '',
    payment_terms: lead?.payment_terms || '',
    btw_number: lead?.btw_number || '',

    assortment_interests: lead?.assortment_interests || '',
    business_notes: lead?.business_notes || '',

    status: lead?.status || 'Lead',
    notes: lead?.notes || ''
  });

  const [saving, setSaving] = useState(false);
  const [showKlanttypeInfo, setShowKlanttypeInfo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Probeer eerst via user_companies
      let companyId = null;
      const { data: userCompany } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userCompany) {
        companyId = userCompany.company_id;
      } else {
        // Als geen company gevonden, gebruik demo company
        const DEMO_COMPANY_ID = '00000000-0000-0000-0000-000000000001';
        companyId = DEMO_COMPANY_ID;

        // Koppel user automatisch aan demo company
        await supabase
          .from('user_companies')
          .insert({
            user_id: user.id,
            company_id: DEMO_COMPANY_ID,
            role: 'user'
          })
          .select()
          .maybeSingle();
      }

      const leadData = {
        ...formData,
        company_id: companyId,
        account_manager_id: formData.account_manager_id || null
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
      alert(`Fout bij opslaan van lead: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header met LEAD-nummer */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 rounded-lg p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {lead ? 'Lead bewerken' : 'Nieuwe lead'}
              </h1>
              <p className="text-gray-600 mt-1">Dynamisch formulier met progressieve validatie</p>
            </div>
          </div>
          {lead?.temporary_customer_id && (
            <div className="text-right">
              <div className="text-xs text-orange-600 font-medium">LEADNUMMER</div>
              <div className="text-2xl font-bold text-orange-600 font-mono tracking-wider">
                {lead.temporary_customer_id}
              </div>
              <div className="text-xs text-gray-500 mt-1">Status: {lead.status}</div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">
        {/* Sectie 1: Basis */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Basisgegevens
            <span className="text-xs text-gray-500 font-normal">(Verplicht voor alle leads)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrijfsnaam <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                Klanttype
                <button
                  type="button"
                  onClick={() => setShowKlanttypeInfo(!showKlanttypeInfo)}
                  className="text-orange-500 hover:text-orange-600"
                >
                  <Info className="w-4 h-4" />
                </button>
              </label>
              <select
                value={formData.customer_type}
                onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecteer klanttype</option>
                {KLANTTYPE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accountmanager <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.account_manager_id}
                onChange={(e) => setFormData({ ...formData, account_manager_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecteer accountmanager</option>
                {accountManagers?.map(manager => (
                  <option key={manager.id} value={manager.id}>
                    {manager.first_name} {manager.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sectie 2: Adres */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            Adresgegevens
            <span className="text-xs text-gray-500 font-normal">{formData.status === 'Offerte' || formData.status === 'Klant actief' ? '(Verplicht)' : '(Optioneel)'}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Straat & huisnummer
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plaats
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Regio
              </label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leveradres (indien afwijkend)
              </label>
              <input
                type="text"
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Sectie 3: Levering */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            Leveringsinformatie
            <span className="text-xs text-gray-500 font-normal">{formData.status === 'Offerte' || formData.status === 'Klant actief' ? '(Verplicht)' : '(Optioneel)'}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voorkeur leveringsdagen
              </label>
              <input
                type="text"
                placeholder="Bijv: Maandag, Woensdag"
                value={formData.delivery_preference_days}
                onChange={(e) => setFormData({ ...formData, delivery_preference_days: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tijdvakken
              </label>
              <input
                type="text"
                placeholder="Bijv: 08:00-12:00"
                value={formData.delivery_time_slots}
                onChange={(e) => setFormData({ ...formData, delivery_time_slots: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leveringsinstructies
              </label>
              <textarea
                rows={2}
                value={formData.delivery_instructions}
                onChange={(e) => setFormData({ ...formData, delivery_instructions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Sectie 4: Contact */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-purple-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">4</span>
            Contactpersonen
            <span className="text-xs text-gray-500 font-normal">(Minimaal 1 contactpersoon)</span>
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Primair contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Naam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol/Functie
                  </label>
                  <input
                    type="text"
                    value={formData.contact_role}
                    onChange={(e) => setFormData({ ...formData, contact_role: e.target.value })}
                    placeholder="Bijv: Eigenaar, Manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefoon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Secundair contact (optioneel)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Naam
                  </label>
                  <input
                    type="text"
                    value={formData.secondary_contact_name}
                    onChange={(e) => setFormData({ ...formData, secondary_contact_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefoon
                  </label>
                  <input
                    type="tel"
                    value={formData.secondary_contact_phone}
                    onChange={(e) => setFormData({ ...formData, secondary_contact_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.secondary_contact_email}
                    onChange={(e) => setFormData({ ...formData, secondary_contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sectie 5: Financieel */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-yellow-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">5</span>
            Financiële gegevens
            <span className="text-xs text-gray-500 font-normal">{formData.status === 'Klant actief' ? '(Verplicht voor klanten)' : '(Optioneel)'}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IBAN
              </label>
              <input
                type="text"
                value={formData.iban}
                onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                placeholder="NL00 BANK 0000 0000 00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                T.N.V. (tenaamstelling)
              </label>
              <input
                type="text"
                value={formData.account_holder_name}
                onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Betaalconditie
              </label>
              <select
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Selecteer betaalconditie</option>
                <option value="Direct">Direct</option>
                <option value="7 dagen">7 dagen</option>
                <option value="14 dagen">14 dagen</option>
                <option value="30 dagen">30 dagen</option>
                <option value="60 dagen">60 dagen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BTW-nummer
              </label>
              <input
                type="text"
                value={formData.btw_number}
                onChange={(e) => setFormData({ ...formData, btw_number: e.target.value })}
                placeholder="NL000000000B00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Sectie 6: Business */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-indigo-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">6</span>
            Business informatie
            <span className="text-xs text-gray-500 font-normal">(Optioneel)</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assortimentsinteresse
              </label>
              <input
                type="text"
                value={formData.assortment_interests}
                onChange={(e) => setFormData({ ...formData, assortment_interests: e.target.value })}
                placeholder="Bijv: Bieren, Wijnen, Frisdranken"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business opmerkingen
              </label>
              <textarea
                rows={4}
                value={formData.business_notes}
                onChange={(e) => setFormData({ ...formData, business_notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Interne notities, verkoopkansen, speciale afspraken..."
              />
            </div>
          </div>
        </div>

        {/* Status en Algemene Opmerkingen */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status en Opmerkingen</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Lead">Lead</option>
                <option value="In behandeling">In behandeling</option>
                <option value="Offerte">Offerte</option>
                <option value="Formulier gemaild">Formulier gemaild</option>
                <option value="Klant actief">Klant actief</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Algemene opmerkingen
              </label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Algemene notities over dit lead..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 font-medium"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Opslaan...' : (lead ? 'Wijzigingen opslaan' : 'Lead aanmaken')}
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
