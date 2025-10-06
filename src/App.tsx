import { HuizeDashboard } from './components/HuizeDashboard';
import { Auth } from './components/Auth';
import { useAuth } from './contexts/AuthContext';

function App() {
  try {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700">
              <span className="text-2xl font-bold text-white">HH</span>
            </div>
            <div className="text-slate-600">Laden...</div>
          </div>
        </div>
      );
    }

    if (!user) {
      return <Auth />;
    }

    return <HuizeDashboard />;
  } catch (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-slate-700">{String(error)}</p>
        </div>
      </div>
    );
  }
}

export default App;
