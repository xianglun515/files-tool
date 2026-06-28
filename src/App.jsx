import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Library, 
  Wand2, 
  FolderKanban,
  LogOut,
  Sparkles
} from 'lucide-react';

import { AuthContext } from './context/AuthContext';

// Page imports
import Dashboard from './pages/Dashboard';
import AddWork from './pages/AddWork';
import WorkLibrary from './pages/WorkLibrary';
import WorkDetails from './pages/WorkDetails';
import JobMatching from './pages/JobMatching';
import AIOptimization from './pages/AIOptimization';
import MyPortfolio from './pages/MyPortfolio';
import PortfolioPreview from './pages/PortfolioPreview';
import AuthPage from './pages/AuthPage';

// 路由守卫组件：未登录时重定向到登录页
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontSize: '1.1rem', color: '#94a3b8',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
          }} />
          <span style={{ letterSpacing: '0.1em', fontWeight: 500 }}>加载中...</span>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const { user, logout } = useContext(AuthContext);

  // 如果是在预览页或登录页，不显示侧边栏
  if (path === '/preview' || path === '/login') return null;

  const navItems = [
    { path: '/', label: '首页总览', icon: <LayoutDashboard size={19} /> },
    { path: '/add', label: '添加作品', icon: <PlusCircle size={19} /> },
    { path: '/library', label: '作品库', icon: <Library size={19} /> },
    { path: '/ai', label: 'AI优化', icon: <Wand2 size={19} /> },
    { path: '/portfolio', label: '我的作品集', icon: <FolderKanban size={19} /> },
  ];

  return (
    <div className="sidebar" style={{ color: 'rgba(255,255,255,0.7)' }}>
      {/* Brand */}
      <div style={{ padding: '0.5rem 0.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.2,
              background: 'linear-gradient(135deg, #e0e7ff, #c4b5fd)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              让作品会说话
            </h1>
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', paddingLeft: '46px', marginTop: '-2px' }}>
          传媒生作品集成长助手
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', 
                padding: '0.7rem 0.85rem', borderRadius: '0.7rem', 
                transition: 'all 0.25s ease',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))' 
                  : 'transparent',
                color: isActive ? '#e0e7ff' : 'rgba(255,255,255,0.55)',
                fontWeight: isActive ? 600 : 450,
                fontSize: '0.9rem',
                borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                boxShadow: isActive ? '0 0 20px rgba(99, 102, 241, 0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                  e.currentTarget.style.borderLeftColor = 'rgba(129, 140, 248, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                  e.currentTarget.style.borderLeftColor = 'transparent';
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{
        height: '1px', margin: '1rem 0',
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)',
      }} />
      
      {/* User Profile */}
      <div style={{
        padding: '1rem',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '0.85rem',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', fontSize: '14px', flexShrink: 0,
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
          }}>
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username || '用户'}
            </span>
            <span style={{ fontSize: '11px', lineHeight: 1.3, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || ''}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            width: '100%', padding: '0.55rem',
            background: 'transparent',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.5rem', color: 'rgba(239, 68, 68, 0.7)',
            fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.25s ease', fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.color = 'rgba(239, 68, 68, 0.7)';
            e.currentTarget.style.boxShadow = 'none';
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

  return (
    <div className={isPreview || isLogin ? '' : 'app-container'}>
      <Sidebar />
      <main className={isPreview || isLogin ? '' : 'main-content'}>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddWork /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><WorkLibrary /></ProtectedRoute>} />
          <Route path="/details/:id" element={<ProtectedRoute><WorkDetails /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AIOptimization /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><MyPortfolio /></ProtectedRoute>} />
          <Route path="/preview" element={<ProtectedRoute><PortfolioPreview /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
