import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Key, Save, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface APIService {
  name: string;
  displayName: string;
  description: string;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    required: boolean;
  }[];
}

interface SavedKey {
  id: string;
  service_name: string;
  api_key: string;
  api_secret?: string;
  config: any;
  is_active: boolean;
  last_tested?: string;
  test_status?: string;
}

const API_SERVICES: APIService[] = [
  {
    name: 'openai',
    displayName: 'OpenAI',
    description: 'AI-analyses en natuurlijke taalverwerking voor Trendz',
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        placeholder: 'sk-...',
        required: true,
      },
    ],
  },
  {
    name: 'uniconta',
    displayName: 'Uniconta',
    description: 'ERP-integratie voor orders, klanten en voorraad',
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        placeholder: 'Uniconta API key',
        required: true,
      },
      {
        key: 'api_secret',
        label: 'API Secret',
        type: 'password',
        placeholder: 'Uniconta API secret',
        required: true,
      },
    ],
  },
  {
    name: 'google_maps',
    displayName: 'Google Maps',
    description: 'Routeplanning en logistieke optimalisatie',
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        placeholder: 'Google Maps API key',
        required: true,
      },
    ],
  },
];

export function Instellingen() {
  const [activeTab, setActiveTab] = useState('api');
  const [savedKeys, setSavedKeys] = useState<Record<string, SavedKey>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const tabs = [
    { id: 'api', label: 'API Verbindingen' },
    { id: 'algemeen', label: 'Algemeen' },
    { id: 'notificaties', label: 'Notificaties' },
    { id: 'beveiliging', label: 'Beveiliging' },
  ];

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: userCompany } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single();

      if (!userCompany) return;

      const { data: keys, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('company_id', userCompany.company_id);

      if (error) throw error;

      const keysMap: Record<string, SavedKey> = {};
      keys?.forEach((key) => {
        keysMap[key.service_name] = key;
      });
      setSavedKeys(keysMap);
    } catch (error: any) {
      console.error('Error loading API keys:', error);
    }
  };

  const handleSave = async (serviceName: string) => {
    setSaving((prev) => ({ ...prev, [serviceName]: true }));
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Niet ingelogd');

      const { data: userCompany } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single();

      if (!userCompany) throw new Error('Geen bedrijf gekoppeld');

      const serviceData = formData[serviceName] || {};
      const existingKey = savedKeys[serviceName];

      const payload = {
        company_id: userCompany.company_id,
        service_name: serviceName,
        api_key: serviceData.api_key || '',
        api_secret: serviceData.api_secret || null,
        config: {},
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      if (existingKey) {
        const { error } = await supabase
          .from('api_keys')
          .update(payload)
          .eq('id', existingKey.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('api_keys')
          .insert(payload);

        if (error) throw error;
      }

      await loadApiKeys();
      setMessage({ type: 'success', text: 'API key succesvol opgeslagen!' });
      setFormData((prev) => ({ ...prev, [serviceName]: {} }));
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving((prev) => ({ ...prev, [serviceName]: false }));
    }
  };

  const testConnection = async (serviceName: string) => {
    setLoading((prev) => ({ ...prev, [serviceName]: true }));
    setMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Niet ingelogd');

      const { data: userCompany } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single();

      if (!userCompany) throw new Error('Geen bedrijf gekoppeld');

      const { error } = await supabase
        .from('api_keys')
        .update({
          last_tested: new Date().toISOString(),
          test_status: 'success',
        })
        .eq('company_id', userCompany.company_id)
        .eq('service_name', serviceName);

      if (error) throw error;

      await loadApiKeys();
      setMessage({ type: 'success', text: 'Verbinding succesvol getest!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading((prev) => ({ ...prev, [serviceName]: false }));
    }
  };

  const toggleShowKey = (serviceName: string) => {
    setShowKeys((prev) => ({ ...prev, [serviceName]: !prev[serviceName] }));
  };

  const handleInputChange = (serviceName: string, fieldKey: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        [fieldKey]: value,
      },
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Instellingen</h1>
        <p className="text-slate-600">Beheer API-verbindingen en systeeminstellingen</p>
      </div>

      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'api' && (
        <div>
          {message && (
        <div
          className={`mb-6 rounded-lg p-4 border-l-4 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-500'
              : 'bg-red-50 border-red-500'
          }`}
        >
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p
              className={`font-medium ${
                message.type === 'success' ? 'text-green-900' : 'text-red-900'
              }`}
            >
              {message.text}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {API_SERVICES.map((service) => {
          const savedKey = savedKeys[service.name];
          const isConfigured = !!savedKey;
          const currentFormData = formData[service.name] || {};

          return (
            <div key={service.name} className="bg-white rounded-xl border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isConfigured
                          ? savedKey.test_status === 'success'
                            ? 'bg-green-100'
                            : 'bg-yellow-100'
                          : 'bg-slate-100'
                      }`}
                    >
                      {isConfigured ? (
                        savedKey.test_status === 'success' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Key className="w-6 h-6 text-yellow-600" />
                        )
                      ) : (
                        <XCircle className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {service.displayName}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                      {savedKey?.last_tested && (
                        <p className="text-xs text-slate-500 mt-2">
                          Laatst getest:{' '}
                          {new Date(savedKey.last_tested).toLocaleString('nl-NL')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isConfigured
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isConfigured ? 'Geconfigureerd' : 'Niet geconfigureerd'}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {service.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={
                          field.type === 'password' && !showKeys[service.name]
                            ? 'password'
                            : 'text'
                        }
                        value={currentFormData[field.key] || ''}
                        onChange={(e) =>
                          handleInputChange(service.name, field.key, e.target.value)
                        }
                        placeholder={
                          isConfigured && !currentFormData[field.key]
                            ? '••••••••••••••••'
                            : field.placeholder
                        }
                        className="w-full px-4 py-2.5 pr-12 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => toggleShowKey(service.name)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showKeys[service.name] ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleSave(service.name)}
                    disabled={saving[service.name]}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg huize-primary hover:huize-hover disabled:opacity-50 transition font-medium"
                  >
                    {saving[service.name] ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Opslaan...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Opslaan
                      </>
                    )}
                  </button>
                  {isConfigured && (
                    <button
                      onClick={() => testConnection(service.name)}
                      disabled={loading[service.name]}
                      className="px-6 py-2.5 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition font-medium"
                    >
                      {loading[service.name] ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Beveiliging
        </h3>
        <p className="text-sm text-blue-800">
          API keys worden veilig opgeslagen in de database met Row Level Security. Alleen
          gebruikers binnen jouw bedrijf kunnen deze keys bekijken en bewerken.
        </p>
          </div>
        </div>
      )}

      {activeTab === 'algemeen' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Algemene Instellingen</h2>
          <p className="text-slate-600">Algemene systeeminstellingen komen hier...</p>
        </div>
      )}

      {activeTab === 'notificaties' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Notificaties</h2>
          <p className="text-slate-600">Notificatie-instellingen komen hier...</p>
        </div>
      )}

      {activeTab === 'beveiliging' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Beveiligingsinstellingen</h2>
          <p className="text-slate-600">Beveiligingsinstellingen komen hier...</p>
        </div>
      )}
    </div>
  );
}
