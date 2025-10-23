import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Mail, Phone, Edit, Trash2, LayoutList, LayoutGrid } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { SalesTeamMember } from '../../../lib/types';
import { useAuth } from '../../../contexts/AuthContext';

type ViewMode = 'list' | 'kanban';

export default function SalesTeamPage() {
  const { user } = useAuth();
  const [salesTeam, setSalesTeam] = useState<SalesTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<SalesTeamMember | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (user) {
      loadSalesTeam();
    }
  }, [user]);

  const loadSalesTeam = async () => {
    try {
      setLoading(true);

      const companyId = '00000000-0000-0000-0000-000000000001';
      console.log('[SalesTeamPage] Company ID:', companyId);

      // First, let's check what's in the table WITHOUT filters
      const { data: allData, error: allError } = await supabase
        .from('sales_team')
        .select('*');

      console.log('[SalesTeamPage] ALL sales_team data (no filter):', allData?.length, 'members');
      console.log('[SalesTeamPage] Sample data:', allData?.slice(0, 2));

      // Now try with the company_id filter
      const { data, error } = await supabase
        .from('sales_team')
        .select('*')
        .eq('company_id', companyId)
        .order('employee_number');

      if (error) {
        console.error('[SalesTeamPage] Error loading sales team:', error);
        throw error;
      }

      console.log('[SalesTeamPage] Loaded sales team (filtered):', data?.length, 'members');
      console.log('[SalesTeamPage] Filtered data:', data);
      setSalesTeam(data || []);
    } catch (error) {
      console.error('[SalesTeamPage] Exception:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeam = salesTeam.filter(member => {
    const matchesSearch =
      member.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.includes(searchQuery);

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && member.is_active) ||
      (filterStatus === 'inactive' && !member.is_active);

    return matchesSearch && matchesFilter;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleEdit = (member: SalesTeamMember) => {
    setEditingMember(member);
    setShowEditForm(true);
  };

  const handleDelete = async (member: SalesTeamMember) => {
    if (!confirm(`Weet je zeker dat je ${member.first_name} ${member.last_name} wilt verwijderen?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('sales_team')
        .delete()
        .eq('id', member.id);

      if (error) throw error;

      await loadSalesTeam();
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Fout bij verwijderen van teamlid');
    }
  };

  const handleSaveEdit = async (updatedMember: Partial<SalesTeamMember>) => {
    if (!editingMember) return;

    try {
      const { error } = await supabase
        .from('sales_team')
        .update(updatedMember)
        .eq('id', editingMember.id);

      if (error) throw error;

      setShowEditForm(false);
      setEditingMember(null);
      await loadSalesTeam();
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Fout bij updaten van teamlid');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Team</h1>
          <p className="text-gray-600 mt-1">Beheer je interne accountmanagers</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuwe teamlid
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op naam, email of telefoon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Alle statussen</option>
              <option value="active">Actief</option>
              <option value="inactive">Inactief</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 flex items-center gap-2 transition-colors ${
                  viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutList className="w-5 h-5" />
                <span className="hidden md:inline">Lijst</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 flex items-center gap-2 border-l border-gray-300 transition-colors ${
                  viewMode === 'kanban' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="hidden md:inline">Kanban</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Laden...</div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Foto</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Naam</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Telefoon</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Functie</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Team</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeam.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {getInitials(member.first_name, member.last_name)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {member.first_name} {member.last_name}
                      </div>
                      {member.employee_number && (
                        <div className="text-sm text-gray-500">{member.employee_number}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <a href={`mailto:${member.email}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      {member.phone && (
                        <a href={`tel:${member.phone}`} className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {member.phone}
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{member.function_title || member.role || '-'}</td>
                    <td className="py-3 px-4 text-gray-700">{member.team_name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.is_active ? 'Actief' : 'Inactief'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Bewerken"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTeam.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Geen teamleden gevonden
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeam.map((member) => (
              <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {getInitials(member.first_name, member.last_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {member.first_name} {member.last_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{member.function_title || member.role}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </a>
                  {member.phone && (
                    <a href={`tel:${member.phone}`} className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      {member.phone}
                    </a>
                  )}
                </div>

                {member.team_name && (
                  <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">
                    Team: {member.team_name}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    member.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.is_active ? 'Actief' : 'Inactief'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Bewerken"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Verwijderen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTeam.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                Geen teamleden gevonden
              </div>
            )}
          </div>
        )}
      </div>

      {showEditForm && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Teamlid bewerken</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSaveEdit({
                first_name: formData.get('first_name') as string,
                last_name: formData.get('last_name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string || null,
                function_title: formData.get('function_title') as string,
                team_name: formData.get('team_name') as string,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voornaam</label>
                  <input
                    type="text"
                    name="first_name"
                    defaultValue={editingMember.first_name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achternaam</label>
                  <input
                    type="text"
                    name="last_name"
                    defaultValue={editingMember.last_name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingMember.email}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefoon</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingMember.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Functie</label>
                  <input
                    type="text"
                    name="function_title"
                    defaultValue={editingMember.function_title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <input
                    type="text"
                    name="team_name"
                    defaultValue={editingMember.team_name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingMember(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
