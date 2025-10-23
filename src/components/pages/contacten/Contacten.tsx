import React, { useState } from 'react';
import { Building2, Users, CircleUser as UserCircle } from 'lucide-react';
import { Klanten } from './Klanten';
import { LeveranciersEnhanced } from './LeveranciersEnhanced';
import { AccountmanagersPage } from './AccountmanagersPage';

type ContactTab = 'klanten' | 'leveranciers' | 'accountmanagers';

export function Contacten() {
  const [activeTab, setActiveTab] = useState<ContactTab>('klanten');

  const tabs = [
    { id: 'klanten' as ContactTab, label: 'Klanten', icon: Building2 },
    { id: 'leveranciers' as ContactTab, label: 'Leveranciers', icon: Users },
    { id: 'accountmanagers' as ContactTab, label: 'Accountmanagers', icon: UserCircle },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Contacten</h1>

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

      {activeTab === 'klanten' && <Klanten />}
      {activeTab === 'leveranciers' && <LeveranciersEnhanced />}
      {activeTab === 'accountmanagers' && <AccountmanagersPage />}
    </div>
  );
}
