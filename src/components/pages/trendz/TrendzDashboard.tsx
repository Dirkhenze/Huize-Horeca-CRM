import React from 'react';
import { AIInsightCard } from '../../common/AIInsightCard';

interface TrendzDashboardProps {
  onNavigate: (page: string) => void;
}

export function TrendzDashboard({ onNavigate }: TrendzDashboardProps) {
  const insights = [
    {
      id: 'top-kansen',
      title: 'Top kansen',
      count: 23,
      description: 'Geïdentificeerde verkoop- en groeikansen',
      icon: 'sparkles' as const,
    },
    {
      id: 'afwijkend-gedrag-klant',
      title: 'Afwijkend gedrag (klant)',
      count: 12,
      description: 'Klanten met onverwachte aankooppatronen',
      icon: 'alert' as const,
    },
    {
      id: 'afwijkend-gedrag-productgroep',
      title: 'Afwijkend gedrag (productgroep)',
      count: 8,
      description: 'Productgroepen met afwijkende verkoop',
      icon: 'alert' as const,
    },
    {
      id: 'cross-sell-artikel',
      title: 'Cross-sell potentieel (artikel)',
      count: 34,
      description: 'Artikelen met cross-sell mogelijkheden',
      icon: 'trending' as const,
    },
    {
      id: 'cross-sell-productgroep',
      title: 'Cross-sell potentieel (productgroep)',
      count: 15,
      description: 'Productgroepen voor cross-selling',
      icon: 'trending' as const,
    },
    {
      id: 'achterblijvers',
      title: 'Klanten onder markt',
      count: 18,
      description: 'Klanten die achterblijven bij marktgemiddelde',
      icon: 'alert' as const,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Trendz AI Market Intelligence</h1>
        <p className="text-slate-600">
          AI-gedreven inzichten voor sales optimalisatie en marktanalyse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <AIInsightCard
            key={insight.id}
            title={insight.title}
            count={insight.count}
            description={insight.description}
            icon={insight.icon}
            onClick={() => onNavigate(insight.id)}
          />
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">AI Powered Analytics</h2>
        <p className="text-blue-100 mb-6">
          Onze AI-engine analyseert real-time verkoop- en marktdata om actiebare inzichten te
          genereren. Ontdek nieuwe kansen, detecteer risico's en optimaliseer uw salesstrategie.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-3xl font-bold mb-1">92%</p>
            <p className="text-sm text-blue-100">Voorspellingsnauwkeurigheid</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-3xl font-bold mb-1">€ 340K</p>
            <p className="text-sm text-blue-100">Extra omzet via AI</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-3xl font-bold mb-1">156</p>
            <p className="text-sm text-blue-100">Actieve inzichten</p>
          </div>
        </div>
      </div>
    </div>
  );
}
