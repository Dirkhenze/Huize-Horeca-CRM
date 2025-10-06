import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { HuizeDashboard } from './components/HuizeDashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center huize-primary">
            <span className="text-2xl font-bold text-white">HH</span>
          </div>
          <div className="text-slate-600">Laden...</div>
        </div>
      </div>
    );
  }

  return user ? <HuizeDashboard /> : <Auth />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
