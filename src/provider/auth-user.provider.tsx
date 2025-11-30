'use client';

import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthUser = Session['user'];

interface AuthContextProps {
  loading: boolean;
  user: AuthUser | null;
}

const client = createClient();

const AuthUserContext = createContext<AuthContextProps>({
  loading: true,
  user: null,
});

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      setLoading(true);
    };
  }, []);

  return (
    <AuthUserContext.Provider value={{ user, loading }}>
      {children}
    </AuthUserContext.Provider>
  );
}

export function useAuthUser() {
  return useContext(AuthUserContext);
}
