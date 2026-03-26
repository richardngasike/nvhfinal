'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('nvh_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    setToken(storedToken);
    try {
      const data = await authAPI.getProfile();
      setUser(data.user);
    } catch {
      localStorage.removeItem('nvh_token');
      localStorage.removeItem('nvh_user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = (data) => {
    localStorage.setItem('nvh_token', data.token);
    localStorage.setItem('nvh_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('nvh_token');
    localStorage.removeItem('nvh_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('nvh_user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user;
  const isLandlord = user?.role === 'LANDLORD' || user?.role === 'ADMIN';
  const isTenant = user?.role === 'TENANT';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, logout, updateUser,
      isAuthenticated, isLandlord, isTenant, isAdmin,
      refreshUser: loadUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
