import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Mail, Phone, Calendar, Building2, User, MapPin, FileText, CheckCircle, Clock, AlertCircle, Info } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Lead, TeamMember } from '../../../lib/types';
import LeadForm from './LeadForm';
import LeadDetails from './LeadDetails';
import { fallbackAccountManagers } from '../../../data/fallbackAccountManagers';

const KLANTTYPE_CATEGORIES = [
  { value: 'brouwerijen', label: 'Brouwerijen — brouwerijen en bierproducenten' },
  { value: 'cafes', label: 'Cafés — bruine cafés, nacht- en feestcafés' },
  { value: 'restaurants', label: 'Restaurants — alle typen restaurants' },
  { value: 'hotels', label: 'Hotels & Herbergen — hotels en pensions' },
  { value: 'retail', label: 'Detailhandel & Retail — slijterijen, supermarkten' },
  { value: 'evenementen', label: 'Evenementen & Festivals — festivals, cateraars' },
  { value: 'sport', label: 'Sportverenigingen & Clubs' },
  { value: 'zorg', label: 'Zorglocaties' },
  { value: 'overig', label: 'Overig' }
];

export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [accountManagers, setAccountManagers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showKlanttypeModal, setShowKlanttypeModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
    loadAccountManagers();
  }, []);

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAccountManagers = async () => {
    try {
      console.log('🔍 [LeadManagement] Starting to load account managers...');

      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('role', 'sales')
        .eq('is_active', true)
        .order('first_name');

      console.log('📊 [LeadManagement] Query result:', { data, error, count: data?.length });

      if (error) {
        console.error('❌ [LeadManagement] Supabase error, using fallback data:', error);
        setAccountManagers(fallbackAccountManagers);
        setErrorMessage(null);
        console.log('✅ [LeadManagement] Using fallback:', fallbackAccountManagers.length, 'account managers');
        return;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ [LeadManagement] No account managers in DB, using fallback data');
        setAccountManagers(fallbackAccountManagers);
        setErrorMessage(null);
        console.log('✅ [LeadManagement] Using fallback:', fallbackAccountManagers.length, 'account managers');
        return;
      }

      setAccountManagers(data);
      setErrorMessage(null);
      console.log('✅ [LeadManagement] Successfully loaded', data.length, 'account managers from DB');
    } catch (error: any) {
      console.error('❌ [LeadManagement] Critical error, using fallback:', error);
      setAccountManagers(fallbackAccountManagers);
      setErrorMessage(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Lead':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'In behandeling':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'Offerte':
        return <FileText className="w-4 h-4 text-yellow-500" />;
      case 'Formulier gemaild':
        return <Mail className="w-4 h-4 text-indigo-500" />;
      case 'Klant actief':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
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

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.bedrijfsnaam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactpersoon?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.plaats?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getAccountManagerName = (managerId: string | null) => {
    if (!managerId) return '-';
    const manager = accountManagers.find(m => m.id === managerId);
    return manager ? `${manager.first_name} ${manager.last_name}` : '-';
  };

  if (selectedLead) {
    return (
      <LeadDetails
        lead={selectedLead}
        onBack={() => {
          setSelectedLead(null);
          loadLeads();
        }}
        accountManagers={accountManagers}
      />
    );
  }

  if (showForm) {
    return (
      <LeadForm
        lead={null}
        accountManagers={accountManagers}
        onSave={() => {
          setShowForm(false);
          loadLeads();
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">Volg het traject van lead naar actieve klant</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Lead
        </button>
      </div>

      {errorMessage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900">Debug Info</h3>
              <p className="text-sm text-yellow-700 mt-1">{errorMessage}</p>
              <p className="text-sm text-yellow-600 mt-2">
                Accountmanagers gevonden: {accountManagers.length}
              </p>
              {accountManagers.length > 0 && (
                <p className="text-xs text-yellow-600 mt-1">
                  {accountManagers.map(m => `${m.first_name} ${m.last_name}`).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {accountManagers.length === 0 && !errorMessage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Accountmanagers laden...</h3>
              <p className="text-sm text-blue-700 mt-1">
                Check de browser console (F12) voor debug informatie
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op bedrijfsnaam, contactpersoon of plaats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Alle statussen</option>
              <option value="Lead">Lead</option>
              <option value="In behandeling">In behandeling</option>
              <option value="Offerte">Offerte</option>
              <option value="Formulier gemaild">Formulier gemaild</option>
              <option value="Klant actief">Klant actief</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Leads laden...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Geen leads gevonden
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{lead.bedrijfsnaam}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {getStatusIcon(lead.status)}
                        {lead.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      {lead.contactpersoon && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          {lead.contactpersoon}
                        </div>
                      )}
                      {lead.email_algemeen && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {lead.email_algemeen}
                        </div>
                      )}
                      {lead.telefoonnummer && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {lead.telefoonnummer}
                        </div>
                      )}
                      {lead.plaats && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {lead.plaats}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{getAccountManagerName(lead.accountmanager_id)}</span>
                      </div>
                      {lead.datum_volgende_actie && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Volgende actie: {new Date(lead.datum_volgende_actie).toLocaleDateString('nl-NL')}
                        </div>
                      )}
                      {lead.klanttype && (
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {lead.klanttype}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showKlanttypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Klanttype Categorieën</h3>
                <button
                  onClick={() => setShowKlanttypeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {KLANTTYPE_CATEGORIES.map((category) => (
                <div key={category.value} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <p className="text-gray-900">{category.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
