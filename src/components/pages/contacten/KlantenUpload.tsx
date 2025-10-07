import React, { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import * as XLSX from 'xlsx';

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
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null);
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);

  const dbColumns = [
    { value: 'customer_number', label: 'Klantnummer', required: true, category: 'Basis' },
    { value: 'name', label: 'Naam', required: true, category: 'Basis' },

    { value: 'saldo', label: 'Saldo', required: false, category: 'Financieel' },
    { value: 'achterstallig', label: 'Achterstallig', required: false, category: 'Financieel' },
    { value: 'achterstallig_in_valuta', label: 'Achterstallig in valuta', required: false, category: 'Financieel' },
    { value: 'kredietlimiet', label: 'Kredietlimiet', required: false, category: 'Financieel' },

    { value: 'adres_1', label: 'Adres 1', required: false, category: 'Adres' },
    { value: 'adres_2', label: 'Adres 2', required: false, category: 'Adres' },
    { value: 'adres_3', label: 'Adres 3', required: false, category: 'Adres' },
    { value: 'postcode', label: 'Postcode', required: false, category: 'Adres' },
    { value: 'city', label: 'Plaats', required: false, category: 'Adres' },
    { value: 'country', label: 'Land', required: false, category: 'Adres' },

    { value: 'afleveradres_1', label: 'Afleveradres 1', required: false, category: 'Levering' },
    { value: 'afleveradres_2', label: 'Afleveradres 2', required: false, category: 'Levering' },
    { value: 'afleveradres_3', label: 'Afleveradres 3', required: false, category: 'Levering' },
    { value: 'postcode_voor_levering', label: 'Postcode voor levering', required: false, category: 'Levering' },
    { value: 'plaats_voor_levering', label: 'Plaats voor levering', required: false, category: 'Levering' },
    { value: 'delivery_address', label: 'Delivery address', required: false, category: 'Levering' },
    { value: 'sleutelcode', label: 'Sleutelcode', required: false, category: 'Levering' },
    { value: 'contact_voor_levering', label: 'Contact voor levering', required: false, category: 'Levering' },
    { value: 'te_leveren_telefoon', label: 'Te leveren telefoon', required: false, category: 'Levering' },
    { value: 'te_leveren_email', label: 'Te leveren e-mail', required: false, category: 'Levering' },

    { value: 'phone', label: 'Telefoon', required: false, category: 'Contact' },
    { value: 'contact', label: 'Contact', required: false, category: 'Contact' },
    { value: 'email', label: 'E-mail voor Contact', required: false, category: 'Contact' },
    { value: 'email_voor_contact', label: 'E-mail voor Contact (alt)', required: false, category: 'Contact' },
    { value: 'www', label: 'WWW', required: false, category: 'Contact' },
    { value: 'mobiele_telefoon', label: 'Mobiele telefoon', required: false, category: 'Contact' },
    { value: 'email_voor_factuur', label: 'E-mail voor Factuur', required: false, category: 'Contact' },
    { value: 'email_verzenden', label: 'E-mail verzenden', required: false, category: 'Contact' },
    { value: 'e_factuur', label: 'e-factuur', required: false, category: 'Contact' },

    { value: 'crm_groep', label: 'CRM-groep', required: false, category: 'Business' },
    { value: 'betaling', label: 'Betaling', required: false, category: 'Business' },
    { value: 'betalingsformaat', label: 'Betalingsformaat', required: false, category: 'Business' },
    { value: 'btw_nummer', label: 'BTW nummer', required: false, category: 'Business' },
    { value: 'prijslijst', label: 'Prijslijst', required: false, category: 'Business' },
    { value: 'ons_rekeningnummer', label: 'Ons rekeningnummer', required: false, category: 'Business' },
    { value: 'filiaal', label: 'Filiaal', required: false, category: 'Business' },
    { value: 'geblokkeerd', label: 'Geblokkeerd', required: false, category: 'Business' },
    { value: 'bankrekening', label: 'Bankrekening', required: false, category: 'Business' },
    { value: 'transportmethode', label: 'Transportmethode', required: false, category: 'Business' },
    { value: 'leveringsvoorwaarde', label: 'Leveringsvoorwaarde', required: false, category: 'Business' },
    { value: 'kvk_nummer', label: 'KVK nummer', required: false, category: 'Business' },
    { value: 'gemaakt', label: 'Gemaakt', required: false, category: 'Business' },
    { value: 'bedrijfsstatus', label: 'Bedrijfsstatus', required: false, category: 'Business' },
    { value: 'weekdagen', label: 'Weekdagen', required: false, category: 'Business' },
    { value: 'automatische_orderbevestiging', label: 'Automatische orderbevestiging', required: false, category: 'Business' },
    { value: 'bezogtijden', label: 'Bezorgtijden', required: false, category: 'Business' },
    { value: 'weekfactuur', label: 'Weekfactuur', required: false, category: 'Business' },
    { value: 'account_manager', label: 'Account manager', required: false, category: 'Business' },
    { value: 'link_naar_payt', label: 'Link naar Payt', required: false, category: 'Business' },
    { value: 'region', label: 'Regio', required: false, category: 'Business' },
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImportResult(null);

    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        parseExcel(data as ArrayBuffer);
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(selectedFile);
    }
  };

  const parseExcel = (data: ArrayBuffer) => {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) return;

    const headers = jsonData[0].map((h: any) => String(h || '').trim());
    const rows: Record<string, any>[] = [];

    for (let i = 1; i < Math.min(jsonData.length, 6); i++) {
      const row: Record<string, any> = {};
      headers.forEach((header: string, index: number) => {
        row[header] = jsonData[i][index] !== undefined ? String(jsonData[i][index]) : '';
      });
      rows.push(row);
    }

    setPreviewData({ headers, rows });
    autoMapColumns(headers);
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
    autoMapColumns(headers);
  };

  const autoMapColumns = (headers: string[]) => {
    const autoMapping: ColumnMapping[] = headers.map(header => {
      const normalized = header.toLowerCase().replace(/[_\s-]/g, '');
      let dbColumn = '';

      const mappings: Record<string, string> = {
        'klantnummer': 'customer_number',
        'naam': 'name',
        'saldo': 'saldo',
        'achterstallig': 'achterstallig',
        'achterstalliginvaluta': 'achterstallig_in_valuta',
        'kredietlimiet': 'kredietlimiet',
        'adres1': 'adres_1',
        'adres2': 'adres_2',
        'adres3': 'adres_3',
        'postcode': 'postcode',
        'plaats': 'city',
        'land': 'country',
        'telefoon': 'phone',
        'contact': 'contact',
        'emailvoorcontact': 'email_voor_contact',
        'www': 'www',
        'mobieletelefoon': 'mobiele_telefoon',
        'emailvoorfactuur': 'email_voor_factuur',
        'emailverzenden': 'email_verzenden',
        'efactuur': 'e_factuur',
        'crmgroep': 'crm_groep',
        'betaling': 'betaling',
        'betalingsformaat': 'betalingsformaat',
        'btwnummer': 'btw_nummer',
        'prijslijst': 'prijslijst',
        'afleveradres1': 'afleveradres_1',
        'afleveradres2': 'afleveradres_2',
        'afleveradres3': 'afleveradres_3',
        'postcodevoorlevering': 'postcode_voor_levering',
        'plaatsvoorlevering': 'plaats_voor_levering',
        'onsrekeningnummer': 'ons_rekeningnummer',
        'filiaal': 'filiaal',
        'geblokkeerd': 'geblokkeerd',
        'bankrekening': 'bankrekening',
        'transportmethode': 'transportmethode',
        'leveringsvoorwaarde': 'leveringsvoorwaarde',
        'kvknummer': 'kvk_nummer',
        'gemaakt': 'gemaakt',
        'bedrijfsstatus': 'bedrijfsstatus',
        'contactvoorlevering': 'contact_voor_levering',
        'televerentelefoon': 'te_leveren_telefoon',
        'televerenemail': 'te_leveren_email',
        'weekdagen': 'weekdagen',
        'automatischeorderbevestiging': 'automatische_orderbevestiging',
        'deliveryaddress': 'delivery_address',
        'sleutelcode': 'sleutelcode',
        'bezogtijden': 'bezogtijden',
        'bezorgtijden': 'bezogtijden',
        'weekfactuur': 'weekfactuur',
        'accountmanager': 'account_manager',
        'linknaarpayt': 'link_naar_payt',
      };

      dbColumn = mappings[normalized] || '';

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
    setImportProgress(null);

    try {
      const demoUser = localStorage.getItem('demo-user');
      let userId: string;
      let companyId: string;

      if (demoUser) {
        const user = JSON.parse(demoUser);
        userId = user.id;

        const { data: userCompanies } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', userId)
          .maybeSingle();

        if (!userCompanies) {
          companyId = '00000000-0000-0000-0000-000000000001';
        } else {
          companyId = userCompanies.company_id;
        }
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        userId = user.id;

        const { data: userCompanies } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', userId)
          .maybeSingle();

        if (!userCompanies) throw new Error('No company found');
        companyId = userCompanies.company_id;
      }

      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let allRows: Record<string, any>[] = [];
      let headers: string[] = [];

      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          headers = jsonData[0].map((h: any) => String(h || '').trim());

          for (let i = 1; i < jsonData.length; i++) {
            const row: Record<string, any> = {};
            headers.forEach((header: string, index: number) => {
              row[header] = jsonData[i][index] !== undefined ? String(jsonData[i][index]) : '';
            });
            allRows.push(row);
          }

          await processImport(allRows, companyId);
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = event.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          headers = lines[0].split(/[,;\t]/).map(h => h.trim().replace(/^"|"$/g, ''));

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(/[,;\t]/).map(v => v.trim().replace(/^"|"$/g, ''));
            const row: Record<string, any> = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            allRows.push(row);
          }

          await processImport(allRows, companyId);
        };
        reader.readAsText(file);
      }
    } catch (error: any) {
      setImportResult({ success: 0, errors: [error.message] });
    } finally {
      setImporting(false);
    }
  };

  const processImport = async (rows: Record<string, any>[], companyId: string) => {
    const errors: string[] = [];
    const validRecords: Record<string, any>[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const customerData: Record<string, any> = {
        company_id: companyId,
        uniconta_synced_at: new Date().toISOString(),
      };

      columnMapping.forEach(mapping => {
        if (mapping.dbColumn && row[mapping.excelColumn]) {
          const value = row[mapping.excelColumn];

          if (mapping.dbColumn === 'geblokkeerd' || mapping.dbColumn === 'automatische_orderbevestiging') {
            customerData[mapping.dbColumn] = value === 'true' || value === '1' || value === 'ja';
          } else if (['saldo', 'achterstallig', 'achterstallig_in_valuta', 'kredietlimiet'].includes(mapping.dbColumn)) {
            customerData[mapping.dbColumn] = parseFloat(value) || 0;
          } else if (mapping.dbColumn === 'gemaakt') {
            customerData[mapping.dbColumn] = value ? new Date(value).toISOString() : null;
          } else {
            customerData[mapping.dbColumn] = value;
          }
        }
      });

      if (!customerData.customer_number || !customerData.name) {
        errors.push(`Rij ${i + 2}: Klantnummer en Naam zijn verplicht`);
        continue;
      }

      validRecords.push(customerData);
    }

    const BATCH_SIZE = 100;
    let successCount = 0;

    for (let i = 0; i < validRecords.length; i += BATCH_SIZE) {
      const batch = validRecords.slice(i, i + BATCH_SIZE);

      setImportProgress({ current: i, total: validRecords.length });

      try {
        const { error, count } = await supabase
          .from('customers')
          .upsert(batch, {
            onConflict: 'company_id,customer_number',
            ignoreDuplicates: false,
            count: 'exact'
          });

        if (error) {
          errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
          console.error('Supabase error details:', error);
        } else {
          successCount += batch.length;
        }
      } catch (err: any) {
        errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: TypeError - ${err.message || 'Netwerkfout bij database verbinding'}`);
        console.error('Network/fetch error:', err);
      }
    }

    setImportProgress(null);
    setImportResult({ success: successCount, errors });
  };

  const downloadTemplate = (format: 'csv' | 'xlsx' = 'xlsx') => {
    const headers = [
      'Klantnummer', 'Naam', 'Saldo', 'Achterstallig', 'Achterstallig in valuta', 'Kredietlimiet',
      'Adres 1', 'Adres 2', 'Adres 3', 'Postcode', 'Plaats', 'Land', 'Telefoon', 'Contact',
      'E-mail voor Contact', 'WWW', 'Mobiele telefoon', 'E-mail voor Factuur', 'E-mail verzenden',
      'e-factuur', 'CRM-groep', 'Betaling', 'Betalingsformaat', 'BTW nummer', 'Prijslijst',
      'Afleveradres 1', 'Afleveradres 2', 'Afleveradres 3', 'Postcode voor levering',
      'Plaats voor levering', 'Ons rekeningnummer', 'Filiaal', 'Geblokkeerd', 'Bankrekening',
      'Transportmethode', 'Leveringsvoorwaarde', 'KVK nummer', 'Gemaakt', 'Bedrijfsstatus',
      'Contact voor levering', 'Te leveren telefoon', 'Te leveren e-mail', 'Weekdagen',
      'Automatische orderbevestiging', 'Delivery address', 'Sleutelcode', 'Bezogtijden',
      'Weekfactuur', 'Account manager', 'Link naar Payt'
    ];

    const exampleRow = [
      '1001', 'Restaurant De Gouden Leeuw', '2500.00', '0', '0', '5000',
      'Hoofdstraat 1', '', '', '1000AA', 'Amsterdam', 'NL', '020-1234567', 'Jan Jansen',
      'info@goudenleeuw.nl', 'www.goudenleeuw.nl', '06-12345678', 'factuur@goudenleeuw.nl', 'info@goudenleeuw.nl',
      '', 'Horeca', 'Netto 30', 'SEPA', 'NL123456789B01', 'Standaard',
      'Hoofdstraat 1', '', '', '1000AA', 'Amsterdam', 'NL12BANK0123456789', '', 'false',
      'NL12BANK0123456789', 'Eigen vervoer', 'Franco', '12345678', '2023-01-15', 'Actief',
      'Jan Jansen', '020-1234567', 'levering@goudenleeuw.nl', 'Ma,Di,Wo,Do,Vr',
      'true', 'Hoofdstraat 1, 1000AA Amsterdam', '', '09:00-17:00', 'Week 1', 'John Doe', ''
    ];

    if (format === 'xlsx') {
      const worksheet = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Klanten');
      XLSX.writeFile(workbook, 'klanten_uniconta_template.xlsx');
    } else {
      const csv = [headers.join(','), exampleRow.join(',')].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'klanten_uniconta_template.csv';
      link.click();
    }
  };

  const groupedColumns = dbColumns.reduce((acc, col) => {
    const category = col.category || 'Overig';
    if (!acc[category]) acc[category] = [];
    acc[category].push(col);
    return acc;
  }, {} as Record<string, typeof dbColumns>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Klanten Uploaden</h1>
          <p className="text-slate-600 mt-1">
            Upload een CSV of Excel bestand met klantgegevens uit Uniconta
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadTemplate('xlsx')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            Download Excel
          </button>
          <button
            onClick={() => downloadTemplate('csv')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
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
                  Kolom Mapping ({columnMapping.filter(m => m.dbColumn).length} van {columnMapping.length} gekoppeld)
                </h3>
                <div className="max-h-96 overflow-y-auto space-y-2 border border-slate-200 rounded-lg p-3">
                  {columnMapping.map((mapping) => (
                    <div key={mapping.excelColumn} className="flex items-center gap-4 bg-slate-50 p-2 rounded">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-slate-700 truncate block">
                          {mapping.excelColumn}
                        </span>
                      </div>
                      <div className="flex-1">
                        <select
                          value={mapping.dbColumn}
                          onChange={(e) => updateMapping(mapping.excelColumn, e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">-- Negeer kolom --</option>
                          {Object.entries(groupedColumns).map(([category, cols]) => (
                            <optgroup key={category} label={category}>
                              {cols.map((col) => (
                                <option key={col.value} value={col.value}>
                                  {col.label} {col.required ? '*' : ''}
                                </option>
                              ))}
                            </optgroup>
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
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        {previewData.headers.slice(0, 8).map((header) => (
                          <th
                            key={header}
                            className="px-4 py-2 text-left text-xs font-semibold text-slate-600"
                          >
                            {header}
                          </th>
                        ))}
                        {previewData.headers.length > 8 && (
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                            ... +{previewData.headers.length - 8} kolommen
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          {previewData.headers.slice(0, 8).map((header) => (
                            <td
                              key={header}
                              className="px-4 py-2 text-slate-700"
                            >
                              {row[header]}
                            </td>
                          ))}
                          {previewData.headers.length > 8 && (
                            <td className="px-4 py-2 text-slate-400 italic">
                              ...
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {importProgress && (
                <div className="border-t border-slate-200 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">Importeren...</span>
                      <span className="font-medium text-slate-900">
                        {importProgress.current} / {importProgress.total}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewData(null);
                    setColumnMapping([]);
                    setImportResult(null);
                  }}
                  disabled={importing}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                >
                  Annuleer
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {importing ? 'Importeren...' : `Importeer ${columnMapping.filter(m => m.dbColumn).length} velden`}
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
                        <ul className="text-sm text-slate-700 space-y-1 max-h-40 overflow-y-auto">
                          {importResult.errors.slice(0, 10).map((error, idx) => (
                            <li key={idx}>• {error}</li>
                          ))}
                          {importResult.errors.length > 10 && (
                            <li>... en {importResult.errors.length - 10} meer</li>
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
          <li>• Upload Excel (.xlsx) of CSV bestanden</li>
          <li>• Export data vanuit Uniconta en upload direct</li>
          <li>• Klantnummer en Naam zijn verplichte velden</li>
          <li>• Bestaande klanten (zelfde klantnummer) worden automatisch bijgewerkt</li>
          <li>• Alle 50+ Uniconta velden worden ondersteund</li>
          <li>• De mapping wordt automatisch herkend op basis van kolomnamen</li>
        </ul>
      </div>
    </div>
  );
}
