import React, { useState } from 'react';
import { DollarSign, Upload } from 'lucide-react';
import { Prijzen } from './Prijzen';
import { PriceUpload } from './PriceUpload';

type PrijzenTab = 'prijzen' | 'upload';

export default function PrijzenWithTabs() {
  const [activeTab, setActiveTab] = useState<PrijzenTab>('prijzen');

  const tabs = [
    { id: 'prijzen' as PrijzenTab, label: 'Prijzen', icon: DollarSign },
    { id: 'upload' as PrijzenTab, label: 'Upload', icon: Upload },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Prijzen</h1>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'prijzen' && <Prijzen />}
      {activeTab === 'upload' && <PriceUpload />}
    </div>
  );
}
