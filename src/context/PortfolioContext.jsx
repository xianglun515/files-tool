import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../config/supabase';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // 加载作品列表
  const fetchWorks = useCallback(async () => {
    if (!user) {
      setWorks([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) throw error;
      setWorks(data || []);
    } catch (error) {
      console.error('获取作品失败:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const addWork = async (work) => {
    if (!user) return { success: false, message: "未登录" };
    try {
      const { data, error } = await supabase
        .from('works')
        .insert([{ ...work, user_id: user.id }])
        .select()
        .single();
        
      if (error) throw error;
      setWorks([data, ...works]);
      return { success: true, data };
    } catch (error) {
      console.error('添加作品失败:', error);
      return { success: false, message: error.message };
    }
  };

  const updateWork = async (id, updatedData) => {
    try {
      const { data, error } = await supabase
        .from('works')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      setWorks(works.map(w => w.id === id ? data : w));
      return { success: true, data };
    } catch (error) {
      console.error('更新作品失败:', error);
      return { success: false, message: error.message };
    }
  };

  const deleteWork = async (id) => {
    try {
      const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
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
