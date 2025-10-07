import { X, Users, Building2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'gebruikers', label: 'Gebruikers', icon: Users },
  { id: 'bedrijfsgegevens', label: 'Bedrijfsgegevens', icon: Building2 },
  { id: 'instellingen', label: 'Instellingen', icon: Settings },
];

export function UserMenu({ isOpen, onClose, onNavigate, onLogout }: UserMenuProps) {
  const { user } = useAuth();

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const handleSignOut = () => {
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 transform transition-transform">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Ingelogd als</p>
            <p className="font-medium text-slate-900">{user?.email || 'Onbekend'}</p>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Uitloggen</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
