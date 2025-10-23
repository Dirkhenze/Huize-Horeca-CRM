import React, { useState } from 'react';
import { Plus, Phone, Calendar, FileText, Mail, CheckCircle, MessageSquare, User, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Tijdlijnactie, TeamMember } from '../../../lib/types';

interface TimelineViewProps {
  leadId: string;
  timeline: Tijdlijnactie[];
  onUpdate: () => void;
  accountManagers: TeamMember[];
}

const ACTIE_TYPES = [
  { value: 'Contact', label: 'Contact', icon: Phone },
  { value: 'Bezoek', label: 'Bezoek', icon: Calendar },
  { value: 'Offerte', label: 'Offerte', icon: FileText },
  { value: 'Formulier', label: 'Formulier', icon: Mail },
  { value: 'Activatie', label: 'Activatie', icon: CheckCircle },
  { value: 'Notitie', label: 'Notitie', icon: MessageSquare }
];

export default function TimelineView({ leadId, timeline, onUpdate, accountManagers }: TimelineViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    actie_type: 'Contact',
    verantwoordelijke_id: '',
    datum: new Date().toISOString().split('T')[0],
    notities: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('tijdlijnacties')
        .insert({
          lead_id: leadId,
          actie_type: formData.actie_type,
          verantwoordelijke_id: formData.verantwoordelijke_id || teamMember?.id || null,
          datum: formData.datum,
          notities: formData.notities
        });

      if (error) throw error;

      setFormData({
        actie_type: 'Contact',
        verantwoordelijke_id: '',
        datum: new Date().toISOString().split('T')[0],
        notities: ''
      });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding timeline action:', error);
      alert('Fout bij toevoegen van tijdlijnactie');
    } finally {
      setSaving(false);
    }
  };

  const getActionIcon = (type: string) => {
    const action = ACTIE_TYPES.find(a => a.value === type);
    if (!action) return Phone;
    return action.icon;
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'Contact':
        return 'bg-blue-100 text-blue-600';
      case 'Bezoek':
        return 'bg-purple-100 text-purple-600';
      case 'Offerte':
        return 'bg-yellow-100 text-yellow-600';
      case 'Formulier':
        return 'bg-indigo-100 text-indigo-600';
      case 'Activatie':
        return 'bg-green-100 text-green-600';
      case 'Notitie':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getVerantwoordelijkeNaam = (id: string | null) => {
    if (!id) return 'Systeem';
    const member = accountManagers.find(m => m.id === id);
    return member ? `${member.first_name} ${member.last_name}` : 'Onbekend';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Tijdlijn</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Annuleren' : 'Actie toevoegen'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type actie
              </label>
              <select
                value={formData.actie_type}
                onChange={(e) => setFormData({ ...formData, actie_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ACTIE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Datum
              </label>
              <input
                type="date"
                value={formData.datum}
                onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verantwoordelijke (optioneel)
              </label>
              <select
                value={formData.verantwoordelijke_id}
                onChange={(e) => setFormData({ ...formData, verantwoordelijke_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Huidige gebruiker</option>
                {accountManagers.map(manager => (
                  <option key={manager.id} value={manager.id}>
                    {manager.first_name} {manager.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notities
              </label>
              <textarea
                rows={3}
                value={formData.notities}
                onChange={(e) => setFormData({ ...formData, notities: e.target.value })}
                placeholder="Beschrijf wat er is gebeurd..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Opslaan...' : 'Opslaan'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Annuleren
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {timeline.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Nog geen tijdlijnacties</p>
            <p className="text-sm mt-1">Voeg de eerste actie toe om het traject te starten</p>
          </div>
        ) : (
          timeline.map((actie, index) => {
            const Icon = getActionIcon(actie.actie_type);
            const isFirst = index === 0;

            return (
              <div key={actie.id} className="relative">
                {!isFirst && (
                  <div className="absolute left-6 top-0 w-0.5 h-4 bg-gray-200 -mt-4" />
                )}

                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getActionColor(actie.actie_type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{actie.actie_type}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(actie.datum).toLocaleDateString('nl-NL', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {getVerantwoordelijkeNaam(actie.verantwoordelijke_id)}
                      </div>
                    </div>

                    {actie.notities && (
                      <p className="text-gray-700 whitespace-pre-wrap">{actie.notities}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
