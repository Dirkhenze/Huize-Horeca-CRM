import React from 'react';
import { NavCategory } from '../../lib/types';
import { FileText, DollarSign, Megaphone, Users, BarChart3, Package, TrendingUp, Truck, CircleUser as UserCircle, Route, Calendar, Warehouse, ShoppingCart, FileCheck, Percent, Building2, UserPlus, Sparkles, AlertTriangle, TrendingDown, Target, Activity, Upload } from 'lucide-react';

interface SidebarProps {
  activeCategory: NavCategory;
  activePage: string;
  onPageChange: (page: string) => void;
}

const sidebarMenus: Record<NavCategory, { id: string; label: string; icon: any }[]> = {
  sales: [
    { id: 'offertes', label: 'Offertes', icon: FileText },
    { id: 'prijzen', label: 'Prijzen', icon: DollarSign },
    { id: 'price-upload', label: 'Prijslijst Uploaden', icon: Upload },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'analytics', label: 'Sales Analytics Dashboard', icon: BarChart3 },
  ],
  inkoop: [
    { id: 'artikelen-invoeren', label: 'Artikelen invoeren', icon: Package },
    { id: 'besteladvies', label: 'Besteladvies', icon: TrendingUp },
    { id: 'team', label: 'Team', icon: Users },
  ],
  logistiek: [
    { id: 'autos', label: "Auto's", icon: Truck },
    { id: 'chauffeurs', label: 'Chauffeurs', icon: UserCircle },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'planning', label: 'Planning', icon: Calendar },
    { id: 'team', label: 'Team', icon: Users },
  ],
  magazijn: [
    { id: 'voorraad', label: 'Voorraad', icon: Warehouse },
    { id: 'artikelen', label: 'Artikelen', icon: Package },
    { id: 'team', label: 'Team', icon: Users },
  ],
  verkoop: [
    { id: 'klantenorders', label: 'Klantenorders', icon: ShoppingCart },
    { id: 'facturen', label: 'Facturen', icon: FileCheck },
    { id: 'kortingen', label: 'Kortingen', icon: Percent },
    { id: 'team', label: 'Team', icon: Users },
  ],
  trendz: [
    { id: 'top-kansen', label: 'Top kansen', icon: Sparkles },
    { id: 'afwijkend-gedrag-klant', label: 'Afwijkend gedrag (klant)', icon: AlertTriangle },
    { id: 'afwijkend-gedrag-productgroep', label: 'Afwijkend gedrag (productgroep)', icon: TrendingDown },
    { id: 'cross-sell-artikel', label: 'Cross-sell (artikel)', icon: Target },
    { id: 'cross-sell-productgroep', label: 'Cross-sell (productgroep)', icon: Activity },
    { id: 'achterblijvers', label: 'Klanten onder markt', icon: TrendingDown },
    { id: 'team', label: 'Team', icon: Users },
  ],
};

const globalMenu = [
  { id: 'contacten', label: 'Contacten', icon: Users },
];

export function Sidebar({ activeCategory, activePage, onPageChange }: SidebarProps) {
  const menuItems = sidebarMenus[activeCategory] || [];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto">
      <nav className="p-4">
        <div className="space-y-1 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  activePage === item.id
                    ? 'text-white huize-primary'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Global
          </p>
          <div className="space-y-1">
            {globalMenu.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    activePage === item.id
                      ? 'text-white huize-primary'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
