import { useState } from 'react';
import { HuizeDashboard } from './components/HuizeDashboard';
import { Auth } from './components/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
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

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return <HuizeDashboard onLogout={handleLogout} />;
}

export default App;
