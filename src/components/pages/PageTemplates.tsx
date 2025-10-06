import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { DataTable } from '../common/DataTable';

interface SimplePageProps {
  title: string;
  table: string;
  columns: any[];
  addButtonText?: string;
}

export function SimpleCRUDPage({ title, table, columns, addButtonText }: SimplePageProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(result || []);
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Laden...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {addButtonText && (
          <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg huize-primary hover:huize-hover transition">
            <Plus className="w-5 h-5" />
            {addButtonText}
          </button>
        )}
      </div>

      <DataTable columns={columns} data={data} searchPlaceholder={`Zoek ${title.toLowerCase()}...`} />
    </div>
  );
}
