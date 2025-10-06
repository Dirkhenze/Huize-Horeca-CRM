import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface APIConnection {
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'testing';
  lastChecked?: string;
}

export function Instellingen() {
  const [apis, setApis] = useState<APIConnection[]>([
    {
      name: 'OpenAI',
      description: 'AI-analyses en natuurlijke taalverwerking',
      status: 'disconnected',
    },
    {
      name: 'Uniconta',
      description: 'ERP-integratie voor orders, klanten en voorraad',
      status: 'disconnected',
    },
    {
      name: 'Google Maps',
      description: 'Routeplanning en logistieke optimalisatie',
      status: 'disconnected',
    },
    {
      name: 'Metabase',
      description: 'Analytics en rapportage dashboards',
      status: 'disconnected',
    },
    {
      name: 'Trendskout',
      description: 'AI patroondetectie en marktanalyse',
      status: 'disconnected',
    },
  ]);

  const testConnection = async (index: number) => {
    setApis((prev) =>
      prev.map((api, i) => (i === index ? { ...api, status: 'testing' as const } : api))
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setApis((prev) =>
      prev.map((api, i) =>
        i === index
          ? {
              ...api,
              status: 'connected' as const,
              lastChecked: new Date().toLocaleString('nl-NL'),
            }
          : api
      )
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Instellingen</h1>
      <p className="text-slate-600 mb-8">Beheer API-verbindingen en systeeminstellingen</p>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">API Integraties</h2>
          <p className="text-sm text-slate-600 mt-1">
            Configureer externe diensten en test verbindingen
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {apis.map((api, index) => (
            <div key={api.name} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    api.status === 'connected'
                      ? 'bg-green-100'
                      : api.status === 'testing'
                      ? 'bg-blue-100'
                      : 'bg-slate-100'
                  }`}
                >
                  {api.status === 'connected' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : api.status === 'testing' ? (
                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{api.name}</h3>
                  <p className="text-sm text-slate-600">{api.description}</p>
                  {api.lastChecked && (
                    <p className="text-xs text-slate-500 mt-1">
                      Laatst gecontroleerd: {api.lastChecked}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => testConnection(index)}
                disabled={api.status === 'testing'}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg huize-primary hover:huize-hover disabled:opacity-50 transition"
              >
                {api.status === 'testing' ? 'Testen...' : 'Test verbinding'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Database Connectie</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">Supabase</p>
            <p className="text-sm text-slate-600">Verbonden en operationeel</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">AI Model Instellingen</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-800">Model:</span>
            <span className="font-medium text-blue-900">GPT-4</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-800">Temperature:</span>
            <span className="font-medium text-blue-900">0.7</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-800">Max tokens:</span>
            <span className="font-medium text-blue-900">2000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
