'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const getCookieToken = () => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('auth_token='));
  return match ? match.split('=')[1] : null;
};

const setAuthToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  document.cookie = `auth_token=${token}; path=/; max-age=${604800}`; // 7 hari
};

const clearAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  document.cookie = 'auth_token=; path=/; max-age=0';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    const token = localStorage.getItem('token') || getCookieToken();
    return Boolean(token);
  });

  useEffect(() => {
    const token = localStorage.getItem('token') || getCookieToken();
    if (!token) return;

    setAuthToken(token);
    api.get('/auth/profile')
      .then(res => setUser(res.data))
      .catch(() => clearAuthToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    setAuthToken(res.data.access_token);
    setUser(res.data.user);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);