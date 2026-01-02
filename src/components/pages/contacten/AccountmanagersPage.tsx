import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, User, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { TeamMember } from '../../../lib/types';
import { fallbackAccountManagers } from '../../../data/fallbackAccountManagers';

export function AccountmanagersPage() {
  const [accountManagers, setAccountManagers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingManager, setEditingManager] = useState<TeamMember | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    loadAccountManagers();
  }, []);

  const loadAccountManagers = async () => {
    try {
      console.log('🔍 [AccountmanagersPage] Loading account managers from sales_team...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ [AccountmanagersPage] No authenticated user');
        setAccountManagers(fallbackAccountManagers);
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .maybeSingle();

      const companyId = userData?.company_id || '00000000-0000-0000-0000-000000000001';

      const { data, error } = await supabase
        .from('sales_team')
        .select('*')
        .eq('company_id', companyId)
        .order('first_name');

      console.log('📊 [AccountmanagersPage] Query result:', {
        data,
        error,
        count: data?.length
      });

      if (error) {
        console.error('❌ [AccountmanagersPage] Supabase error, using fallback data:', error);
        setAccountManagers(fallbackAccountManagers);
        console.log('✅ [AccountmanagersPage] Using fallback:', fallbackAccountManagers.length, 'account managers');
      } else {
        if (data && data.length > 0) {
          setAccountManagers(data);
          console.log('✅ [AccountmanagersPage] Loaded from DB:', data.length, 'account managers');
        } else {
          console.log('⚠️ [AccountmanagersPage] No data from DB, using fallback');
          setAccountManagers(fallbackAccountManagers);
        }
      }
    } catch (error) {
      console.error('❌ [AccountmanagersPage] Critical error, using fallback:', error);
      setAccountManagers(fallbackAccountManagers);
    } finally {
      setLoading(false);
    }
  };

  const filteredManagers = accountManagers.filter(manager => {
    const fullName = `${manager.first_name} ${manager.last_name}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) ||
           manager.email?.toLowerCase().includes(search) ||
           manager.department?.toLowerCase().includes(search);
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleAddManager = async (newManager: Partial<TeamMember>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .maybeSingle();

      const companyId = userData?.company_id || '00000000-0000-0000-0000-000000000001';

      const { error } = await supabase
        .from('sales_team')
        .insert({
          ...newManager,
          company_id: companyId,
          is_active: true,
        });

      if (error) throw error;

      setShowAddForm(false);
      await loadAccountManagers();
    } catch (error) {
      console.error('Error adding account manager:', error);
      alert('Fout bij toevoegen van accountmanager');
    }
  };

  const handleEdit = (manager: TeamMember) => {
    setEditingManager(manager);
    setShowEditForm(true);
  };

  const handleSaveEdit = async (updatedManager: Partial<TeamMember>) => {
    if (!editingManager) return;

    try {
      const { error } = await supabase
        .from('sales_team')
        .update(updatedManager)
        .eq('id', editingManager.id);

      if (error) throw error;

      setShowEditForm(false);
      setEditingManager(null);
      await loadAccountManagers();
    } catch (error) {
      console.error('Error updating account manager:', error);
      alert('Fout bij updaten van accountmanager');
    }
  };

  const handleDelete = async (manager: TeamMember) => {
    if (!confirm(`Weet je zeker dat je ${manager.first_name} ${manager.last_name} wilt verwijderen?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('sales_team')
        .delete()
        .eq('id', manager.id);

      if (error) throw error;

      await loadAccountManagers();
    } catch (error) {
      console.error('Error deleting account manager:', error);
      alert('Fout bij verwijderen van accountmanager');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accountmanagers</h1>
          <p className="text-gray-600 mt-1">Beheer je sales team</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nieuwe accountmanager
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op naam, email of afdeling..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foto
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Naam
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefoon
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Afdeling
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Accountmanagers laden...
                  </td>
                </tr>
              ) : filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Geen accountmanagers gevonden' : 'Geen gegevens gevonden'}
                  </td>
                </tr>
              ) : (
                filteredManagers.map((manager) => (
                  <tr key={manager.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {manager.avatar_url ? (
                        <img
                          src={manager.avatar_url}
                          alt={`${manager.first_name} ${manager.last_name}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm border-2 border-blue-200">
                          {getInitials(manager.first_name, manager.last_name)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {manager.first_name} {manager.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${manager.email}`} className="text-blue-600 hover:underline">
                          {manager.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${manager.phone}`} className="hover:text-blue-600">
                          {manager.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{manager.department || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          manager.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {manager.is_active ? 'Actief' : 'Inactief'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(manager)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Bewerken"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(manager)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredManagers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              {filteredManagers.length} accountmanager{filteredManagers.length !== 1 ? 's' : ''} gevonden
            </p>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nieuwe accountmanager toevoegen</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddManager({
                first_name: formData.get('first_name') as string,
                last_name: formData.get('last_name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string || null,
                function_title: formData.get('function_title') as string,
                team_name: formData.get('team_name') as string,
                department: formData.get('department') as string,
                employee_number: formData.get('employee_number') as string || null,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voornaam *</label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achternaam *</label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medewerkernummer</label>
                  <input
                    type="text"
                    name="employee_number"
                    placeholder="bijv. AM-004"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Functie</label>
                  <input
                    type="text"
                    name="function_title"
                    placeholder="bijv. Account Manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <input
                    type="text"
                    name="team_name"
                    placeholder="bijv. Sales"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Afdeling</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="bijv. Verkoop"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Toevoegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editingManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Accountmanager bewerken</h2>
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
                department: formData.get('department') as string,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voornaam</label>
                  <input
                    type="text"
                    name="first_name"
                    defaultValue={editingManager.first_name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achternaam</label>
                  <input
                    type="text"
                    name="last_name"
                    defaultValue={editingManager.last_name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingManager.email}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefoon</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingManager.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Functie</label>
                  <input
                    type="text"
                    name="function_title"
                    defaultValue={editingManager.function_title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <input
                    type="text"
                    name="team_name"
                    defaultValue={editingManager.team_name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Afdeling</label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={editingManager.department || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingManager(null);
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
