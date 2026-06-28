import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Library, 
  Briefcase, 
  Wand2, 
  FolderKanban
} from 'lucide-react';

// Placeholder imports for pages
import Dashboard from './pages/Dashboard';
import AddWork from './pages/AddWork';
import WorkLibrary from './pages/WorkLibrary';
import WorkDetails from './pages/WorkDetails';
import JobMatching from './pages/JobMatching';
import AIOptimization from './pages/AIOptimization';
import MyPortfolio from './pages/MyPortfolio';
import PortfolioPreview from './pages/PortfolioPreview';

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  // 如果是在预览页，不显示侧边栏
  if (path === '/preview') return null;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', fontSize: '14px', flexShrink: 0
          }}>
            U
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.2 }}>当前用户</span>
            <span className="text-muted" style={{ fontSize: '12px', lineHeight: 1.2 }}>学生版</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const location = useLocation();
  const isPreview = location.pathname === '/preview';

  return (
    <div className={isPreview ? '' : 'app-container'}>
      <Sidebar />
      <main className={isPreview ? '' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddWork />} />
          <Route path="/library" element={<WorkLibrary />} />
          <Route path="/details/:id" element={<WorkDetails />} />
          <Route path="/ai" element={<AIOptimization />} />
          <Route path="/portfolio" element={<MyPortfolio />} />
          <Route path="/preview" element={<PortfolioPreview />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
