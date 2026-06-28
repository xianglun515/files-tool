import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Layout, Wand2, Briefcase } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// 注册 GSAP 插件
gsap.registerPlugin(useGSAP);

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // GSAP 动画时间线
  useGSAP(() => {
    // 隐藏元素防止闪烁，虽然在 React 里通常初始状态靠 CSS，但 GSAP 接管后会处理好
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. 顶部 Badge 入场
    tl.from('.hero-badge', { 
      y: 30, 
      opacity: 0, 
      duration: 1,
      ease: "expo.out"
    })
    
    // 2. 主标题 Kinetic Typography (Masked Stagger Reveal)
    .from('.hero-headline-word', {
      y: "120%",     // 从遮罩底部升起
      rotateZ: 3,    // 极其轻微的角度变化增加物理感
      opacity: 0,    // 配合透明度防止边缘生硬
      duration: 1.4,
      stagger: 0.15, // 错开 0.15 秒
      ease: "expo.out"
    }, "-=0.6") // 提前 0.6 秒与上一个动画重叠执行

    // 3. 副标题入场
    .from('.hero-desc', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=1.0")

    // 4. CTA 按钮弹性入场
    .from('.hero-btn', {
      y: 20,
      scale: 0.95,
      opacity: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.8")

    // 5. 底部特性卡片流式入场
    .from('.feature-card', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=1.0");

  }, { scope: containerRef }); // 限定作用域，避免影响其他页面

  // 将主标题按逻辑拆分，用于遮罩动画
  const headlineChunks = ["让你的作品，", "替你说话。"];

  return (
    <div ref={containerRef} style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#111111',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    }}>
      {/* Navigation (导航栏保持即时显示，不参与大动效，提供安全感) */}
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
        <div style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#f5f5f5', borderRadius: '20px', marginBottom: '2rem', border: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#111' }}></span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em', color: '#555', textTransform: 'uppercase' }}>专为传媒生打造的设计空间</span>
          </div>
          
          {/* Kinetic Typography 结构: overflow:hidden 限制视口，内部 span 负责 Y 轴位移 */}
          <h1 style={{ 
            fontSize: 'clamp(3rem, 6vw, 4.5rem)', 
            fontWeight: 700, 
            lineHeight: 1.15, 
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            color: '#111',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: '8px'
          }}>
            {headlineChunks.map((chunk, idx) => (
              <span key={idx} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '10px' }}>
                <span className="hero-headline-word" style={{ display: 'inline-block', transformOrigin: 'left bottom' }}>
                  {chunk}
                </span>
              </span>
            ))}
          </h1>
          
          <p className="hero-desc" style={{
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
            className="hero-btn"
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
              transition: 'background 0.2s ease, box-shadow 0.2s ease', // 移除 transform 动画交给 GSAP，保留颜色变化
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
              // JS 微动效注入，配合 GSAP
              gsap.to(e.currentTarget, { y: -2, duration: 0.3, ease: 'power2.out' });
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#111';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)';
              gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: 'power2.out' });
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
            <div key={idx} className="feature-card" style={{
              padding: '2rem',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: '12px',
              background: '#fff',
              textAlign: 'left',
              // 移除 transform 的 CSS transition，完全交由 GSAP 接管
              transition: 'box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.04)';
              gsap.to(e.currentTarget, { y: -6, duration: 0.4, ease: 'power2.out' });
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              gsap.to(e.currentTarget, { y: 0, duration: 0.4, ease: 'power2.out' });
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
