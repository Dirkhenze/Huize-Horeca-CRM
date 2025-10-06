import { useState, useEffect } from 'react';
import { Search, Building2, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Customer {
  id: string;
  customer_number: string;
  name: string;
  region?: string;
  city?: string;
}

interface CustomerSelectorProps {
  onSelect: (customer: Customer) => void;
  selectedId?: string;
  className?: string;
}

export function CustomerSelector({ onSelect, selectedId, className = '' }: CustomerSelectorProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.customer_number.toLowerCase().includes(search.toLowerCase()) ||
          c.city?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [search, customers]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, customer_number, name, region, city')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
      setFilteredCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomer = customers.find((c) => c.id === selectedId);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Klant selecteren
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-white"
        >
          {selectedCustomer ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">{selectedCustomer.name}</p>
                <p className="text-sm text-slate-500">
                  {selectedCustomer.customer_number}
                  {selectedCustomer.city && ` • ${selectedCustomer.city}`}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-slate-500">Selecteer een klant...</span>
          )}
        </div>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-2 bg-white rounded-lg border-2 border-slate-200 shadow-xl max-h-96 overflow-hidden">
              <div className="p-3 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Zoek klant..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-80">
                {loading ? (
                  <div className="p-8 text-center text-slate-500">Laden...</div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    Geen klanten gevonden
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => {
                        onSelect(customer);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 transition-colors ${
                        customer.id === selectedId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {customer.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {customer.customer_number}
                          </p>
                          {(customer.region || customer.city) && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <p className="text-xs text-slate-500">
                                {[customer.region, customer.city]
                                  .filter(Boolean)
                                  .join(' • ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
