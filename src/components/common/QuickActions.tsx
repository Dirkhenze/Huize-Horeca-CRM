import { Video as LucideIcon } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: 'blue' | 'green' | 'red' | 'slate';
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

const colorClasses = {
  blue: 'huize-primary hover:huize-hover text-white',
  green: 'bg-green-600 hover:bg-green-700 text-white',
  red: 'bg-red-600 hover:bg-red-700 text-white',
  slate: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
};

export function QuickActions({ actions, title = 'Snelle acties' }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const colorClass = colorClasses[action.color || 'blue'];

          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${colorClass}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
