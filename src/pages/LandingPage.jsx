import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Layout, Wand2, Briefcase } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#111111',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 5%',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '28px', height: '28px',
            background: '#111',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={14} color="#fff" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
            Portfolio Assistant
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" style={{
            textDecoration: 'none',
            color: '#555',
            fontSize: '0.9rem',
            fontWeight: 500,
            padding: '0.5rem 1rem',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#111'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#555'}
          >
            登录
          </Link>
          <button 
            onClick={() => navigate('/login?tab=register')}
            style={{
              background: '#111',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#111';
              e.currentTarget.style.transform = 'none';
            }}
          >
            免费注册
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#f5f5f5', borderRadius: '20px', marginBottom: '2rem', border: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#111' }}></span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em', color: '#555', textTransform: 'uppercase' }}>专为传媒生打造的设计空间</span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(3rem, 6vw, 4.5rem)', 
            fontWeight: 700, 
            lineHeight: 1.1, 
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            color: '#111'
          }}>
            让你的作品，替你说话。
          </h1>
          
          <p style={{
            fontSize: '1.15rem',
            color: '#666',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            fontWeight: 400
          }}>
            摈弃冗杂的排版与浮夸的包装。以极简的结构，将零散的项目素材转化为高度专业、可展示、可讲述的求职作品集。
          </p>

          <button 
            onClick={() => navigate('/login?tab=register')}
            style={{
              background: '#111',
              color: '#fff',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#111';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)';
            }}
          >
            开始构建作品集 <ArrowRight size={18} />
          </button>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1000px',
          width: '100%',
          marginTop: '7rem'
        }}>
          {[
            {
              icon: <Layout size={24} strokeWidth={1.5} />,
              title: "结构化素材管理",
              desc: "告别凌乱的文件堆叠。按照科学的维度梳理背景、过程与成果，建立清晰的项目结构。"
            },
            {
              icon: <Wand2 size={24} strokeWidth={1.5} />,
              title: "克制的 AI 润色",
              desc: "拒绝浮夸辞藻。基于真实素材，提炼专业化、可信赖的书面项目描述与面试逐字稿。"
            },
            {
              icon: <Briefcase size={24} strokeWidth={1.5} />,
              title: "精准的岗位对齐",
              desc: "自动解析作品内核，提炼能力标签，并智能匹配最契合的职业方向与真实岗位要求。"
            }
          ].map((feature, idx) => (
            <div key={idx} style={{
              padding: '2rem',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: '12px',
              background: '#fff',
              textAlign: 'left',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '8px',
                background: '#f8f9fa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem',
                color: '#111',
                border: '1px solid rgba(0,0,0,0.03)'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(0,0,0,0.04)',
        marginTop: 'auto'
      }}>
        <p style={{ fontSize: '0.85rem', color: '#999' }}>
          &copy; {new Date().getFullYear()} Portfolio Assistant. 极简美学驱动。
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
