import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, WS_BASE_URL } from '../api/client';
import { useAuth } from './AuthContext';

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  latestToast: NotificationItem | null;
  dismissToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [latestToast, setLatestToast] = useState<NotificationItem | null>(null);
  const token = localStorage.getItem('krishi_auth_token');

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const list = await apiFetch<NotificationItem[]>('/notifications');
      setNotifications(list);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Poll periodically
      const interval = setInterval(fetchNotifications, 8000);

      // WebSocket live subscriber
      let ws: WebSocket | null = null;
      try {
        ws = new WebSocket(`${WS_BASE_URL}/ws/notifications/${user.id}?token=${encodeURIComponent(token || '')}`);
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLatestToast(data);
            fetchNotifications();
          } catch (e) {
            console.error('WS message parse error', e);
          }
        };
      } catch (e) {
        console.warn('WS notification connection error', e);
      }

      return () => {
        clearInterval(interval);
        if (ws) ws.close();
      };
    }
  }, [user?.id]);

  const markAsRead = async (id: number) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'POST' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Mark notification read failed:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiFetch('/notifications/read-all', { method: 'POST' });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Mark all read failed:', err);
    }
  };

  const dismissToast = () => setLatestToast(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        latestToast,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
