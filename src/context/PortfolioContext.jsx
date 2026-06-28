import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const PortfolioContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/works`
  : '/api/works';

export const PortfolioProvider = ({ children }) => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useContext(AuthContext);

  // 通用请求函数，携带 Token
  const apiFetch = useCallback(async (url, options = {}) => {
    if (!token) throw new Error('未登录');
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }
    return data;
  }, [token]);

  // 加载作品列表
  const fetchWorks = useCallback(async () => {
    if (!user) {
      setWorks([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await apiFetch(API_BASE);
      // 将 _id 映射为 id 以兼容现有前端代码
      const mappedData = data.map(w => ({ ...w, id: w._id }));
      setWorks(mappedData);
    } catch (error) {
      console.error('获取作品失败:', error);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, user]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const addWork = async (work) => {
    try {
      const data = await apiFetch(API_BASE, {
        method: 'POST',
        body: JSON.stringify(work)
      });
      const newWork = { ...data, id: data._id };
      setWorks([newWork, ...works]);
      return { success: true, data: newWork };
    } catch (error) {
      console.error('添加作品失败:', error);
      return { success: false, message: error.message };
    }
  };

  const updateWork = async (id, updatedData) => {
    try {
      const data = await apiFetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });
      const updated = { ...data, id: data._id };
      setWorks(works.map(w => w.id === id ? updated : w));
      return { success: true, data: updated };
    } catch (error) {
      console.error('更新作品失败:', error);
      return { success: false, message: error.message };
    }
  };

  const deleteWork = async (id) => {
    try {
      await apiFetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });
      setWorks(works.filter(w => w.id !== id));
      return { success: true };
    } catch (error) {
      console.error('删除作品失败:', error);
      return { success: false, message: error.message };
    }
  };

  const togglePortfolio = async (id) => {
    const work = works.find(w => w.id === id);
    if (!work) return;
    return updateWork(id, { addedToPortfolio: !work.addedToPortfolio });
  };

  return (
    <PortfolioContext.Provider value={{
      works,
      loading,
      addWork,
      updateWork,
      deleteWork,
      togglePortfolio,
      refreshWorks: fetchWorks
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
