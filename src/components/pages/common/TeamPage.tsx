import { useState, useEffect } from 'react';
import { Search, Plus, UserPlus, Mail, Phone } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { NavCategory } from '../../../lib/types';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  employee_number: string;
  is_active: boolean;
}

interface TeamPageProps {
  category: NavCategory;
}

export function TeamPage({ category }: TeamPageProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const getRoleFilter = () => {
    switch (category) {
      case 'sales':
        return 'sales';
      case 'inkoop':
        return 'inkoop';
      case 'logistiek':
        return 'logistiek';
      case 'magazijn':
        return 'magazijn';
      default:
        return '';
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, [category]);

  useEffect(() => {
    if (search) {
      const filtered = members.filter(
        (m) =>
          m.first_name.toLowerCase().includes(search.toLowerCase()) ||
          m.last_name.toLowerCase().includes(search.toLowerCase()) ||
          m.email?.toLowerCase().includes(search.toLowerCase()) ||
          m.department?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [search, members]);

  const loadTeamMembers = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user');
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .maybeSingle();

      const companyId = userData?.company_id || '00000000-0000-0000-0000-000000000001';

      const roleFilter = getRoleFilter();
      let query = supabase
        .from('sales_team')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('first_name');

      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMembers(data || []);
      setFilteredMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team</h1>
        </div>
        <button className="huize-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:huize-hover transition-colors">
          <Plus className="w-5 h-5" />
          Nieuw teamlid
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek team..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Naam
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Telefoon
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Laden...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Geen gegevens gevonden
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-700 font-semibold text-sm">
                            {member.first_name[0]}
                            {member.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {member.first_name} {member.last_name}
                          </p>
                          {member.employee_number && (
                            <p className="text-xs text-slate-500">
                              {member.employee_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                        {member.department || member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{member.email}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {member.phone ? (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{member.phone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          member.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {member.is_active ? 'Actief' : 'Inactief'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
