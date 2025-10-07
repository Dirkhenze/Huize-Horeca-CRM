import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../../../lib/supabase';
import { CSVPreview } from '../../common/CSVPreview';

export function ArtikelenUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setSuccess(false);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setPreview(jsonData.slice(0, 5));
    } catch (err) {
      setError('Fout bij het lezen van bestand');
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const products = jsonData.map((row: any) => ({
        artikelnummer: row.Artikelnummer || row.artikelnummer || row.SKU || '',
        eenheid: row.Eenheid || row.eenheid || row.Unit || '',
        artikelnaam: row.Artikelnaam || row.artikelnaam || row.Naam || row.Omschrijving || '',
        inhoud: row.Inhoud || row.inhoud || row.Content || '',
        kostprijs: parseFloat(row.Kostprijs || row.kostprijs || row['Cost Price'] || '0') || 0,
        verkoopprijs_1: parseFloat(row['Verkoopprijs 1'] || row.verkoopprijs_1 || row['Selling Price'] || '0') || 0,
        verkoopprijs_2: parseFloat(row['Verkoopprijs 2'] || row.verkoopprijs_2 || '0') || 0,
        verkoopprijs_3: parseFloat(row['Verkoopprijs 3'] || row.verkoopprijs_3 || '0') || 0,
        category: row.Categorie || row.category || row.Groep || '',
        supplier: row.Leverancier || row.supplier || row.Supplier || '',
        barcode: row.Barcode || row.barcode || row.EAN || '',
      }));

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/product-upload`;
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products,
          company_id: '00000000-0000-0000-0000-000000000001',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload mislukt');
      }

      setSuccess(true);
      setFile(null);
      setPreview([]);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Upload mislukt');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview([]);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Artikelen Uploaden</h2>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Instructies</h3>
          <p className="text-slate-600 mb-4">
            Upload een Excel (.xlsx) bestand met artikelgegevens. Het bestand moet de volgende kolommen bevatten:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4">
            <li><strong>Artikelnummer</strong> (verplicht)</li>
            <li><strong>Eenheid</strong></li>
            <li><strong>Artikelnaam</strong> (verplicht)</li>
            <li><strong>Inhoud</strong></li>
            <li><strong>Kostprijs</strong></li>
            <li><strong>Verkoopprijs 1</strong></li>
            <li>Verkoopprijs 2 (optioneel)</li>
            <li>Verkoopprijs 3 (optioneel)</li>
            <li>Categorie (optioneel)</li>
            <li>Leverancier (optioneel)</li>
            <li>Barcode (optioneel)</li>
          </ul>
        </div>

        {!file && (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Sleep een bestand hierheen of klik om te selecteren</p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition"
            >
              Bestand Selecteren
            </label>
          </div>
        )}

        {file && preview.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">Preview van eerste 5 rijen</p>
              </div>
              <button
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CSVPreview data={preview} />

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {uploading ? 'Uploaden...' : 'Artikelen Uploaden'}
              </button>
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition"
              >
                Annuleren
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">Artikelen succesvol geüpload!</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
