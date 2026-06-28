import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Library, 
  Wand2, 
  FolderKanban,
  LogOut
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
        height: '100vh', fontSize: '1.1rem', color: '#64748b',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff1f2 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid #e2e8f0',
            borderTopColor: '#6366f1', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <span>加载中...</span>
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
    { path: '/', label: '首页总览', icon: <LayoutDashboard size={20} /> },
    { path: '/add', label: '添加作品', icon: <PlusCircle size={20} /> },
    { path: '/library', label: '作品库', icon: <Library size={20} /> },
    { path: '/ai', label: 'AI优化', icon: <Wand2 size={20} /> },
    { path: '/portfolio', label: '我的作品集', icon: <FolderKanban size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gradient" style={{ lineHeight: '1.2' }}>
          让作品会说话
        </h1>
        <p className="text-sm text-muted mt-2">传媒生作品集成长助手</p>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
      {navItems.map((item) => {
        const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
        return (
          <Link 
            key={item.path} 
            to={item.path}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', 
              padding: '0.75rem 1rem', borderRadius: '0.75rem', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))' : 'transparent',
              color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
              fontWeight: isActive ? '600' : '500',
              border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
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
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', fontSize: '14px', flexShrink: 0
          }}>
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username || '用户'}
            </span>
            <span className="text-muted" style={{ fontSize: '12px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || ''}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            width: '100%', padding: '0.6rem 1rem',
            background: 'transparent', border: '1px solid #fee2e2',
            borderRadius: '0.625rem', color: '#ef4444',
            fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s ease', fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2';
            e.currentTarget.style.borderColor = '#fca5a5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#fee2e2';
          }}
        >
          <LogOut size={15} />
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
