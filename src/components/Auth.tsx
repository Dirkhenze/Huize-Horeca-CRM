import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Auth() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isResetPassword) {
        await resetPassword(email);
        setSuccess('Wachtwoord reset link is verstuurd naar je email!');
        setEmail('');
      } else if (isSignUp) {
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 huize-gradient opacity-95"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(227, 6, 19, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 71, 186, 0.15) 0%, transparent 50%)'
      }}></div>

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="huize-red p-6 text-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg mb-4">
              <img src="/HH logo wit.png" alt="Huize Horeca" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Huize Horeca</h1>
            <p className="text-white text-opacity-90 text-sm">
              {isResetPassword ? 'Wachtwoord vergeten' : isSignUp ? 'Maak een account aan' : 'Welkom terug'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r text-sm">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="naam@huizehoreca.nl"
            />
          </div>

          {!isResetPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 huize-primary hover:huize-hover shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              'Bezig...'
            ) : isResetPassword ? (
              'Reset Link Versturen'
            ) : isSignUp ? (
              <>
                <UserPlus className="w-5 h-5" />
                Account Aanmaken
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Inloggen
              </>
            )}
          </button>
        </form>

        <div className="px-8 pb-8 pt-0 text-center border-t border-slate-100">
          <div className="pt-6 space-y-3">
            {!isResetPassword && !isSignUp && (
              <button
                type="button"
                onClick={() => {
                  setIsResetPassword(true);
                  setError('');
                  setSuccess('');
                }}
                className="huize-text-primary hover:huize-text-red text-sm font-semibold transition-colors block w-full"
              >
                Wachtwoord vergeten?
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (isResetPassword) {
                  setIsResetPassword(false);
                } else {
                  setIsSignUp(!isSignUp);
                }
                setError('');
                setSuccess('');
              }}
              className="huize-text-primary hover:huize-text-red text-sm font-semibold transition-colors block w-full"
            >
              {isResetPassword ? '← Terug naar inloggen' : isSignUp ? '← Terug naar inloggen' : 'Nog geen account? Aanmelden →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
