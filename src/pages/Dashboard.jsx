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
      color: 'var(--primary-color)',
      bgLight: 'rgba(0, 113, 227, 0.1)',
    },
    { 
      title: '能力标签', value: totalTags, 
      icon: <Tag size={22} />,
      color: '#af52de', // Apple Purple
      bgLight: 'rgba(175, 82, 222, 0.1)',
    },
    { 
      title: '适配岗位', value: totalJobs, 
      icon: <Target size={22} />,
      color: 'var(--accent-color)',
      bgLight: 'rgba(52, 199, 89, 0.1)',
    },
    { 
      title: '待优化项', value: pendingOptWorks, 
      icon: <AlertCircle size={22} />,
      color: 'var(--accent-warm)',
      bgLight: 'rgba(255, 149, 0, 0.1)',
    },
  ];

  const quickLinks = [
    { name: '作品管理', desc: '上传与管理所有作品', path: '/library', icon: <Library size={24} />, color: 'var(--primary-color)' },
    { name: '话术生成', desc: '智能提取面试话术', path: '/ai', icon: <Wand2 size={24} />, color: '#af52de' },
    { name: '岗位匹配', desc: '寻找最适合的工作', path: '/jobs', icon: <Briefcase size={24} />, color: 'var(--accent-color)' },
    { name: '我的作品集', desc: '精选展示给面试官', path: '/portfolio', icon: <FolderKanban size={24} />, color: 'var(--accent-warm)' },
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
      <div className="card" style={{
        padding: '2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        border: 'none',
        background: 'rgba(255, 255, 255, 0.8)',
      }}>
        {/* Subtle background glow instead of harsh shapes */}
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%',
          width: '60%', height: '200%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 113, 227, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Portfolio Dashboard
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            {getGreeting()}，{user?.username || '同学'}。
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '500px', lineHeight: 1.5 }}>
            这里是你的能力大本营。把零散的作品转化为可展示、可讲述、可投递的专属求职作品集。
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {statCards.map((stat, idx) => (
          <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', border: 'none', background: 'rgba(255,255,255,0.7)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: stat.bgLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color,
              }}>
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1 }}>{stat.value}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.5rem' }}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-main)' }}>快捷入口</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {quickLinks.map((link, idx) => (
            <Link key={idx} to={link.path} className="card" style={{
              padding: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              textDecoration: 'none', color: 'inherit',
              border: 'none', background: 'rgba(255,255,255,0.7)',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(0,0,0,0.03)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: link.color,
              }}>
                {link.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>{link.name}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Works */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>最近更新作品</h2>
          <Link to="/library" style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
            查看全部 <ChevronRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {works.slice(0, 4).map((work) => (
            <div key={work.id} className="card" style={{ padding: '1.5rem', border: 'none', background: 'rgba(255,255,255,0.7)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%', color: 'var(--text-main)' }} title={work.title}>{work.title}</h3>
                <span className="chip" style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)' }}>{work.type}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem' }}>
                {work.background || '暂无描述'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {work.tags?.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="chip" style={{ fontSize: '0.7rem' }}>{tag}</span>
                ))}
                {work.tags?.length > 3 && <span className="chip" style={{ fontSize: '0.7rem' }}>+{work.tags.length - 3}</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>完成于 {work.date || '—'}</span>
                <Link to={`/details/${work.id}`} style={{ fontSize: '0.82rem', color: 'var(--primary-color)', fontWeight: 500, textDecoration: 'none' }}>查看详情</Link>
              </div>
            </div>
          ))}
          {works.length === 0 && (
            <div className="card" style={{
              gridColumn: 'span 2',
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              border: 'none',
              background: 'rgba(255,255,255,0.5)',
            }}>
              <FolderPlus size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.95rem' }}>还没有任何作品，快去作品库添加吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
