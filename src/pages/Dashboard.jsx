import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import { AuthContext } from '../context/AuthContext';
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
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  FolderPlus
} from 'lucide-react';

const Dashboard = () => {
  const { works } = useContext(PortfolioContext);
  const { user } = useContext(AuthContext);

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
      icon: <FileText size={22} />,
      gradient: 'linear-gradient(135deg, #475569, #334155)',
      bgLight: 'rgba(71, 85, 105, 0.08)',
      shadowColor: 'rgba(71, 85, 105, 0.2)',
    },
    { 
      title: '能力标签', value: totalTags, 
      icon: <Tag size={22} />,
      gradient: 'linear-gradient(135deg, #64748b, #475569)',
      bgLight: 'rgba(100, 116, 139, 0.08)',
      shadowColor: 'rgba(100, 116, 139, 0.2)',
    },
    { 
      title: '适配岗位', value: totalJobs, 
      icon: <Target size={22} />,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      bgLight: 'rgba(16, 185, 129, 0.08)',
      shadowColor: 'rgba(16, 185, 129, 0.2)',
    },
    { 
      title: '待优化项', value: pendingOptWorks, 
      icon: <AlertCircle size={22} />,
      gradient: 'linear-gradient(135deg, #d97706, #b45309)',
      bgLight: 'rgba(217, 119, 6, 0.08)',
      shadowColor: 'rgba(217, 119, 6, 0.2)',
    },
  ];

  const quickLinks = [
    { name: '作品管理', desc: '上传与管理所有作品', path: '/library', icon: <Library size={22} />, gradient: 'linear-gradient(135deg, #334155, #1e293b)' },
    { name: 'AI优化', desc: '一键生成面试话术', path: '/ai', icon: <Wand2 size={22} />, gradient: 'linear-gradient(135deg, #475569, #334155)' },
    { name: '岗位匹配', desc: '寻找最适合的工作', path: '/jobs', icon: <Briefcase size={22} />, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { name: '我的作品集', desc: '精选展示给面试官', path: '/portfolio', icon: <FolderKanban size={22} />, gradient: 'linear-gradient(135deg, #0f172a, #020617)' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: '-30px', right: '-20px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', right: '100px',
          width: '150px', height: '150px', borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.05)',
        }} />
        <div style={{
          position: 'absolute', top: '20px', right: '200px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.02)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '0.05em' }}>
              PORTFOLIO DASHBOARD
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {getGreeting()}，{user?.username || '同学'} 👋
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', maxWidth: '500px', lineHeight: 1.6 }}>
            这里是你的能力大本营，把零散作品转化为可展示、可讲述、可投递的求职作品集。
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {statCards.map((stat, idx) => (
          <div key={idx} style={{
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.6)',
            transition: 'all 0.3s ease',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 12px 30px ${stat.shadowColor}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{
              position: 'absolute', top: '-15px', right: '-15px',
              width: '80px', height: '80px', borderRadius: '50%',
              background: stat.bgLight,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: stat.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                boxShadow: `0 4px 12px ${stat.shadowColor}`,
              }}>
                {stat.icon}
              </div>
              <TrendingUp size={16} style={{ color: '#94a3b8' }} />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '4px' }}>{stat.title}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>快捷入口</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {quickLinks.map((link, idx) => (
            <Link key={idx} to={link.path} style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.6)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: link.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}>
                  {link.icon}
                </div>
                <ArrowUpRight size={16} style={{ color: '#94a3b8' }} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{link.name}</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Works */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>最近更新作品</h2>
          <Link to="/library" style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            查看全部 <ChevronRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {works.slice(0, 4).map((work) => (
            <div key={work.id} style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.6)',
              borderLeft: '4px solid',
              borderImage: 'linear-gradient(180deg, #334155, #64748b) 1',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%', color: '#1e293b' }} title={work.title}>{work.title}</h3>
                <span style={{
                  padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600,
                  background: 'rgba(51, 65, 85, 0.08)',
                  color: '#334155', border: '1px solid rgba(51, 65, 85, 0.15)',
                }}>{work.type}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem' }}>
                {work.background || '暂无描述'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                {work.tags?.slice(0, 3).map((tag, idx) => (
                  <span key={idx} style={{
                    padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 500,
                    background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0'
                  }}>{tag}</span>
                ))}
                {work.tags?.length > 3 && <span style={{ padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 500, background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>+{work.tags.length - 3}</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>完成于 {work.date || '—'}</span>
                <Link to={`/details/${work.id}`} style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600, textDecoration: 'none' }}>查看详情</Link>
              </div>
            </div>
          ))}
          {works.length === 0 && (
            <div style={{
              gridColumn: 'span 2',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '1.25rem',
              padding: '3rem',
              textAlign: 'center',
              color: '#94a3b8',
              border: '2px dashed #e2e8f0',
            }}>
              <FolderPlus size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p style={{ fontSize: '1rem' }}>还没有任何作品，快去作品库添加吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
