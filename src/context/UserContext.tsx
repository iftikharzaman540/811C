"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  phone?: string;
  email?: string;
  balance: number;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  current_wagering_requirement?: number;
  current_wagering_completed?: number;
  today_withdrawals_count?: number;
  available_spins?: number;
  bonus_balance?: number;
  has_claimed_promotion?: boolean;
  [key: string]: any;
};


type UserContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  notifications: any[];
  unreadNotifCount: number;
  markNotifRead: (id: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const API_URL = "https://8111c.com/api/v1";
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (e) {}
  };

  useEffect(() => {
    if (user) {
      fetchNotifs();
      const intv = setInterval(fetchNotifs, 15000);
      return () => clearInterval(intv);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const markNotifRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://8111c.com/api/v1/notifications/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {}
  };

  const unreadNotifCount = notifications.filter(n => !n.is_read).length;

  const refreshUser = async () => {

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const API_URL = "https://8111c.com/api/v1";
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refreshUser, notifications, unreadNotifCount, markNotifRead }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

