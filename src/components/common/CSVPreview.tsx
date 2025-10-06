import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface CSVRow {
  [key: string]: string | number;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
}

interface CSVPreviewProps {
  file: File | null;
  requiredColumns: string[];
  onValidation?: (result: ValidationResult) => void;
}

export function CSVPreview({ file, requiredColumns, onValidation }: CSVPreviewProps) {
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview([]);
      setHeaders([]);
      setValidation(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseAndValidate(text);
    };
    reader.readAsText(file);
  }, [file]);

  const parseAndValidate = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      setValidation({
        valid: false,
        errors: ['Bestand is leeg'],
        warnings: [],
        rowCount: 0,
      });
      return;
    }

    const headers = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase());
    setHeaders(headers);

    const errors: string[] = [];
    const warnings: string[] = [];

    requiredColumns.forEach(col => {
      if (!headers.some(h => h.includes(col.toLowerCase()))) {
        errors.push(`Verplichte kolom '${col}' ontbreekt`);
      }
    });

    const rows: CSVRow[] = [];
    for (let i = 1; i < Math.min(lines.length, 6); i++) {
      const values = lines[i].split(/[,;]/);
      const row: CSVRow = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx]?.trim() || '';
      });
      rows.push(row);
    }

    setPreview(rows);

    const validationResult: ValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      rowCount: lines.length - 1,
    };

    setValidation(validationResult);
    onValidation?.(validationResult);
  };

  if (!file || !validation) return null;

  return (
    <div className="mt-4 space-y-4">
      <div
        className={`rounded-lg p-4 border-l-4 ${
          validation.valid
            ? 'bg-green-50 border-green-500'
            : 'bg-red-50 border-red-500'
        }`}
      >
        <div className="flex items-start gap-3">
          {validation.valid ? (
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">
              {validation.valid ? 'Validatie geslaagd' : 'Validatie fouten'}
            </h4>
            <p className="text-sm mb-2">
              {validation.rowCount} rijen gevonden
            </p>
            {validation.errors.length > 0 && (
              <ul className="text-sm space-y-1">
                {validation.errors.map((error, i) => (
                  <li key={i} className="text-red-800">• {error}</li>
                ))}
              </ul>
            )}
            {validation.warnings.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-yellow-800 mb-1">Waarschuwingen:</p>
                <ul className="text-sm space-y-1">
                  {validation.warnings.map((warning, i) => (
                    <li key={i} className="text-yellow-800">• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h4 className="font-semibold text-sm text-slate-900">
              Voorbeeld (eerste 5 rijen)
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {headers.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-2 text-left font-semibold text-slate-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    {headers.map((header, j) => (
                      <td key={j} className="px-4 py-2 text-slate-600">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
