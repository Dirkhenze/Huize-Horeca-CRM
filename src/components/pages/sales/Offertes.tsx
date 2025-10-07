import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { DataTable } from '../../common/DataTable';
import { Quote } from '../../../lib/types';

export function Offertes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        setQuotes([]);
      } else {
        setQuotes(data || []);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'quote_number', label: 'Offerte nr.', sortable: true },
    { key: 'quote_date', label: 'Datum', sortable: true },
    {
      key: 'total_amount',
      label: 'Bedrag',
      sortable: true,
      render: (val: number) => `€ ${val.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            val === 'geaccepteerd'
              ? 'bg-green-100 text-green-700'
              : val === 'verzonden'
              ? 'bg-blue-100 text-blue-700'
              : val === 'afgewezen'
              ? 'bg-red-100 text-red-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {val}
        </span>
      ),
    },
    { key: 'valid_until', label: 'Geldig tot', sortable: true },
  ];

  if (loading) {
    return <div className="text-center py-8">Laden...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Offertes</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg huize-primary hover:huize-hover transition">
          <Plus className="w-5 h-5" />
          Nieuwe offerte
        </button>
      </div>

      <DataTable
        columns={columns}
        data={quotes}
        searchPlaceholder="Zoek offertes..."
      />
    </div>
  );
}
