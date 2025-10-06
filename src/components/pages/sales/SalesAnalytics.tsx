import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Sparkles } from 'lucide-react';

export function SalesAnalytics() {
  const kpis = [
    { label: 'Totale omzet', value: '€ 1.245.890', change: '+12%', trend: 'up' },
    { label: 'Actieve klanten', value: '342', change: '+5%', trend: 'up' },
    { label: 'Gem. orderwaarde', value: '€ 3.642', change: '-2%', trend: 'down' },
    { label: 'Conversie rate', value: '68%', change: '+3%', trend: 'up' },
  ];

  const topProducts = [
    { name: 'Heineken Krat 24x0,33L', sales: '€ 45.230', units: 1240 },
    { name: 'Grolsch Premium Pilsener', sales: '€ 38.450', units: 980 },
    { name: 'Bavaria Premium', sales: '€ 32.890', units: 890 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Sales Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-900 mb-2">{kpi.value}</p>
            <div className="flex items-center gap-1">
              {kpi.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {kpi.change}
              </span>
              <span className="text-sm text-slate-500">vs vorige periode</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Producten</h3>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-600">{product.units} eenheden</p>
                </div>
                <p className="font-semibold text-slate-900">{product.sales}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6" />
            <h3 className="text-lg font-semibold">AI Actiepunten</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <p className="text-sm font-medium">Focus op Café De Zon</p>
              <p className="text-xs opacity-90 mt-1">
                20% omzetdaling gedetecteerd, contact opnemen aanbevolen
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <p className="text-sm font-medium">Cross-sell kans: Premium wijnen</p>
              <p className="text-xs opacity-90 mt-1">
                15 klanten met bierorders zonder wijnassortiment
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <p className="text-sm font-medium">Prijsaanpassing nodig</p>
              <p className="text-xs opacity-90 mt-1">
                3 producten met te lage marge bij huidige verkoopprijs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
