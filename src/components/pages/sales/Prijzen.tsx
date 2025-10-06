import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

export function Prijzen() {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    stats?: { processed: number; errors: number };
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setUploadResult({
      success: true,
      message: 'Prijslijst succesvol geüpload',
      stats: { processed: 245, errors: 0 },
    });
    setUploading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Prijzenlijsten</h1>

      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full huize-primary flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Upload Prijslijst
            </h2>
            <p className="text-slate-600">
              Upload een CSV of XLSX bestand met klantspecifieke prijzen
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
            >
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 font-medium mb-1">
                {uploading ? 'Uploaden...' : 'Klik om bestand te selecteren'}
              </p>
              <p className="text-sm text-slate-500">CSV, XLSX of XLS (max 10MB)</p>
            </label>
          </div>

          {uploadResult && (
            <div
              className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
                uploadResult.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {uploadResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    uploadResult.success ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {uploadResult.message}
                </p>
                {uploadResult.stats && (
                  <p className="text-sm text-green-700 mt-1">
                    {uploadResult.stats.processed} prijzen verwerkt,{' '}
                    {uploadResult.stats.errors} fouten
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Vereiste kolommen</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Klantnummer</strong> of <strong>Klantnaam</strong></li>
              <li>• <strong>Artikelnummer</strong> of <strong>SKU</strong></li>
              <li>• <strong>Nettoprijs</strong></li>
              <li>• <strong>Geldig vanaf</strong> (optioneel)</li>
              <li>• <strong>Geldig tot</strong> (optioneel)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
