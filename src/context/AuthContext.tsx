import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import api, { setApiToken } from '@/api/client';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AppUser | null;
  profile: Record<string, unknown> | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: AppUser) => void;
  signup: (token: string, user: AppUser) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const tokenKey = 'ai-ip-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(tokenKey));
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setApiToken(token);
    if (!token) {
      setLoading(false);
      return;
    }

    localStorage.setItem(tokenKey, token);
    void refreshSession();
  }, [token]);

  async function refreshSession() {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      setProfile(response.data.profile ?? null);
    } catch {
      setUser(null);
      setProfile(null);
      setToken(null);
      localStorage.removeItem(tokenKey);
    } finally {
      setLoading(false);
    }
  }

  function login(nextToken: string, nextUser: AppUser) {
    setToken(nextToken);
    setUser(nextUser);
  }

  function signup(nextToken: string, nextUser: AppUser) {
    setToken(nextToken);
    setUser(nextUser);
  }

  function logout() {
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem(tokenKey);
    setApiToken(null);
  }

  const value = useMemo(
    () => ({ user, profile, token, loading, login, signup, logout, refreshSession }),
    [user, profile, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}