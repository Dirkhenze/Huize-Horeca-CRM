import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ensureUserHasCompany = async (user: User, session: any) => {
      const companyId = user.app_metadata?.company_id;
      if (!companyId) {
        try {
          const newCompanyId = crypto.randomUUID();
          const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/setup-user-company`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session?.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ companyId: newCompanyId }),
          });

          if (response.ok) {
            await supabase.auth.refreshSession();
            const { data: { session: newSession } } = await supabase.auth.getSession();
            if (newSession?.user) {
              setUser(newSession.user);
            }
          }
        } catch (err) {
          console.error('Error ensuring user has company:', err);
        }
      }
    };

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          ensureUserHasCompany(session.user, session);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Auth session error:', error);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await ensureUserHasCompany(session.user, session);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      try {
        const companyId = crypto.randomUUID();

        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/setup-user-company`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ companyId }),
        });

        if (!response.ok) {
          console.error('Failed to setup user company');
        }
      } catch (err) {
        console.error('Error setting up user company:', err);
      }
    }
  };

  const signOut = async () => {
    setUser(null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
