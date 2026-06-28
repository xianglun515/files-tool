import React, { useContext, useState } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';
import { FolderKanban, GripVertical, Trash2, Download, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyPortfolio = () => {
  const { works, togglePortfolio } = useContext(PortfolioContext);
  
  // 只获取加入到作品集的作品
  const portfolioWorks = works.filter(w => w.addedToPortfolio);
  
  const [orderedWorks, setOrderedWorks] = useState(portfolioWorks);
  const [targetJob, setTargetJob] = useState('新媒体运营');
  const [copied, setCopied] = useState(false);

  // 简单的上下移动逻辑，替代复杂的拖拽
  const moveUp = (index) => {
    if (index === 0) return;
    const newOrder = [...orderedWorks];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrderedWorks(newOrder);
  };

  const moveDown = (index) => {
    if (index === orderedWorks.length - 1) return;
    const newOrder = [...orderedWorks];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    setOrderedWorks(newOrder);
  };

  const handleRemove = (id) => {
    togglePortfolio(id);
    setOrderedWorks(orderedWorks.filter(w => w.id !== id));
  };

  const generateDirectory = () => {
    let content = `《我的作品集》 - 面向【${targetJob}】岗位\n\n`;
    content += `一、 个人简介 (请在此处补充)\n\n`;
    
    orderedWorks.forEach((work, index) => {
      let prefix = '核心作品';
      if (index > 1) prefix = '补充作品';
      if (index === orderedWorks.length - 1 && orderedWorks.length > 2) prefix = '项目复盘';
      
      content += `二、 ${prefix}：${work.title}\n`;
      content += `   - 作品类型：${work.type}\n`;
      content += `   - 核心体现能力：${(work.tags || []).slice(0, 3).join('、')}\n`;
      if (work.projectDescription) {
        // 提取一小段作为简介
        const brief = work.projectDescription.substring(0, 100).replace(/\n/g, '') + '...';
        content += `   - 项目简介：${brief}\n`;
      }
      content += `\n`;
    });

    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 同步更新
  React.useEffect(() => {
    setOrderedWorks(works.filter(w => w.addedToPortfolio));
  }, [works]);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">我的作品集</h1>
        <p className="text-muted">管理准备展示的作品，调整顺序，并生成针对特定岗位的展示清单。</p>
      </div>

      {portfolioWorks.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <FolderKanban size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">作品集空空如也</h3>
          <p className="text-muted mb-6">去作品库或者岗位匹配页面，挑选最满意的作品加入吧！</p>
          <Link to="/library" className="btn btn-primary">前往作品库挑选</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <h2 className="text-lg font-bold">已选作品列表 ({orderedWorks.length})</h2>
              </div>
              
              <div className="space-y-3">
                {orderedWorks.map((work, index) => (
                  <div key={work.id} className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg group">
                    <div className="flex flex-col gap-1 text-gray-400">
                      <button onClick={() => moveUp(index)} disabled={index === 0} className="hover:text-blue-500 disabled:opacity-30">▲</button>
                      <button onClick={() => moveDown(index)} disabled={index === orderedWorks.length - 1} className="hover:text-blue-500 disabled:opacity-30">▼</button>
                    </div>
                    
                    <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex items-center justify-center text-[10px] text-gray-500">
                      {work.coverName || '无封面'}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-bold text-sm leading-tight">{work.title}</p>
                      <p className="text-xs text-muted mt-1">{work.type} · {(work.tags || []).slice(0, 2).join(' ')}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(work.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="移出作品集"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="card sticky top-6">
              <h2 className="text-lg font-bold mb-4">生成展示清单</h2>
              <div className="form-group">
                <label className="form-label">目标岗位导向</label>
                <select 
                  className="form-select"
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                >
                  <option value="新媒体运营">新媒体运营</option>
                  <option value="内容运营">内容运营</option>
                  <option value="策划专员">策划专员</option>
                  <option value="视觉设计师">视觉设计师</option>
                  <option value="产品经理助理">产品经理助理</option>
                </select>
              </div>
              
              <p className="text-xs text-muted mb-6">
                提示：不需要真的导出 PDF。该功能将根据您当前的排序，为您生成一份结构化的可复制文本目录，方便您在制作实际作品集（如PPT/Notion）时直接粘贴作为结构参考。
              </p>

              <div className="space-y-3">
                <Link 
                  to={`/preview?job=${encodeURIComponent(targetJob)}`}
                  className="btn bg-gradient-to-r from-blue-500 to-purple-600 text-white w-full flex justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <FolderKanban size={18} />
                  一键生成排版作品集
                </Link>

                <button 
                  className={`btn w-full flex justify-center gap-2 ${copied ? 'bg-green-500 text-white hover:bg-green-600' : 'btn-secondary'}`}
                  onClick={generateDirectory}
                >
                  {copied ? <><Check size={18} /> 已复制文本大纲</> : <><Download size={18} /> 复制文本展示大纲</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPortfolio;
