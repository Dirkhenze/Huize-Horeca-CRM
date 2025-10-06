import React from 'react';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface AIInsightCardProps {
  title: string;
  count: number;
  description: string;
  icon?: 'sparkles' | 'trending' | 'alert';
  onClick: () => void;
}

export function AIInsightCard({
  title,
  count,
  description,
  icon = 'sparkles',
  onClick,
}: AIInsightCardProps) {
  const icons = {
    sparkles: Sparkles,
    trending: TrendingUp,
    alert: AlertCircle,
  };

  const Icon = icons[icon];

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-md transition text-left"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg huize-primary flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <span className="text-2xl font-bold huize-text-primary">{count}</span>
          </div>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </button>
  );
}
