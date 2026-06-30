import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { Shield, Trash2, Crown, ZapOff, Users, Database } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAdmin, loading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, totalWorks: 0 });
  const [isFetching, setIsFetching] = useState(true);

  const fetchAdminData = async () => {
    setIsFetching(true);
    try {
      // 1. Fetch user profiles
      const { data: profiles, error: profErr } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profErr) throw profErr;

      // 2. Fetch subscriptions
      const { data: subs } = await supabase.from('subscriptions').select('*');
      
      // 3. Fetch today's usage
      const today = new Date().toISOString().split('T')[0];
      const { data: usage } = await supabase.from('ai_usage').select('*').eq('used_date', today);

      // 4. Fetch works count per user (approximate using aggregation or just simple count if small)
      const { data: works } = await supabase.from('works').select('user_id');

      const mergedUsers = profiles.map(p => {
        const sub = subs?.find(s => s.user_id === p.id);
        const expired = sub?.expires_at && new Date(sub.expires_at) < new Date();
        const plan = (sub && !expired) ? sub.plan : 'free';
        
        const use = usage?.find(u => u.user_id === p.id);
        const workCount = works?.filter(w => w.user_id === p.id).length || 0;

        return {
          ...p,
          plan,
          todayUsage: use?.count || 0,
          workCount
        };
      });

      setUsers(mergedUsers);
      setStats({
        totalUsers: mergedUsers.length,
        proUsers: mergedUsers.filter(u => u.plan === 'pro').length,
        totalWorks: works?.length || 0
      });

    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      alert("获取管理数据失败: " + err.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const grantPro = async (userId) => {
    if (!window.confirm("确定要赠送 Pro 专业版一个月吗？")) return;
    const expiresDate = new Date();
    expiresDate.setMonth(expiresDate.getMonth() + 1);
    
    // Check if sub exists
    const { data: existing } = await supabase.from('subscriptions').select('id').eq('user_id', userId).maybeSingle();
    
    if (existing) {
      await supabase.from('subscriptions').update({ plan: 'pro', expires_at: expiresDate.toISOString() }).eq('id', existing.id);
    } else {
      await supabase.from('subscriptions').insert({ user_id: userId, plan: 'pro', expires_at: expiresDate.toISOString() });
    }
    fetchAdminData();
  };

  const revokePro = async (userId) => {
    if (!window.confirm("确定要取消该用户的 Pro 专业版吗？")) return;
    await supabase.from('subscriptions').update({ plan: 'free', expires_at: null }).eq('user_id', userId);
    fetchAdminData();
  };

  const resetUsage = async (userId) => {
    if (!window.confirm("确定要重置该用户今天的 AI 使用次数吗？")) return;
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('ai_usage').delete().eq('user_id', userId).eq('used_date', today);
    fetchAdminData();
  };

  const clearUserData = async (userId) => {
    if (!window.confirm("🚨 危险操作！\n确定要清空该用户的所有作品数据吗？此操作不可逆！")) return;
    await supabase.from('works').delete().eq('user_id', userId);
    fetchAdminData();
  };

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: '#ef4444', color: 'white', padding: '10px', borderRadius: '12px' }}>
          <Shield size={24} />
        </div>
        <div>
          <h2>系统管理员后台</h2>
          <p style={{ color: '#ef4444', fontWeight: 500 }}>最高权限模式，请谨慎操作</p>
        </div>
      </div>

      {/* Stats Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
        <StatCard icon={<Users />} title="总注册用户" value={stats.totalUsers} color="#3b82f6" />
        <StatCard icon={<Crown />} title="Pro 专业版用户" value={stats.proUsers} color="#a855f7" />
        <StatCard icon={<Database />} title="平台总作品数" value={stats.totalWorks} color="#10b981" />
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>用户管理名单</h3>
          <button onClick={fetchAdminData} style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600 }}>
            {isFetching ? '刷新中...' : '↻ 刷新数据'}
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>账号 / 邮箱</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>当前套餐</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>今日 AI 用量</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>作品数</th>
                <th style={{ padding: '16px 24px', fontWeight: 500, textAlign: 'right' }}>管理操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.username || '未设置昵称'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {u.plan === 'pro' 
                      ? <span className="chip" style={{ background: '#f3e8ff', color: '#9333ea', border: '1px solid #d8b4fe' }}><Crown size={12} style={{marginRight:'4px'}}/> 专业版</span> 
                      : <span className="chip chip-secondary">基础版</span>}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontWeight: 600, color: u.todayUsage >= 3 && u.plan !== 'pro' ? '#ef4444' : 'inherit' }}>
                      {u.todayUsage} 次
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 500 }}>{u.workCount}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {u.plan === 'free' ? (
                        <button onClick={() => grantPro(u.id)} className="admin-btn" style={{ background: '#f3e8ff', color: '#9333ea' }}>赠送 Pro</button>
                      ) : (
                        <button onClick={() => revokePro(u.id)} className="admin-btn" style={{ background: '#f1f5f9', color: '#64748b' }}>取消 Pro</button>
                      )}
                      <button onClick={() => resetUsage(u.id)} className="admin-btn" title="重置今日用量"><ZapOff size={14}/></button>
                      <button onClick={() => clearUserData(u.id)} className="admin-btn" style={{ color: '#ef4444', background: '#fef2f2' }} title="清空该用户所有作品"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !isFetching && (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>暂无用户数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .admin-btn {
          padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;
          border: none; cursor: pointer; display: flex; items: center; justify-content: center;
          transition: all 0.2s;
        }
        .admin-btn:hover { filter: brightness(0.95); transform: translateY(-1px); }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{value}</div>
    </div>
  </div>
);

export default AdminDashboard;
