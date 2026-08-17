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
  logout: () => void;
  switchDemoUser: (userId: number) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('krishi_auth_token'));
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load demo users & current user profile
  const fetchDemoUsersAndMe = async () => {
    try {
      const users = await apiFetch<User[]>('/auth/demo-users');
      setDemoUsers(users);

      if (token) {
        try {
          const me = await apiFetch<User>('/auth/me');
          setUser(me);
        } catch {
          // Token expired or invalid, fallback to Ramesh Patil
          if (users.length > 0) {
            await switchDemoUser(users[0].id);
          }
        }
      } else if (users.length > 0) {
        // Auto initialize with Ramesh Patil (Farmer)
        await switchDemoUser(users[0].id);
      }
    } catch (err) {
      console.error('Failed to initialize auth state:', err);
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
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoUser = async (userId: number) => {
    setIsLoading(true);
    try {
      const res = await apiFetch<{ access_token: string; user: User }>(`/auth/switch-demo/${userId}`, {
        method: 'POST',
      });
      localStorage.setItem('krishi_auth_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } catch (err) {
      console.error('Error switching demo persona:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('krishi_auth_token');
    setToken(null);
    if (demoUsers.length > 0) {
      setUser(demoUsers[0]);
    }
  };

  const refreshUser = async () => {
    if (token) {
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
