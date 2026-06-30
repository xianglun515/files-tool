import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../config/supabase';

export const SubscriptionContext = createContext();

const FREE_DAILY_LIMIT = 3;

export const SubscriptionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [plan, setPlan] = useState('free');
  const [todayUsage, setTodayUsage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState(null);

  // 获取订阅状态和今日用量
  const fetchStatus = useCallback(async () => {
    if (!user) {
      setPlan('free');
      setTodayUsage(0);
      setLoading(false);
      return;
    }

    try {
      // 并行获取订阅状态和今日用量
      const [subRes, usageRes] = await Promise.all([
        supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('ai_usage').select('*').eq('user_id', user.id).eq('used_date', new Date().toISOString().split('T')[0]).maybeSingle(),
      ]);

      if (subRes.data) {
        // 检查是否过期
        const expired = subRes.data.expires_at && new Date(subRes.data.expires_at) < new Date();
        setPlan(expired ? 'free' : subRes.data.plan);
        setExpiresAt(subRes.data.expires_at);
      } else {
        setPlan('free');
      }

      setTodayUsage(usageRes.data?.count || 0);
    } catch (err) {
      console.error('获取订阅状态失败:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // 检查是否还能使用 AI
  const canUseAI = plan === 'pro' || todayUsage < FREE_DAILY_LIMIT;
  const remainingToday = plan === 'pro' ? Infinity : Math.max(0, FREE_DAILY_LIMIT - todayUsage);

  // 增加今日使用计数
  const incrementUsage = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    
    // 尝试更新，如果不存在则插入
    const { data: existing } = await supabase
      .from('ai_usage')
      .select('id, count')
      .eq('user_id', user.id)
      .eq('used_date', today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('ai_usage')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('ai_usage')
        .insert({ user_id: user.id, used_date: today, count: 1 });
    }
    
    setTodayUsage(prev => prev + 1);
  };

  // 模拟升级到 Pro
  const upgradeToPro = async () => {
    if (!user) return { success: false };
    
    const expiresDate = new Date();
    expiresDate.setMonth(expiresDate.getMonth() + 1); // 一个月后过期

    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    let result;
    if (existing) {
      result = await supabase
        .from('subscriptions')
        .update({ plan: 'pro', started_at: new Date().toISOString(), expires_at: expiresDate.toISOString() })
        .eq('id', existing.id);
    } else {
      result = await supabase
        .from('subscriptions')
        .insert({ user_id: user.id, plan: 'pro', expires_at: expiresDate.toISOString() });
    }

    if (result.error) {
      console.error('升级失败:', result.error);
      return { success: false, message: result.error.message };
    }

    setPlan('pro');
    setExpiresAt(expiresDate.toISOString());
    return { success: true };
  };

  // 模拟降级到 Free
  const downgradeToFree = async () => {
    if (!user) return;
    await supabase
      .from('subscriptions')
      .update({ plan: 'free', expires_at: null })
      .eq('user_id', user.id);
    
    setPlan('free');
    setExpiresAt(null);
  };

  return (
    <SubscriptionContext.Provider value={{
      plan,
      todayUsage,
      canUseAI,
      remainingToday,
      dailyLimit: FREE_DAILY_LIMIT,
      loading,
      expiresAt,
      upgradeToPro,
      downgradeToFree,
      incrementUsage,
      refreshStatus: fetchStatus,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
