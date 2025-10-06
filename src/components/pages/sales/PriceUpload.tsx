import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface UploadResult {
  success: boolean;
  priceListId?: string;
  itemsImported?: number;
  warnings?: string[];
  error?: string;
}

export function PriceUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [priceListName, setPriceListName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!priceListName) {
        setPriceListName(`Prijslijst ${new Date().toLocaleDateString('nl-NL')}`);
      }
    }
  };

  const parseCSV = (text: string): Array<{ sku: string; net_price: number; currency?: string }> => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].toLowerCase().split(/[,;]/);

    const skuIndex = headers.findIndex(h => h.includes('sku') || h.includes('artikel'));
    const priceIndex = headers.findIndex(h => h.includes('prijs') || h.includes('price'));
    const currencyIndex = headers.findIndex(h => h.includes('valuta') || h.includes('currency'));

    if (skuIndex === -1 || priceIndex === -1) {
      throw new Error('CSV moet minimaal kolommen voor SKU en prijs bevatten');
    }

    const prices = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/[,;]/);
      const sku = values[skuIndex]?.trim();
      const priceStr = values[priceIndex]?.trim().replace(',', '.');
      const price = parseFloat(priceStr);

      if (sku && !isNaN(price)) {
        prices.push({
          sku,
          net_price: price,
          currency: currencyIndex !== -1 ? values[currencyIndex]?.trim() : 'EUR',
        });
      }
    }

    return prices;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const text = await file.text();
      const prices = parseCSV(text);

      if (prices.length === 0) {
        throw new Error('Geen geldige prijzen gevonden in het bestand');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Niet ingelogd');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/price-upload`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prices,
          priceListName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload mislukt');
      }

      setResult(data);
      setFile(null);
      setPriceListName('');
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Prijslijst Uploaden</h1>
        <p className="text-slate-600">
          Upload een CSV-bestand met artikelprijzen. Het systeem controleert automatisch op
          margeproblemen en prijsafwijkingen.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Naam prijslijst
          </label>
          <input
            type="text"
            value={priceListName}
            onChange={(e) => setPriceListName(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Prijslijst 2024 Q1"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            CSV-bestand
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-slate-400 mb-3" />
              {file ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">{file.name}</span>
                </div>
              ) : (
                <>
                  <span className="text-slate-600 font-medium mb-1">
                    Klik om bestand te kiezen
                  </span>
                  <span className="text-sm text-slate-500">
                    Ondersteund formaat: CSV
                  </span>
                </>
              )}
            </label>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            CSV moet kolommen bevatten: SKU/Artikel, Prijs, Valuta (optioneel)
          </p>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || !priceListName || uploading}
          className="w-full huize-primary hover:huize-hover text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Bezig met uploaden...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Prijslijst Uploaden
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-6 max-w-2xl">
          {result.success ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">
                    Prijslijst succesvol geüpload
                  </h3>
                  <p className="text-sm text-green-800">
                    {result.itemsImported} artikelen geïmporteerd
                  </p>
                  {result.warnings && result.warnings.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm font-medium text-green-900 mb-2">Waarschuwingen:</p>
                      <ul className="text-sm text-green-800 space-y-1">
                        {result.warnings.map((warning, i) => (
                          <li key={i} className="flex items-start">
                            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="text-green-600 hover:text-green-800 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Upload mislukt</h3>
                  <p className="text-sm text-red-800">{result.error}</p>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="text-red-600 hover:text-red-800 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          CSV Formaat Voorbeeld
        </h3>
        <div className="bg-white rounded border border-blue-200 p-3 font-mono text-sm overflow-x-auto">
          <div>sku,prijs,valuta</div>
          <div>ART001,12.50,EUR</div>
          <div>ART002,25.00,EUR</div>
          <div>ART003,8.75,EUR</div>
        </div>
        <p className="text-sm text-blue-800 mt-3">
          Het systeem controleert automatisch of prijzen binnen marges vallen en waarschuwt bij
          afwijkingen van kostprijs of verkoopprijs.
        </p>
      </div>
    </div>
  );
}
