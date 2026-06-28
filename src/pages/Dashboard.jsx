import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import { 
  FileText, 
  Tag, 
  Target, 
  AlertCircle,
  PlusCircle,
  Library,
  Briefcase,
  Wand2,
  FolderKanban,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const { works } = useContext(PortfolioContext);

  const totalWorks = works.length;
  // 计算唯一的标签总数
  const uniqueTags = new Set();
  works.forEach(w => w.tags?.forEach(tag => uniqueTags.add(tag)));
  const totalTags = uniqueTags.size;

  // 计算唯一的适配岗位总数
  const uniqueJobs = new Set();
  works.forEach(w => w.jobs?.forEach(job => uniqueJobs.add(job)));
  const totalJobs = uniqueJobs.size;

  // 待优化作品数 (optimized === false)
  const pendingOptWorks = works.filter(w => !w.optimized).length;

  const statCards = [
    { title: '作品总数', value: totalWorks, icon: <FileText className="text-blue-500" size={24} />, color: 'bg-blue-50' },
    { title: '能力标签', value: totalTags, icon: <Tag className="text-purple-500" size={24} />, color: 'bg-purple-50' },
    { title: '适配岗位', value: totalJobs, icon: <Target className="text-green-500" size={24} />, color: 'bg-green-50' },
    { title: '待优化项', value: pendingOptWorks, icon: <AlertCircle className="text-orange-500" size={24} />, color: 'bg-orange-50' },
  ];

  const quickLinks = [
    { name: '添加作品', path: '/add', icon: <PlusCircle size={20} />, bg: 'bg-blue-100 text-blue-600' },
    { name: '作品库', path: '/library', icon: <Library size={20} />, bg: 'bg-purple-100 text-purple-600' },
    { name: 'AI优化', path: '/ai', icon: <Wand2 size={20} />, bg: 'bg-pink-100 text-pink-600' },
    { name: '我的作品集', path: '/portfolio', icon: <FolderKanban size={20} />, bg: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">欢迎回来！</h1>
        <p className="text-muted">这里是你的能力大本营，把零散作品转化为可展示、可讲述、可投递的求职作品集。</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="card flex items-center gap-4">
            <div className={`p-4 rounded-full ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-muted mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">快捷入口</h2>
        <div className="flex gap-4">
          {quickLinks.map((link, idx) => (
            <Link key={idx} to={link.path} className="card flex-1 flex flex-col items-center justify-center p-6 hover:-translate-y-1 transition-transform cursor-pointer text-center">
              <div className={`p-3 rounded-full mb-3 ${link.bg}`}>
                {link.icon}
              </div>
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">最近更新作品</h2>
          <Link to="/library" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            查看全部 <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {works.slice(0, 4).map((work) => (
            <div key={work.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg line-clamp-1" title={work.title}>{work.title}</h3>
                <span className="chip">{work.type}</span>
              </div>
              <p className="text-sm text-muted mb-4 line-clamp-2 h-10">{work.background}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {work.tags?.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="chip chip-secondary text-xs">{tag}</span>
                ))}
                {work.tags?.length > 3 && <span className="chip chip-secondary text-xs">+{work.tags.length - 3}</span>}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-xs text-muted">完成于 {work.date}</span>
                <Link to={`/details/${work.id}`} className="text-sm text-blue-600 font-medium hover:underline">查看详情</Link>
              </div>
            </div>
          ))}
          {works.length === 0 && (
            <div className="col-span-2 card text-center py-12 text-muted">
              还没有任何作品，先去添加你的第一个作品吧！
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
