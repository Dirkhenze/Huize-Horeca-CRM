import React, { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ColumnMapping {
  excelColumn: string;
  dbColumn: string;
  dbLabel: string;
  required: boolean;
}

interface PreviewData {
  headers: string[];
  rows: Record<string, any>[];
}

export function KlantenUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);

  const dbColumns = [
    { value: 'customer_number', label: 'Klantnummer', required: true },
    { value: 'name', label: 'Bedrijfsnaam', required: true },
    { value: 'region', label: 'Regio', required: false },
    { value: 'email', label: 'Email', required: false },
    { value: 'phone', label: 'Telefoon', required: false },
    { value: 'address', label: 'Adres', required: false },
    { value: 'city', label: 'Plaats', required: false },
    { value: 'postal_code', label: 'Postcode', required: false },
    { value: 'country', label: 'Land', required: false },
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(selectedFile);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return;

    const headers = lines[0].split(/[,;\t]/).map(h => h.trim().replace(/^"|"$/g, ''));
    const rows: Record<string, any>[] = [];

    for (let i = 1; i < Math.min(lines.length, 6); i++) {
      const values = lines[i].split(/[,;\t]/).map(v => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, any> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    setPreviewData({ headers, rows });

    const autoMapping: ColumnMapping[] = headers.map(header => {
      const normalizedHeader = header.toLowerCase();
      let dbColumn = '';

      if (normalizedHeader.includes('klant') && normalizedHeader.includes('nummer')) dbColumn = 'customer_number';
      else if (normalizedHeader.includes('naam') || normalizedHeader.includes('name')) dbColumn = 'name';
      else if (normalizedHeader.includes('regio') || normalizedHeader.includes('region')) dbColumn = 'region';
      else if (normalizedHeader.includes('email') || normalizedHeader.includes('e-mail')) dbColumn = 'email';
      else if (normalizedHeader.includes('telefoon') || normalizedHeader.includes('phone')) dbColumn = 'phone';
      else if (normalizedHeader.includes('adres') || normalizedHeader.includes('address')) dbColumn = 'address';
      else if (normalizedHeader.includes('plaats') || normalizedHeader.includes('city')) dbColumn = 'city';
      else if (normalizedHeader.includes('postcode') || normalizedHeader.includes('postal')) dbColumn = 'postal_code';
      else if (normalizedHeader.includes('land') || normalizedHeader.includes('country')) dbColumn = 'country';

      const dbCol = dbColumns.find(c => c.value === dbColumn);
      return {
        excelColumn: header,
        dbColumn,
        dbLabel: dbCol?.label || '',
        required: dbCol?.required || false,
      };
    });

    setColumnMapping(autoMapping);
  };

  const updateMapping = (excelColumn: string, dbColumn: string) => {
    setColumnMapping(prev =>
      prev.map(m =>
        m.excelColumn === excelColumn
          ? {
              ...m,
              dbColumn,
              dbLabel: dbColumns.find(c => c.value === dbColumn)?.label || '',
              required: dbColumns.find(c => c.value === dbColumn)?.required || false,
            }
          : m
      )
    );
  };

  const handleImport = async () => {
    if (!file || !previewData) return;

    setImporting(true);
    setImportResult(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: userCompanies } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (!userCompanies) throw new Error('No company found');

      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(/[,;\t]/).map(h => h.trim().replace(/^"|"$/g, ''));

        const errors: string[] = [];
        let successCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(/[,;\t]/).map(v => v.trim().replace(/^"|"$/g, ''));
          const row: Record<string, any> = {};

          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          const customerData: Record<string, any> = {
            company_id: userCompanies.company_id,
          };

          columnMapping.forEach(mapping => {
            if (mapping.dbColumn && row[mapping.excelColumn]) {
              customerData[mapping.dbColumn] = row[mapping.excelColumn];
            }
          });

          if (!customerData.customer_number || !customerData.name) {
            errors.push(`Rij ${i}: Klantnummer en Naam zijn verplicht`);
            continue;
          }

          const { error } = await supabase
            .from('customers')
            .upsert(customerData, {
              onConflict: 'company_id,customer_number',
              ignoreDuplicates: false,
            });

          if (error) {
            errors.push(`Rij ${i}: ${error.message}`);
          } else {
            successCount++;
          }
        }

        setImportResult({ success: successCount, errors });
      };

      reader.readAsText(file);
    } catch (error: any) {
      setImportResult({ success: 0, errors: [error.message] });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      'Klantnummer,Bedrijfsnaam,Regio,Email,Telefoon,Adres,Plaats,Postcode,Land',
      '1001,Restaurant De Gouden Leeuw,Noord,info@goudenleeuw.nl,020-1234567,Hoofdstraat 1,Amsterdam,1000AA,NL',
      '1002,Café Het Bruine Paard,Zuid,contact@bruinepaard.nl,010-9876543,Marktplein 5,Rotterdam,3000BB,NL',
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'klanten_template.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Klanten Uploaden</h1>
          <p className="text-slate-600 mt-1">
            Upload een CSV of Excel bestand met klantgegevens
          </p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <Download className="w-4 h-4" />
          Download Template
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Selecteer bestand
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Kies bestand</span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {file && (
                <span className="text-sm text-slate-600">
                  {file.name}
                </span>
              )}
            </div>
          </div>

          {previewData && (
            <>
              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Kolom Mapping
                </h3>
                <div className="space-y-2">
                  {columnMapping.map((mapping) => (
                    <div key={mapping.excelColumn} className="flex items-center gap-4">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-slate-700">
                          {mapping.excelColumn}
                        </span>
                      </div>
                      <div className="flex-1">
                        <select
                          value={mapping.dbColumn}
                          onChange={(e) => updateMapping(mapping.excelColumn, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">-- Negeer kolom --</option>
                          {dbColumns.map((col) => (
                            <option key={col.value} value={col.value}>
                              {col.label} {col.required ? '*' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Preview (eerste 5 rijen)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        {previewData.headers.map((header) => (
                          <th
                            key={header}
                            className="px-4 py-2 text-left text-xs font-semibold text-slate-600"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          {previewData.headers.map((header) => (
                            <td
                              key={header}
                              className="px-4 py-2 text-slate-700"
                            >
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewData(null);
                    setColumnMapping([]);
                    setImportResult(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Annuleer
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {importing ? 'Importeren...' : 'Importeer Data'}
                </button>
              </div>
            </>
          )}

          {importResult && (
            <div className="border-t border-slate-200 pt-4">
              <div className={`p-4 rounded-lg ${
                importResult.errors.length === 0
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-start gap-3">
                  {importResult.errors.length === 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">
                      Import Resultaat
                    </h4>
                    <p className="text-sm text-slate-700">
                      {importResult.success} klanten succesvol geïmporteerd
                    </p>
                    {importResult.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-slate-900 mb-1">
                          {importResult.errors.length} fouten:
                        </p>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {importResult.errors.slice(0, 5).map((error, idx) => (
                            <li key={idx}>• {error}</li>
                          ))}
                          {importResult.errors.length > 5 && (
                            <li>... en {importResult.errors.length - 5} meer</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Tips voor een succesvolle import
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• CSV bestand moet comma (,) of semicolon (;) gescheiden zijn</li>
          <li>• Klantnummer en Bedrijfsnaam zijn verplichte velden</li>
          <li>• Bestaande klanten (zelfde klantnummer) worden bijgewerkt</li>
          <li>• Download de template voor een voorbeeld formaat</li>
        </ul>
      </div>
    </div>
  );
}
