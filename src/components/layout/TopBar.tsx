import React from 'react';
import { Menu } from 'lucide-react';
import { NavCategory } from '../../lib/types';

interface TopBarProps {
  activeCategory: NavCategory;
  onCategoryChange: (category: NavCategory) => void;
  onMenuToggle: () => void;
}

const categories: { id: NavCategory; label: string }[] = [
  { id: 'sales', label: 'Sales' },
  { id: 'inkoop', label: 'Inkoop' },
  { id: 'logistiek', label: 'Logistiek' },
  { id: 'magazijn', label: 'Magazijn' },
  { id: 'verkoop', label: 'Verkoop' },
  { id: 'trendz', label: 'Trendz' },
];

export function TopBar({ activeCategory, onCategoryChange, onMenuToggle }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg huize-primary">
              HH
            </div>
            <span className="font-bold text-xl huize-text-primary hidden sm:inline">
              Huize Horeca
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeCategory === cat.id
                    ? 'text-white huize-primary'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
      </div>
    </div>
  );
}
