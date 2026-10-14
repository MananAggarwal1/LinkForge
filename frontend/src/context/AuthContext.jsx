import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted session on initial mount
    const savedToken = localStorage.getItem('linkforge_token');
    const savedUser = localStorage.getItem('linkforge_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('linkforge_token');
        localStorage.removeItem('linkforge_user');
      }
    }
    setLoading(false);

    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('linkforge_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('linkforge_auth_expired', handleAuthExpired);
  }, []);

  const login = async (usernameOrEmail, password) => {
    const response = await api.post('/api/auth/login', {
      usernameOrEmail,
      password,
    });

    const data = response.data;
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
    };

    localStorage.setItem('linkforge_token', data.token);
    localStorage.setItem('linkforge_user', JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
    return data;
  };

  const register = async (username, email, password, fullName) => {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
      fullName,
    });

    const data = response.data;
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
    };

    localStorage.setItem('linkforge_token', data.token);
    localStorage.setItem('linkforge_user', JSON.stringify(userData));

    setToken(data.token);
    setUser(userData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('linkforge_token');
    localStorage.removeItem('linkforge_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
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
