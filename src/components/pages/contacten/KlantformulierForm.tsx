import React, { useState, useEffect } from 'react';
import { Save, Mail, Plus, Trash2, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Klantformulier, ContactPersoon, Lead } from '../../../lib/types';

interface KlantformulierFormProps {
  leadId: string;
  lead: Lead;
  klantformulier: Klantformulier | null;
  onSave: () => void;
}

export default function KlantformulierForm({ leadId, lead, klantformulier, onSave }: KlantformulierFormProps) {
  const [formData, setFormData] = useState({
    juridische_naam: klantformulier?.juridische_naam || lead.bedrijfsnaam || '',
    handelsnaam: klantformulier?.handelsnaam || '',
    btw_nummer: klantformulier?.btw_nummer || '',
    kvk_nummer: klantformulier?.kvk_nummer || '',
    factuur_email: klantformulier?.factuur_email || lead.email_factuur || '',
    betaalconditie: klantformulier?.betaalconditie || '30 dagen',
    bezorgadres: klantformulier?.bezorgadres || `${lead.straat_huisnummer}\n${lead.postcode} ${lead.plaats}` || '',
    contactpersonen: klantformulier?.contactpersonen || [],
    opmerkingen_admin: klantformulier?.opmerkingen_admin || '',
    datum_ingevuld: klantformulier?.datum_ingevuld || new Date().toISOString().split('T')[0],
    klaar_om_te_mailen: klantformulier?.klaar_om_te_mailen || false,
    uniconta_klantnummer: klantformulier?.uniconta_klantnummer || '',
    verzendstatus: klantformulier?.verzendstatus || 'Concept'
  });

  const [saving, setSaving] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const addContactPersoon = () => {
    setFormData({
      ...formData,
      contactpersonen: [...formData.contactpersonen, { naam: '', functie: '', telefoon: '', email: '' }]
    });
  };

  const updateContactPersoon = (index: number, field: keyof ContactPersoon, value: string) => {
    const updated = [...formData.contactpersonen];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, contactpersonen: updated });
  };

  const removeContactPersoon = (index: number) => {
    setFormData({
      ...formData,
      contactpersonen: formData.contactpersonen.filter((_, i) => i !== index)
    });
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.juridische_naam) errors.push('Juridische naam is verplicht');
    if (!formData.factuur_email) errors.push('Factuur email is verplicht');
    if (!lead.iban) errors.push('IBAN is verplicht (vul in bij lead gegevens)');
    if (!formData.bezorgadres) errors.push('Bezorgadres is verplicht');
    if (!lead.contactpersoon) errors.push('Contactpersoon is verplicht (vul in bij lead gegevens)');

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        lead_id: leadId,
        klaar_om_te_mailen: validateForm()
      };

      if (klantformulier) {
        const { error } = await supabase
          .from('klantformulieren')
          .update(dataToSave)
          .eq('id', klantformulier.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('klantformulieren')
          .insert(dataToSave);
        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving klantformulier:', error);
      alert('Fout bij opslaan van klantformulier');
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = async () => {
    if (!validateForm()) {
      alert('Vul eerst alle verplichte velden in');
      return;
    }

    if (!confirm('Weet je zeker dat je het klantformulier wilt versturen naar info@huizehoreca.nl?')) {
      return;
    }

    setSendingEmail(true);

    try {
      const emailData = {
        lead_id: leadId,
        juridische_naam: formData.juridische_naam,
        handelsnaam: formData.handelsnaam,
        btw_nummer: formData.btw_nummer,
        kvk_nummer: formData.kvk_nummer,
        factuur_email: formData.factuur_email,
        betaalconditie: formData.betaalconditie,
        bezorgadres: formData.bezorgadres,
        iban: lead.iban,
        contactpersoon: lead.contactpersoon,
        contactpersonen: formData.contactpersonen,
        opmerkingen_admin: formData.opmerkingen_admin,
        bedrijfsnaam: lead.bedrijfsnaam,
        plaats: lead.plaats
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-klantformulier`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const { error: updateError } = await supabase
        .from('klantformulieren')
        .update({
          verzendstatus: 'Verzonden',
          datum_verzonden: new Date().toISOString().split('T')[0]
        })
        .eq('lead_id', leadId);

      if (updateError) throw updateError;

      const { error: leadUpdateError } = await supabase
        .from('leads')
        .update({ status: 'Formulier gemaild' })
        .eq('id', leadId);

      if (leadUpdateError) throw leadUpdateError;

      const { error: timelineError } = await supabase
        .from('tijdlijnacties')
        .insert({
          lead_id: leadId,
          actie_type: 'Formulier',
          datum: new Date().toISOString().split('T')[0],
          notities: 'Klantformulier verstuurd naar administratie'
        });

      if (timelineError) throw timelineError;

      alert('Klantformulier succesvol verstuurd!');
      onSave();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Fout bij versturen van email');

      await supabase
        .from('klantformulieren')
        .update({ verzendstatus: 'Mislukt' })
        .eq('lead_id', leadId);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900">Ontbrekende gegevens</p>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                {validationErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {formData.verzendstatus === 'Verzonden' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Formulier verstuurd</p>
              <p className="text-sm text-green-700 mt-1">
                Het klantformulier is succesvol verstuurd naar info@huizehoreca.nl
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Bedrijfsgegevens
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Juridische naam <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.juridische_naam}
              onChange={(e) => setFormData({ ...formData, juridische_naam: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Handelsnaam
            </label>
            <input
              type="text"
              value={formData.handelsnaam}
              onChange={(e) => setFormData({ ...formData, handelsnaam: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BTW nummer
              </label>
              <input
                type="text"
                value={formData.btw_nummer}
                onChange={(e) => setFormData({ ...formData, btw_nummer: e.target.value })}
                placeholder="NL123456789B01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KvK nummer
              </label>
              <input
                type="text"
                value={formData.kvk_nummer}
                onChange={(e) => setFormData({ ...formData, kvk_nummer: e.target.value })}
                placeholder="12345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Factuurgegevens</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Factuur email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.factuur_email}
              onChange={(e) => setFormData({ ...formData, factuur_email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Betaalconditie
            </label>
            <select
              value={formData.betaalconditie}
              onChange={(e) => setFormData({ ...formData, betaalconditie: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="14 dagen">14 dagen</option>
              <option value="30 dagen">30 dagen</option>
              <option value="45 dagen">45 dagen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bezorgadres
            </label>
            <textarea
              rows={3}
              value={formData.bezorgadres}
              onChange={(e) => setFormData({ ...formData, bezorgadres: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Contactpersonen</h3>
          <button
            type="button"
            onClick={addContactPersoon}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Toevoegen
          </button>
        </div>

        <div className="space-y-3">
          {formData.contactpersonen.map((persoon, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-900">Contactpersoon {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeContactPersoon(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Naam"
                  value={persoon.naam}
                  onChange={(e) => updateContactPersoon(index, 'naam', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Functie"
                  value={persoon.functie}
                  onChange={(e) => updateContactPersoon(index, 'functie', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Telefoon"
                  value={persoon.telefoon}
                  onChange={(e) => updateContactPersoon(index, 'telefoon', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={persoon.email}
                  onChange={(e) => updateContactPersoon(index, 'email', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opmerkingen voor administratie
        </label>
        <textarea
          rows={3}
          value={formData.opmerkingen_admin}
          onChange={(e) => setFormData({ ...formData, opmerkingen_admin: e.target.value })}
          placeholder="Extra informatie voor de administratie"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {formData.uniconta_klantnummer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">
            Uniconta klantnummer: <span className="font-bold">{formData.uniconta_klantnummer}</span>
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Opslaan...' : 'Opslaan'}
        </button>

        {formData.verzendstatus !== 'Verzonden' && (
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={sendingEmail || !validateForm()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-4 h-4" />
            {sendingEmail ? 'Verzenden...' : 'Formulier mailen'}
          </button>
        )}
      </div>
    </form>
  );
}
