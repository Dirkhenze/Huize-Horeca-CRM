import React, { useState, useEffect } from 'react';
import { UserPlus, Plus, Search, Mail, Phone, Edit, Trash2, LayoutList, LayoutGrid, Building2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { SupplierAccountManager, SupplierAMAssignment, Supplier } from '../../../lib/types';

type ViewMode = 'list' | 'kanban';

interface AMWithAssignments extends SupplierAccountManager {
  assignments?: SupplierAMAssignment[];
  suppliers?: Supplier[];
}

export default function SupplierAccountManagersPage() {
  const [accountManagers, setAccountManagers] = useState<AMWithAssignments[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterSupplier, setFilterSupplier] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [amsResponse, suppliersResponse] = await Promise.all([
        supabase
          .from('supplier_account_managers')
          .select(`
            *,
            assignments:supplier_am_assignments(
              *,
              supplier:suppliers(*)
            )
          `)
          .order('first_name'),
        supabase
          .from('suppliers')
          .select('*')
          .order('name')
      ]);

      if (amsResponse.error) throw amsResponse.error;
      if (suppliersResponse.error) throw suppliersResponse.error;

      const amsWithSuppliers = (amsResponse.data || []).map((am: any) => ({
        ...am,
        suppliers: am.assignments?.map((a: any) => a.supplier).filter(Boolean) || []
      }));

      setAccountManagers(amsWithSuppliers);
      setSuppliers(suppliersResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAMs = accountManagers.filter(am => {
    const matchesSearch =
      am.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      am.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      am.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      am.phone?.includes(searchQuery);

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && am.is_active) ||
      (filterStatus === 'inactive' && !am.is_active);

    const matchesSupplier =
      filterSupplier === 'all' ||
      am.suppliers?.some(s => s.id === filterSupplier);

    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accountmanagers (Leveranciers)</h1>
          <p className="text-gray-600 mt-1">Beheer externe accountmanagers van leveranciers</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuwe accountmanager
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

            <select
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Alle leveranciers</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mobiel</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Functie</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Leverancier(s)</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredAMs.map((am) => (
                  <tr key={am.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                        {getInitials(am.first_name, am.last_name)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {am.first_name} {am.last_name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <a href={`mailto:${am.email}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {am.email}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      {am.phone && (
                        <a href={`tel:${am.phone}`} className="text-gray-700 hover:text-gray-900">
                          {am.phone}
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {am.mobile && (
                        <a href={`tel:${am.mobile}`} className="text-gray-700 hover:text-gray-900">
                          {am.mobile}
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{am.function_title || '-'}</td>
                    <td className="py-3 px-4">
                      {am.suppliers && am.suppliers.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {am.suppliers.slice(0, 2).map(supplier => (
                            <span key={supplier.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {supplier.name}
                            </span>
                          ))}
                          {am.suppliers.length > 2 && (
                            <span className="text-xs text-gray-500">+{am.suppliers.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Geen leverancier</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        am.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {am.is_active ? 'Actief' : 'Inactief'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAMs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Geen accountmanagers gevonden
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAMs.map((am) => (
              <div key={am.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                    {getInitials(am.first_name, am.last_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {am.first_name} {am.last_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{am.function_title || 'Accountmanager'}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <a href={`mailto:${am.email}`} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{am.email}</span>
                  </a>
                  {am.phone && (
                    <a href={`tel:${am.phone}`} className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      {am.phone}
                    </a>
                  )}
                </div>

                {am.suppliers && am.suppliers.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Building2 className="w-3 h-3" />
                      Leveranciers
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {am.suppliers.map(supplier => (
                        <span key={supplier.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {supplier.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    am.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {am.is_active ? 'Actief' : 'Inactief'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredAMs.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                Geen accountmanagers gevonden
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
