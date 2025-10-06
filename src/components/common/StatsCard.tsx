import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  loading?: boolean;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    text: 'text-blue-900',
  },
  green: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    text: 'text-green-900',
  },
  red: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
    text: 'text-red-900',
  },
  yellow: {
    bg: 'bg-yellow-100',
    icon: 'text-yellow-600',
    text: 'text-yellow-900',
  },
  purple: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
    text: 'text-purple-900',
  },
};

export function StatsCard({
  title,
  value,
  change,
  changeLabel = 'vs vorige periode',
  icon: Icon,
  color = 'blue',
  loading = false,
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              change >= 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-slate-600 mb-1">{title}</p>
        {loading ? (
          <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
        ) : (
          <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
        )}
        {change !== undefined && (
          <p className="text-xs text-slate-500 mt-2">{changeLabel}</p>
        )}
      </div>
    </div>
  );
}
