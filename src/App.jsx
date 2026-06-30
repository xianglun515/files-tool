import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Library, 
  Wand2, 
  FolderKanban,
  LogOut,
  Sparkles,
  Target
} from 'lucide-react';

import { AuthContext } from './context/AuthContext';

// Page imports
import Dashboard from './pages/Dashboard';
import WorkLibrary from './pages/WorkLibrary';
import WorkDetails from './pages/WorkDetails';
import JobMatching from './pages/JobMatching';
import AIOptimization from './pages/AIOptimization';
import MyPortfolio from './pages/MyPortfolio';
import PortfolioPreview from './pages/PortfolioPreview';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import { Crown } from 'lucide-react';

// 路由守卫组件：未登录时重定向到欢迎封面页
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontSize: '1.1rem', color: 'var(--text-muted)',
        background: 'var(--bg-color, #f5f5f7)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '36px', height: '36px',
            border: '3px solid rgba(0, 0, 0, 0.08)',
            borderTopColor: 'var(--primary-color, #007AFF)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1.5rem',
          }} />
          <span style={{ letterSpacing: '0.05em', fontWeight: 500, fontSize: '0.9rem' }}>加载中...</span>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/welcome" replace />;
  }
  
  return children;
};

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const { user, logout } = useContext(AuthContext);

  // 如果是在预览页、登录页或欢迎封面页，不显示侧边栏
  if (path === '/preview' || path === '/login' || path === '/welcome') return null;

  const navItems = [
    { path: '/', label: '首页总览', icon: <LayoutDashboard size={19} /> },
    { path: '/library', label: '作品库', icon: <Library size={19} /> },
    { path: '/ai', label: '智能提取', icon: <Wand2 size={19} /> },
    { path: '/jobs', label: '岗位匹配', icon: <Target size={19} /> },
    { path: '/portfolio', label: '我的作品集', icon: <FolderKanban size={19} /> },
    { path: '/pricing', label: '升级专业版', icon: <Crown size={19} color="#a855f7" /> },
  ];

  return (
    <div className="sidebar">
      {/* Brand */}
      <div style={{ padding: '0.5rem 0.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--primary-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 113, 227, 0.3)',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.2,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em'
            }}>
              让作品会说话
            </h1>
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '42px', marginTop: '-2px' }}>
          传媒生作品集助手
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', 
                padding: '0.6rem 0.85rem', borderRadius: '8px', 
                transition: 'all 0.2s ease',
                background: isActive 
                  ? 'rgba(0,0,0,0.06)' 
                  : 'transparent',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              {React.cloneElement(item.icon, { 
                color: isActive ? 'var(--primary-color)' : 'currentColor',
                size: 18
              })}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{
        height: '1px', margin: '1rem 0',
        background: 'rgba(0,0,0,0.06)',
      }} />
      
      {/* User Profile */}
      <div style={{
        padding: '0.75rem',
        background: 'transparent',
        borderRadius: '8px',
        border: '1px solid transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--primary-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', fontSize: '12px', flexShrink: 0,
          }}>
            {user?.user_metadata?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.user_metadata?.username || '用户'}
            </span>
            <span style={{ fontSize: '11px', lineHeight: 1.3, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || ''}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            width: '100%', padding: '0.5rem',
            background: 'rgba(255, 59, 48, 0.08)',
            border: 'none',
            borderRadius: '6px', color: '#ff3b30',
            fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s ease', fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.08)';
          }}
        >
          <LogOut size={14} />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const location = useLocation();
  const isPreview = location.pathname === '/preview';
  const isLogin = location.pathname === '/login';
  const isWelcome = location.pathname === '/welcome';

  return (
    <div className={isPreview || isLogin || isWelcome ? '' : 'app-container'}>
      <Sidebar />
      <main className={isPreview || isLogin || isWelcome ? '' : 'main-content'}>
        <Routes>
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><WorkLibrary /></ProtectedRoute>} />
          <Route path="/details/:id" element={<ProtectedRoute><WorkDetails /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AIOptimization /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobMatching /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><MyPortfolio /></ProtectedRoute>} />
          <Route path="/preview" element={<ProtectedRoute><PortfolioPreview /></ProtectedRoute>} />
          <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
