import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import { Search, Filter, FolderPlus, ArrowRight } from 'lucide-react';

const WorkLibrary = () => {
  const { works, togglePortfolio } = useContext(PortfolioContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('全部');
  const [filterTag, setFilterTag] = useState('');

  // 提取所有可用的标签用于筛选
  const allTags = Array.from(new Set(works.flatMap(w => w.tags || [])));

  const filteredWorks = works.filter(work => {
    const matchSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (work.background || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === '全部' || work.type === filterType;
    const matchTag = filterTag === '' || (work.tags && work.tags.includes(filterTag));
    return matchSearch && matchType && matchTag;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">作品库</h1>
          <p className="text-muted">管理你的所有作品，支持多维度筛选与检索。</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          <FolderPlus size={18} />
          添加作品
        </Link>
      </div>

      <div className="card mb-8">
        <div className="flex gap-4 items-end">
          <div className="form-group mb-0 flex-1">
            <label className="form-label flex items-center gap-2">
              <Search size={16} /> 搜索作品
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="输入作品名称或关键词..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group mb-0 w-48">
            <label className="form-label flex items-center gap-2">
              <Filter size={16} /> 作品类型
            </label>
            <select 
              className="form-select" 
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="全部">全部类型</option>
              <option value="图文作品">图文作品</option>
              <option value="短视频作品">短视频作品</option>
              <option value="策划案">策划案</option>
              <option value="视觉设计作品">视觉设计作品</option>
              <option value="调研报告">调研报告</option>
              <option value="实习项目">实习项目</option>
            </select>
          </div>
          <div className="form-group mb-0 w-48">
            <label className="form-label flex items-center gap-2">
              <Filter size={16} /> 能力标签
            </label>
            <select 
              className="form-select" 
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
            >
              <option value="">全部标签</option>
              {allTags.map((tag, idx) => (
                <option key={idx} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredWorks.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20">
          <FolderPlus size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关作品</h3>
          <p className="text-muted mb-6">还没有作品，或者调整筛选条件试试看。</p>
          <Link to="/add" className="btn btn-primary">去添加第一个作品</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredWorks.map(work => (
            <div key={work.id} className="card flex flex-col h-full">
              {/* Cover Placeholder */}
              <div className="h-40 bg-gray-100 rounded-lg mb-4 flex flex-col items-center justify-center border border-gray-200 border-dashed relative overflow-hidden group">
                <span className="text-sm text-gray-400 font-medium">
                  {work.coverName || '暂无封面'}
                </span>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link to={`/details/${work.id}`} className="btn btn-primary btn-sm rounded-full px-4 text-xs">
                    查看详情
                  </Link>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2" title={work.title}>{work.title}</h3>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="chip text-xs bg-gray-100 text-gray-700">{work.type}</span>
                  <span className="chip text-xs bg-gray-100 text-gray-700">{work.source || '未知来源'}</span>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-muted mb-1">能力标签：</p>
                  <div className="flex flex-wrap gap-1">
                    {work.tags?.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="chip chip-secondary text-[10px] px-2 py-0.5">{tag}</span>
                    ))}
                    {work.tags?.length > 3 && <span className="chip chip-secondary text-[10px] px-2 py-0.5">+{work.tags.length - 3}</span>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-muted mb-1">适配岗位：</p>
                  <p className="text-sm text-gray-700 line-clamp-1">{work.jobs?.join('、') || '暂无'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-auto flex justify-between items-center gap-2">
                <Link to={`/ai?workId=${work.id}`} className="btn btn-secondary text-xs flex-1 py-1.5 px-0">
                  生成说明
                </Link>
                <button 
                  onClick={() => togglePortfolio(work.id)}
                  className={`btn text-xs flex-1 py-1.5 px-0 ${work.addedToPortfolio ? 'bg-green-50 text-green-700 border border-green-200' : 'btn-primary'}`}
                >
                  {work.addedToPortfolio ? '已加入作品集' : '加入作品集'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkLibrary;
