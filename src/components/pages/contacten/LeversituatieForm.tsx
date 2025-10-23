import React, { useState, useEffect } from 'react';
import { Save, Truck } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Leversituatie } from '../../../lib/types';

interface LeversituatieFormProps {
  leadId: string;
  leversituatie: Leversituatie | null;
  onSave: () => void;
}

const DAGEN = ['Ma', 'Di', 'Wo', 'Do', 'Vr'];
const TIJDEN = ['Ochtend', 'Middag'];

export default function LeversituatieForm({ leadId, leversituatie, onSave }: LeversituatieFormProps) {
  const [formData, setFormData] = useState({
    afleveradres: leversituatie?.afleveradres || '',
    afleverwensen: leversituatie?.afleverwensen || '',
    aanvulling: leversituatie?.aanvulling || '',
    voorkeursdagen: leversituatie?.voorkeursdagen || [],
    tijden: leversituatie?.tijden || [],
    minimale_bestelhoeveelheid: leversituatie?.minimale_bestelhoeveelheid || '',
    chauffeursinstructies: leversituatie?.chauffeursinstructies || '',
    akkoord_voorwaarden: leversituatie?.akkoord_voorwaarden || false,
    handtekening_url: leversituatie?.handtekening_url || ''
  });

  const [saving, setSaving] = useState(false);

  const toggleVoorkeursDag = (dag: string) => {
    const current = formData.voorkeursdagen;
    if (current.includes(dag)) {
      setFormData({ ...formData, voorkeursdagen: current.filter(d => d !== dag) });
    } else {
      setFormData({ ...formData, voorkeursdagen: [...current, dag] });
    }
  };

  const toggleTijd = (tijd: string) => {
    const current = formData.tijden;
    if (current.includes(tijd)) {
      setFormData({ ...formData, tijden: current.filter(t => t !== tijd) });
    } else {
      setFormData({ ...formData, tijden: [...current, tijd] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (leversituatie) {
        const { error } = await supabase
          .from('leversituaties')
          .update(formData)
          .eq('id', leversituatie.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('leversituaties')
          .insert({ ...formData, lead_id: leadId });
        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving leversituatie:', error);
      alert('Fout bij opslaan van leversituatie');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          Leverinformatie
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Afleveradres
            </label>
            <textarea
              rows={3}
              value={formData.afleveradres}
              onChange={(e) => setFormData({ ...formData, afleveradres: e.target.value })}
              placeholder="Volledig afleveradres inclusief eventuele instructies"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Afleverwensen
            </label>
            <textarea
              rows={2}
              value={formData.afleverwensen}
              onChange={(e) => setFormData({ ...formData, afleverwensen: e.target.value })}
              placeholder="Speciale wensen voor aflevering"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aanvulling
            </label>
            <textarea
              rows={2}
              value={formData.aanvulling}
              onChange={(e) => setFormData({ ...formData, aanvulling: e.target.value })}
              placeholder="Extra informatie"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voorkeursdagen
            </label>
            <div className="flex gap-2">
              {DAGEN.map(dag => (
                <button
                  key={dag}
                  type="button"
                  onClick={() => toggleVoorkeursDag(dag)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    formData.voorkeursdagen.includes(dag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voorkeurstijden
            </label>
            <div className="flex gap-2">
              {TIJDEN.map(tijd => (
                <button
                  key={tijd}
                  type="button"
                  onClick={() => toggleTijd(tijd)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    formData.tijden.includes(tijd)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tijd}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimale bestelhoeveelheid
            </label>
            <input
              type="text"
              value={formData.minimale_bestelhoeveelheid}
              onChange={(e) => setFormData({ ...formData, minimale_bestelhoeveelheid: e.target.value })}
              placeholder="Bijv: 1 pallet, €500,-"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chauffeursinstructies
            </label>
            <textarea
              rows={3}
              value={formData.chauffeursinstructies}
              onChange={(e) => setFormData({ ...formData, chauffeursinstructies: e.target.value })}
              placeholder="Instructies voor de chauffeur (bijv. toegangscodes, parkeerinstructies)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.akkoord_voorwaarden}
                onChange={(e) => setFormData({ ...formData, akkoord_voorwaarden: e.target.checked })}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                <span className="font-medium">Akkoord met levervoorwaarden</span>
                <span className="block text-gray-500 mt-1">
                  De klant gaat akkoord met de standaard levervoorwaarden
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Opslaan...' : 'Opslaan'}
        </button>
      </div>
    </form>
  );
}
