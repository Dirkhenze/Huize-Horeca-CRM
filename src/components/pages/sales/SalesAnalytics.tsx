import { useState, useEffect } from 'react';
import { StatsCard } from '../../common/StatsCard';
import { QuickActions } from '../../common/QuickActions';
import { TrendingUp, Users, ShoppingCart, DollarSign, FileText, Upload, Plus, Sparkles } from 'lucide-react';

export function SalesAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    avgOrderValue: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        revenue: 128450,
        orders: 342,
        customers: 87,
        avgOrderValue: 375.58,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    {
      id: 'new-quote',
      label: 'Nieuwe offerte',
      icon: FileText,
      onClick: () => console.log('New quote'),
      color: 'blue' as const,
    },
    {
      id: 'upload-prices',
      label: 'Prijzen uploaden',
      icon: Upload,
      onClick: () => console.log('Upload prices'),
      color: 'slate' as const,
    },
    {
      id: 'add-customer',
      label: 'Klant toevoegen',
      icon: Plus,
      onClick: () => console.log('Add customer'),
      color: 'green' as const,
    },
    {
      id: 'view-orders',
      label: 'Orders bekijken',
      icon: ShoppingCart,
      onClick: () => console.log('View orders'),
      color: 'slate' as const,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Sales Analytics Dashboard</h1>
        <p className="text-slate-600">
          Real-time overzicht van jouw verkoopprestaties
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Totale omzet (30d)"
          value={`€ ${stats.revenue.toLocaleString('nl-NL')}`}
          change={12.5}
          icon={DollarSign}
          color="green"
          loading={loading}
        />
        <StatsCard
          title="Aantal orders (30d)"
          value={stats.orders}
          change={8.3}
          icon={ShoppingCart}
          color="blue"
          loading={loading}
        />
        <StatsCard
          title="Actieve klanten"
          value={stats.customers}
          change={-2.1}
          icon={Users}
          color="purple"
          loading={loading}
        />
        <StatsCard
          title="Gem. orderwaarde"
          value={`€ ${stats.avgOrderValue.toFixed(2)}`}
          change={5.7}
          icon={TrendingUp}
          color="yellow"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <QuickActions actions={quickActions} />

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recente activiteit</h3>
          <div className="space-y-4">
            {[
              {
                type: 'order',
                customer: 'Café De Brug',
                amount: '€ 485,50',
                time: '2 uur geleden',
              },
              {
                type: 'quote',
                customer: 'Restaurant Het Anker',
                amount: '€ 1.250,00',
                time: '4 uur geleden',
              },
              {
                type: 'order',
                customer: 'Bar Central',
                amount: '€ 320,75',
                time: '5 uur geleden',
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    {activity.type === 'order' ? (
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{activity.customer}</p>
                    <p className="text-sm text-slate-500">
                      {activity.type === 'order' ? 'Order' : 'Offerte'} • {activity.time}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-slate-900">{activity.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Top 5 producten</h3>
          <div className="space-y-3">
            {[
              { name: 'Pils Fust 30L', sales: 145, revenue: '€ 12.325' },
              { name: 'Huiswijn Rood 6x75cl', sales: 98, revenue: '€ 2.744' },
              { name: 'Speciaal Bier 20L', sales: 76, revenue: '€ 5.472' },
              { name: 'Gin 70cl', sales: 54, revenue: '€ 1.188' },
              { name: 'Prosecco 6x75cl', sales: 42, revenue: '€ 1.890' },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 text-sm">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 bg-slate-100 rounded-full flex-1 max-w-xs overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(product.sales / 145) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{product.sales}</span>
                  </div>
                </div>
                <p className="font-semibold text-slate-900 ml-4">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="huize-gradient rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6" />
            <h3 className="text-lg font-semibold">AI Actiepunten</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20">
              <p className="text-sm font-medium">Focus op Café De Zon</p>
              <p className="text-xs opacity-90 mt-1">
                20% omzetdaling gedetecteerd, contact opnemen aanbevolen
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20">
              <p className="text-sm font-medium">Cross-sell kans: Premium wijnen</p>
              <p className="text-xs opacity-90 mt-1">
                15 klanten met bierorders zonder wijnassortiment
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20">
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
