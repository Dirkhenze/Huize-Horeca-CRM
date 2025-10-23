import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserPlus, Star, X, Mail, Phone, Building2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Supplier, SupplierAccountManager, SupplierAMAssignment } from '../../../lib/types';

interface SupplierWithAMs extends Supplier {
  assignments?: (SupplierAMAssignment & { account_manager: SupplierAccountManager })[];
}

export function LeveranciersEnhanced() {
  const [suppliers, setSuppliers] = useState<SupplierWithAMs[]>([]);
  const [allAccountManagers, setAllAccountManagers] = useState<SupplierAccountManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierWithAMs | null>(null);
  const [showAMModal, setShowAMModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [suppliersResponse, amsResponse] = await Promise.all([
        supabase
          .from('suppliers')
          .select(`
            *,
            assignments:supplier_am_assignments(
              *,
              account_manager:supplier_account_managers(*)
            )
          `)
          .order('name'),
        supabase
          .from('supplier_account_managers')
          .select('*')
          .eq('is_active', true)
          .order('first_name')
      ]);

      if (suppliersResponse.error) throw suppliersResponse.error;
      if (amsResponse.error) throw amsResponse.error;

      setSuppliers(suppliersResponse.data || []);
      setAllAccountManagers(amsResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAM = async (supplierId: string, amId: string) => {
    try {
      const { error } = await supabase
        .from('supplier_am_assignments')
        .insert({
          supplier_id: supplierId,
          account_manager_id: amId,
          is_primary: false
        });

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error adding AM:', error);
      alert('Error: Deze accountmanager is mogelijk al toegewezen aan deze leverancier');
    }
  };

  const handleRemoveAM = async (assignmentId: string) => {
    if (!confirm('Weet je zeker dat je deze accountmanager wilt verwijderen?')) return;

    try {
      const { error } = await supabase
        .from('supplier_am_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error removing AM:', error);
      alert('Error bij verwijderen');
    }
  };

  const handleSetPrimary = async (supplierId: string, assignmentId: string) => {
    try {
      await supabase
        .from('supplier_am_assignments')
        .update({ is_primary: false })
        .eq('supplier_id', supplierId);

      const { error } = await supabase
        .from('supplier_am_assignments')
        .update({ is_primary: true })
        .eq('id', assignmentId);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error setting primary:', error);
      alert('Error bij instellen primaire contactpersoon');
    }
  };

  const getPrimaryAM = (supplier: SupplierWithAMs) => {
    return supplier.assignments?.find(a => a.is_primary)?.account_manager;
  };

  const getOtherAMs = (supplier: SupplierWithAMs) => {
    return supplier.assignments?.filter(a => !a.is_primary) || [];
  };

  const getAvailableAMs = (supplier: SupplierWithAMs) => {
    const assignedIds = supplier.assignments?.map(a => a.account_manager_id) || [];
    return allAccountManagers.filter(am => !assignedIds.includes(am.id));
  };

  const openAMModal = (supplier: SupplierWithAMs) => {
    setSelectedSupplier(supplier);
    setShowAMModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leveranciers</h2>
          <p className="text-gray-600 mt-1">Beheer leveranciers en hun accountmanagers</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          Nieuwe leverancier
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek op naam, email of categorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Laden...</div>
        ) : (
          <div className="space-y-4">
            {filteredSuppliers.map((supplier) => {
              const primaryAM = getPrimaryAM(supplier);
              const otherAMs = getOtherAMs(supplier);

              return (
                <div key={supplier.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                        {supplier.category && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            {supplier.category}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          supplier.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {supplier.is_active ? 'Actief' : 'Inactief'}
                        </span>
                      </div>

                      <div className="flex gap-4 text-sm text-gray-600 mb-4">
                        {supplier.contact_person && (
                          <span>{supplier.contact_person}</span>
                        )}
                        {supplier.email && (
                          <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {supplier.email}
                          </a>
                        )}
                        {supplier.phone && (
                          <a href={`tel:${supplier.phone}`} className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {supplier.phone}
                          </a>
                        )}
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700">Accountmanagers</h4>
                          <button
                            onClick={() => openAMModal(supplier)}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <UserPlus className="w-4 h-4" />
                            Toevoegen
                          </button>
                        </div>

                        {primaryAM ? (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {primaryAM.first_name} {primaryAM.last_name}
                                  </div>
                                  <div className="text-sm text-gray-600">Primair contact</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <a href={`mailto:${primaryAM.email}`} className="text-sm text-blue-600 hover:text-blue-700">
                                  {primaryAM.email}
                                </a>
                                {primaryAM.phone && (
                                  <a href={`tel:${primaryAM.phone}`} className="text-sm text-gray-600">
                                    {primaryAM.phone}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 text-center text-sm text-gray-500">
                            Geen primaire accountmanager ingesteld
                          </div>
                        )}

                        {otherAMs.length > 0 && (
                          <div className="space-y-2">
                            {otherAMs.map((assignment) => {
                              const am = assignment.account_manager;
                              return (
                                <div key={assignment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div>
                                        <div className="font-medium text-gray-900">
                                          {am.first_name} {am.last_name}
                                        </div>
                                        <div className="text-sm text-gray-600">{am.function_title || 'Accountmanager'}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <a href={`mailto:${am.email}`} className="text-sm text-blue-600 hover:text-blue-700">
                                        {am.email}
                                      </a>
                                      {am.phone && (
                                        <a href={`tel:${am.phone}`} className="text-sm text-gray-600">
                                          {am.phone}
                                        </a>
                                      )}
                                      <button
                                        onClick={() => handleSetPrimary(supplier.id, assignment.id)}
                                        className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                                        title="Markeer als primair"
                                      >
                                        <Star className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleRemoveAM(assignment.id)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Verwijder"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {!primaryAM && otherAMs.length === 0 && (
                          <div className="text-center py-4 text-gray-400 text-sm">
                            Nog geen accountmanagers toegewezen
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredSuppliers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Geen leveranciers gevonden
              </div>
            )}
          </div>
        )}
      </div>

      {showAMModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Accountmanager toevoegen aan {selectedSupplier.name}
              </h3>
              <button
                onClick={() => setShowAMModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {getAvailableAMs(selectedSupplier).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Alle beschikbare accountmanagers zijn al toegewezen
                </div>
              ) : (
                <div className="space-y-2">
                  {getAvailableAMs(selectedSupplier).map((am) => (
                    <div
                      key={am.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {am.first_name} {am.last_name}
                        </div>
                        <div className="text-sm text-gray-600">{am.function_title || 'Accountmanager'}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {am.email} {am.phone && `• ${am.phone}`}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleAddAM(selectedSupplier.id, am.id);
                          setShowAMModal(false);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Toevoegen
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
