import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: 'farmer' | 'merchant' | 'transporter' | 'seller' | 'admin';
  location: string;
  district?: string;
  state: string;
  trust_score: number;
  total_deals: number;
  verified: boolean;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  demoUsers: User[];
  isLoading: boolean;
  login: (phoneOrEmail: string, pass: string) => Promise<void>;
  loginWithRole: (role: 'farmer' | 'merchant' | 'transporter' | 'seller' | 'admin') => Promise<void>;
  logout: () => void;
  switchDemoUser: (userId: number) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const DEFAULT_DEMO_USERS: User[] = [
  {
    id: 1,
    name: 'Ramesh Patil',
    phone: '9876543210',
    email: 'ramesh.patil@farmchain.org',
    role: 'farmer',
    location: 'Dindori, Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    trust_score: 4.9,
    total_deals: 18,
    verified: true,
    avatar_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'
  },
  {
    id: 4,
    name: 'Suresh Agrawal (Suresh Agro Traders)',
    phone: '9876543220',
    email: 'suresh.traders@farmchain.org',
    role: 'merchant',
    location: 'Vashi APMC Market, Navi Mumbai',
    district: 'Thane',
    state: 'Maharashtra',
    trust_score: 4.9,
    total_deals: 42,
    verified: true,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 7,
    name: 'Balwinder Singh Logistics',
    phone: '9876543230',
    email: 'balwinder.transport@farmchain.org',
    role: 'transporter',
    location: 'Nashik-Pune Highway Transport Hub',
    district: 'Nashik',
    state: 'Maharashtra',
    trust_score: 4.95,
    total_deals: 68,
    verified: true,
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'
  },
  {
    id: 9,
    name: 'Dr. Aniruddha Joshi (Maha Krishi Seva Kendra)',
    phone: '9876543240',
    email: 'joshi.krishi@farmchain.org',
    role: 'seller',
    location: 'Panchavati, Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    trust_score: 4.9,
    total_deals: 120,
    verified: true,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 10,
    name: 'Krishi Connect Platform Admin',
    phone: '9999999999',
    email: 'admin@farmchain.org',
    role: 'admin',
    location: 'National Agri-Tech Operations Center',
    district: 'Pune',
    state: 'Maharashtra',
    trust_score: 5.0,
    total_deals: 0,
    verified: true,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('krishi_auth_token'));
  const [demoUsers, setDemoUsers] = useState<User[]>(DEFAULT_DEMO_USERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load demo users & check active user session
  const fetchDemoUsersAndMe = async () => {
    try {
      const users = await apiFetch<User[]>('/auth/demo-users');
      if (users && users.length > 0) {
        setDemoUsers(users);
      }

      if (token) {
        if (token.startsWith('mock_token_')) {
          const userIdStr = token.replace('mock_token_', '');
          const fallback = demoUsers.find((u) => u.id === Number(userIdStr)) || DEFAULT_DEMO_USERS[0];
          setUser(fallback);
        } else {
          try {
            const me = await apiFetch<User>('/auth/me');
            setUser(me);
          } catch {
            // Token expired or server unreachable
            const savedFallback = DEFAULT_DEMO_USERS[0];
            setUser(savedFallback);
          }
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('API unreachable during init, using default persona data:', err);
      if (token && token.startsWith('mock_token_')) {
        const userIdStr = token.replace('mock_token_', '');
        const fallback = DEFAULT_DEMO_USERS.find((u) => u.id === Number(userIdStr)) || DEFAULT_DEMO_USERS[0];
        setUser(fallback);
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoUsersAndMe();
  }, []);

  const login = async (phoneOrEmail: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await apiFetch<{ access_token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone_or_email: phoneOrEmail, password: pass }),
      });
      localStorage.setItem('krishi_auth_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } catch (err) {
      console.warn('Backend login unavailable, falling back to matching demo persona:', err);
      const match = demoUsers.find((u) => u.phone === phoneOrEmail || u.email === phoneOrEmail) ||
        DEFAULT_DEMO_USERS.find((u) => u.phone === phoneOrEmail) ||
        DEFAULT_DEMO_USERS[0];
      const mockToken = `mock_token_${match.id}`;
      localStorage.setItem('krishi_auth_token', mockToken);
      setToken(mockToken);
      setUser(match);
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoUser = async (userId: number) => {
    setIsLoading(true);
    const fallbackUser = demoUsers.find((u) => u.id === userId) ||
      DEFAULT_DEMO_USERS.find((u) => u.id === userId) ||
      DEFAULT_DEMO_USERS[0];

    try {
      const res = await apiFetch<{ access_token: string; user: User }>(`/auth/switch-demo/${userId}`, {
        method: 'POST',
      });
      localStorage.setItem('krishi_auth_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } catch (err) {
      console.warn('API switch demo failed, switching persona locally:', err);
      const mockToken = `mock_token_${fallbackUser.id}`;
      localStorage.setItem('krishi_auth_token', mockToken);
      setToken(mockToken);
      setUser(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithRole = async (role: 'farmer' | 'merchant' | 'transporter' | 'seller' | 'admin') => {
    const match = demoUsers.find((u) => u.role === role) ||
      DEFAULT_DEMO_USERS.find((u) => u.role === role);
    if (match) {
      await switchDemoUser(match.id);
    } else {
      const fallbackUser: User = {
        id: Date.now(),
        name: `Demo ${role.toUpperCase()}`,
        phone: '9876543200',
        role,
        location: 'Nashik, Maharashtra',
        state: 'Maharashtra',
        trust_score: 4.9,
        total_deals: 10,
        verified: true,
      };
      setUser(fallbackUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('krishi_auth_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      if (token.startsWith('mock_token_')) return;
      try {
        const me = await apiFetch<User>('/auth/me');
        setUser(me);
      } catch (err) {
        console.error('Refresh user error:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        demoUsers,
        isLoading,
        login,
        loginWithRole,
        logout,
        switchDemoUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
