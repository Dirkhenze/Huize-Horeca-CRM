import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Building2, Users, DollarSign, Calendar } from 'lucide-react';
import { Companies } from './Companies';
import { Contacts } from './Contacts';
import { Deals } from './Deals';
import { Activities } from './Activities';

type View = 'companies' | 'contacts' | 'deals' | 'activities';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('companies');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { id: 'companies' as View, label: 'Companies', icon: Building2 },
    { id: 'contacts' as View, label: 'Contacts', icon: Users },
    { id: 'deals' as View, label: 'Deals', icon: DollarSign },
    { id: 'activities' as View, label: 'Activities', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">CRM System</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex gap-2 mb-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {currentView === 'companies' && <Companies />}
          {currentView === 'contacts' && <Contacts />}
          {currentView === 'deals' && <Deals />}
          {currentView === 'activities' && <Activities />}
        </div>
      </div>
    </div>
  );
}
