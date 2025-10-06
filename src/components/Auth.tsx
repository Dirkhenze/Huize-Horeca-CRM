import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Auth() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 huize-primary">
            <span className="text-2xl font-bold text-white">HH</span>
          </div>
          <h1 className="text-3xl font-bold huize-text-primary mb-2">Huize Horeca</h1>
          <p className="text-slate-600">
            {isSignUp ? 'Maak een account aan' : 'Inloggen op uw account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="naam@huizehoreca.nl"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 huize-primary hover:huize-hover"
          >
            {loading ? (
              'Bezig...'
            ) : isSignUp ? (
              <>
                <UserPlus className="w-5 h-5" />
                Aanmelden
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Inloggen
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="huize-text-primary hover:underline text-sm font-medium transition"
          >
            {isSignUp ? 'Heeft u al een account? Inloggen' : 'Nog geen account? Aanmelden'}
          </button>
        </div>
      </div>
    </div>
  );
}
