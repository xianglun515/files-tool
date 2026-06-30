import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import { AuthContext } from '../context/AuthContext';
import { SubscriptionContext } from '../context/SubscriptionContext';
import { 
  FileText, 
  Tag, 
  Target, 
  AlertCircle,
  Briefcase,
  Library,
  Wand2,
  FolderKanban,
  ChevronRight,
  FolderPlus,
  Crown
} from 'lucide-react';

const Dashboard = () => {
  const { works } = useContext(PortfolioContext);
  const { user } = useContext(AuthContext);
  const { plan, remainingToday, dailyLimit } = useContext(SubscriptionContext);

  const totalWorks = works.length;
  const uniqueTags = new Set();
  works.forEach(w => w.tags?.forEach(tag => uniqueTags.add(tag)));
  const totalTags = uniqueTags.size;

  const uniqueJobs = new Set();
  works.forEach(w => w.jobs?.forEach(job => uniqueJobs.add(job)));
  const totalJobs = uniqueJobs.size;

  const pendingOptWorks = works.filter(w => !w.optimized).length;

  const statCards = [
    { 
      title: '作品总数', value: totalWorks, 
      icon: <FileText size={20} strokeWidth={1.5} />,
    },
    { 
      title: '能力标签', value: totalTags, 
      icon: <Tag size={20} strokeWidth={1.5} />,
    },
    { 
      title: '适配岗位', value: totalJobs, 
      icon: <Target size={20} strokeWidth={1.5} />,
    },
    { 
      title: '待优化项', value: pendingOptWorks, 
      icon: <AlertCircle size={20} strokeWidth={1.5} />,
    },
  ];

  const quickLinks = [
    { name: '作品管理', desc: '上传与管理所有作品', path: '/library', icon: <Library size={22} strokeWidth={1.5} /> },
    { name: '智能提取', desc: '提炼面试话术', path: '/ai', icon: <Wand2 size={22} strokeWidth={1.5} /> },
    { name: '岗位匹配', desc: '寻找最适合的工作', path: '/jobs', icon: <Briefcase size={22} strokeWidth={1.5} /> },
    { name: '我的作品集', desc: '精选展示给面试官', path: '/portfolio', icon: <FolderKanban size={22} strokeWidth={1.5} /> },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const premiumCardStyle = {
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.015)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      {/* Welcome Banner */}
      <div style={{
        ...premiumCardStyle,
        padding: '3rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '14px', background: '#111', borderRadius: '2px' }} />
          <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Portfolio Dashboard
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '-0.03em', color: '#111' }}>
          {getGreeting()}, {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}.
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#666', maxWidth: '540px', lineHeight: 1.6, fontWeight: 400 }}>
          这里是您的能力大本营。以极简的结构，将零散的作品转化为专业、可展示的求职作品集。
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card" style={{
              background: 'linear-gradient(135deg, white 0%, #f8fafc 100%)',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: '20px', padding: '24px',
              display: 'flex', alignItems: 'center', gap: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, bottom: 0, width: '4px',
                background: `linear-gradient(to bottom, var(--primary-color), #a855f7)`
              }} />
              <div style={{
                width: '54px', height: '54px', borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(0,113,227,0.1), rgba(168,85,247,0.1))',
                color: 'var(--primary-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5)'
              }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>
                  {stat.title}
                </p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                  {stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* 套餐状态卡片 */}
        <div style={{
          background: plan === 'pro' 
            ? 'linear-gradient(135deg, #1e293b, #0f172a)' 
            : 'white',
          borderRadius: '20px', padding: '24px 32px', marginBottom: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: plan === 'pro' ? 'none' : '1px solid #e2e8f0',
          boxShadow: plan === 'pro' ? '0 10px 25px -5px rgba(0,0,0,0.1)' : '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: plan === 'pro' ? 'rgba(168,85,247,0.2)' : '#f1f5f9',
              color: plan === 'pro' ? '#a855f7' : '#64748b',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Crown size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: plan === 'pro' ? 'white' : '#1e293b', marginBottom: '4px' }}>
                {plan === 'pro' ? '专业版 (Pro)' : '基础版 (Free)'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: plan === 'pro' ? '#94a3b8' : '#64748b' }}>
                {plan === 'pro' 
                  ? '已解锁无限次高级 AI 生成功能' 
                  : `今日 AI 剩余次数：${remainingToday} / ${dailyLimit}`}
              </p>
            </div>
          </div>
          <Link to="/pricing" style={{
            background: plan === 'pro' ? 'transparent' : '#1e293b',
            color: plan === 'pro' ? '#94a3b8' : 'white',
            padding: '10px 20px', borderRadius: '10px',
            fontSize: '0.9rem', fontWeight: 600, border: plan === 'pro' ? '1px solid #334155' : 'none',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            {plan === 'pro' ? '查看套餐详情' : '升级专业版'} <ChevronRight size={16} />
          </Link>
        </div>

      {/* Quick Links */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 500, marginBottom: '1.5rem', color: '#111', letterSpacing: '-0.01em' }}>快捷入口</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {quickLinks.map((link, idx) => (
            <Link key={idx} to={link.path} style={{
              ...premiumCardStyle,
              padding: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1.25rem',
              textDecoration: 'none', color: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.015)';
            }}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: '#f8f9fa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#111',
                border: '1px solid rgba(0,0,0,0.03)',
              }}>
                {link.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#111', marginBottom: '4px' }}>{link.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Works */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 500, color: '#111', letterSpacing: '-0.01em' }}>最近更新作品</h2>
          <Link to="/library" style={{ fontSize: '0.85rem', color: '#666', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#111'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            查看全部 <ChevronRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {works.slice(0, 4).map((work) => (
            <div key={work.id} style={{
              ...premiumCardStyle,
              padding: '1.75rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 500, fontSize: '1.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%', color: '#111', letterSpacing: '-0.01em' }} title={work.title}>{work.title}</h3>
                <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: '#f5f5f5', color: '#555', border: '1px solid rgba(0,0,0,0.04)' }}>
                  {work.type}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.7rem', lineHeight: 1.5 }}>
                {work.background || '暂无项目描述。'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {work.tags?.slice(0, 3).map((tag, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', color: '#111', background: '#fff', border: '1px solid #e0e0e0', padding: '3px 10px', borderRadius: '6px' }}>
                    {tag}
                  </span>
                ))}
                {work.tags?.length > 3 && (
                  <span style={{ fontSize: '0.75rem', color: '#888', padding: '3px 6px' }}>
                    +{work.tags.length - 3}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '0.8rem', color: '#999' }}>{work.date || '—'}</span>
                <Link to={`/details/${work.id}`} style={{ fontSize: '0.85rem', color: '#111', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: '1px' }}>
                  查看详情
                </Link>
              </div>
            </div>
          ))}
          {works.length === 0 && (
            <div style={{
              ...premiumCardStyle,
              gridColumn: 'span 2',
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FolderPlus size={24} color="#999" strokeWidth={1.5} />
              </div>
              <p style={{ fontSize: '1rem', color: '#666' }}>暂无作品，前往作品库开始您的创作之旅。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
