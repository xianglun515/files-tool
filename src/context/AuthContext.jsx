import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

const API_BASE = '/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 通用请求函数
  const authFetch = useCallback(async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || '请求失败');
    }
    return data;
  }, [token]);

  // 启动时检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await authFetch(`${API_BASE}/me`);
        setUser(data.user);
      } catch (err) {
        // token 无效，清除
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, [token, authFetch]);

  // 注册
  const register = async (username, email, password) => {
    setError('');
    try {
      const data = await authFetch(`${API_BASE}/register`, {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      localStorage.setItem('auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // 登录
  const login = async (email, password) => {
    setError('');
    try {
      const data = await authFetch(`${API_BASE}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // 退出登录
  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
      setError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
