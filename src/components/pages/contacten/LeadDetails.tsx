import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Mail, Phone, MapPin, Building2, Calendar, FileText, Plus, User, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Lead, TeamMember, Tijdlijnactie, Leversituatie, Klantformulier } from '../../../lib/types';
import LeadForm from './LeadForm';
import LeversituatieForm from './LeversituatieForm';
import KlantformulierForm from './KlantformulierForm';
import TimelineView from './TimelineView';

interface LeadDetailsProps {
  lead: Lead;
  onBack: () => void;
  accountManagers: TeamMember[];
}

type TabType = 'overview' | 'leversituatie' | 'klantformulier' | 'timeline';

export default function LeadDetails({ lead: initialLead, onBack, accountManagers }: LeadDetailsProps) {
  const [lead, setLead] = useState(initialLead);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [editing, setEditing] = useState(false);
  const [timeline, setTimeline] = useState<Tijdlijnactie[]>([]);
  const [leversituatie, setLeversituatie] = useState<Leversituatie | null>(null);
  const [klantformulier, setKlantformulier] = useState<Klantformulier | null>(null);

  useEffect(() => {
    loadLeadData();
    loadTimeline();
    loadLeversituatie();
    loadKlantformulier();
  }, [lead.id]);

  const loadLeadData = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead.id)
      .single();
    if (data) setLead(data);
  };

  const loadTimeline = async () => {
    const { data } = await supabase
      .from('tijdlijnacties')
      .select('*')
      .eq('lead_id', lead.id)
      .order('datum', { ascending: false });
    if (data) setTimeline(data);
  };

  const loadLeversituatie = async () => {
    const { data } = await supabase
      .from('leversituaties')
      .select('*')
      .eq('lead_id', lead.id)
      .maybeSingle();
    setLeversituatie(data);
  };

  const loadKlantformulier = async () => {
    const { data } = await supabase
      .from('klantformulieren')
      .select('*')
      .eq('lead_id', lead.id)
      .maybeSingle();
    setKlantformulier(data);
  };

  const getAccountManagerName = (managerId: string | null) => {
    if (!managerId) return '-';
    const manager = accountManagers.find(m => m.id === managerId);
    return manager ? `${manager.first_name} ${manager.last_name}` : '-';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lead':
        return 'bg-gray-100 text-gray-700';
      case 'In behandeling':
        return 'bg-blue-100 text-blue-700';
      case 'Offerte':
        return 'bg-yellow-100 text-yellow-700';
      case 'Formulier gemaild':
        return 'bg-indigo-100 text-indigo-700';
      case 'Klant actief':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (editing) {
    return (
      <LeadForm
        lead={lead}
        accountManagers={accountManagers}
        onSave={() => {
          setEditing(false);
          loadLeadData();
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.bedrijfsnaam}</h1>
            <p className="text-gray-600 mt-1">Lead details en workflow status</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
            {lead.status}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Bewerken
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Overzicht
              </div>
            </button>
            <button
              onClick={() => setActiveTab('leversituatie')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'leversituatie'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Leversituatie
              </div>
            </button>
            <button
              onClick={() => setActiveTab('klantformulier')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'klantformulier'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Klantformulier
              </div>
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tijdlijn
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactgegevens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lead.contactpersoon && (
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Contactpersoon</p>
                        <p className="text-gray-900">{lead.contactpersoon}</p>
                      </div>
                    </div>
                  )}
                  {lead.email_algemeen && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a href={`mailto:${lead.email_algemeen}`} className="text-blue-600 hover:underline">
                          {lead.email_algemeen}
                        </a>
                      </div>
                    </div>
                  )}
                  {lead.telefoonnummer && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Telefoon</p>
                        <a href={`tel:${lead.telefoonnummer}`} className="text-blue-600 hover:underline">
                          {lead.telefoonnummer}
                        </a>
                      </div>
                    </div>
                  )}
                  {lead.mobiel && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Mobiel</p>
                        <a href={`tel:${lead.mobiel}`} className="text-blue-600 hover:underline">
                          {lead.mobiel}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresgegevens</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{lead.straat_huisnummer}</p>
                    <p className="text-gray-900">{lead.postcode} {lead.plaats}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow informatie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Accountmanager</p>
                    <p className="text-gray-900">{getAccountManagerName(lead.accountmanager_id)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Herkomst</p>
                    <p className="text-gray-900">{lead.herkomst || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Klanttype</p>
                    <p className="text-gray-900">{lead.klanttype || '-'}</p>
                  </div>
                  {lead.datum_eerste_contact && (
                    <div>
                      <p className="text-sm text-gray-500">Eerste contact</p>
                      <p className="text-gray-900">{new Date(lead.datum_eerste_contact).toLocaleDateString('nl-NL')}</p>
                    </div>
                  )}
                  {lead.datum_bezoek && (
                    <div>
                      <p className="text-sm text-gray-500">Bezoek gepland</p>
                      <p className="text-gray-900">{new Date(lead.datum_bezoek).toLocaleDateString('nl-NL')}</p>
                    </div>
                  )}
                  {lead.datum_offerte_verstuurd && (
                    <div>
                      <p className="text-sm text-gray-500">Offerte verstuurd</p>
                      <p className="text-gray-900">{new Date(lead.datum_offerte_verstuurd).toLocaleDateString('nl-NL')}</p>
                    </div>
                  )}
                </div>
              </div>

              {lead.volgende_actie && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Volgende actie</p>
                      <p className="text-blue-700 mt-1">{lead.volgende_actie}</p>
                      {lead.datum_volgende_actie && (
                        <p className="text-sm text-blue-600 mt-1">
                          Gepland: {new Date(lead.datum_volgende_actie).toLocaleDateString('nl-NL')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {lead.opmerkingen && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Opmerkingen</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{lead.opmerkingen}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'leversituatie' && (
            <LeversituatieForm
              leadId={lead.id}
              leversituatie={leversituatie}
              onSave={() => {
                loadLeversituatie();
              }}
            />
          )}

          {activeTab === 'klantformulier' && (
            <KlantformulierForm
              leadId={lead.id}
              lead={lead}
              klantformulier={klantformulier}
              onSave={() => {
                loadKlantformulier();
                loadLeadData();
              }}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView
              leadId={lead.id}
              timeline={timeline}
              onUpdate={() => loadTimeline()}
              accountManagers={accountManagers}
            />
          )}
        </div>
      </div>
    </div>
  );
}
