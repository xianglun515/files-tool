import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import { ArrowLeft, Edit, Trash2, Wand2, MessageSquare, CheckCircle2 } from 'lucide-react';

const WorkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { works, deleteWork, togglePortfolio } = useContext(PortfolioContext);
  
  const work = works.find(w => w.id === id);

  if (!work) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">作品不存在</h2>
        <Link to="/library" className="btn btn-primary">返回作品库</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('确定要删除这个作品吗？')) {
      deleteWork(work.id);
      navigate('/library');
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-muted hover:text-gray-900 flex items-center gap-2">
          <ArrowLeft size={20} />
          返回
        </button>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="btn btn-danger flex items-center gap-2 py-1.5 px-3">
            <Trash2 size={16} /> 删除
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧主要信息 */}
        <div className="col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{work.title}</h1>
                <div className="flex gap-2">
                  <span className="chip">{work.type}</span>
                  <span className="chip chip-secondary">{work.source}</span>
                  <span className="chip chip-secondary">{work.date}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-muted mb-1">个人角色</p>
                <p className="font-medium">{work.role || '未填写'}</p>
              </div>
              <div>
                <p className="text-sm text-muted mb-1">使用工具</p>
                <p className="font-medium">{work.tools || '未填写'}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">详细描述</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> 项目背景
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">{work.background || '暂无描述'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div> 执行过程
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">{work.process || '暂无描述'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> 成果亮点
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">{work.highlights || '暂无描述'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧分析与生成区域 */}
        <div className="col-span-1 space-y-6">
          {/* 能力证明模块：核心逻辑突出 */}
          <div className="card border-primary-color bg-indigo-50/50">
            <h2 className="text-lg font-bold mb-4 text-indigo-900 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-indigo-600" />
              能力证明
            </h2>
            <p className="text-sm text-indigo-700 mb-4">
              这个作品证明了你具备以下能力，适合投递相关岗位。
            </p>
            
            <div className="mb-4">
              <h3 className="text-xs font-bold text-muted mb-2 uppercase tracking-wider">提取标签</h3>
              <div className="flex flex-wrap gap-2">
                {(work.tags || []).length > 0 ? (
                  work.tags.map((tag, idx) => <span key={idx} className="chip bg-white">{tag}</span>)
                ) : (
                  <span className="text-sm text-muted">尚未进行AI分析</span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-muted mb-2 uppercase tracking-wider">推荐适配岗位</h3>
              <div className="flex flex-wrap gap-2">
                {(work.jobs || []).length > 0 ? (
                  work.jobs.map((job, idx) => <span key={idx} className="chip chip-success bg-white">{job}</span>)
                ) : (
                  <span className="text-sm text-muted">尚未进行AI分析</span>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4">内容生成</h2>
            <p className="text-sm text-muted mb-6">一键将枯燥的描述转化为专业的求职表达。</p>
            
            <div className="space-y-3">
              <Link to={`/ai?workId=${work.id}&type=description`} className="btn btn-primary w-full justify-between group">
                <div className="flex items-center gap-2">
                  <Wand2 size={18} />
                  生成项目说明
                </div>
                <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link to={`/ai?workId=${work.id}&type=interview`} className="btn btn-secondary w-full justify-between group">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} />
                  生成面试讲述稿
                </div>
                <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>


          <div className="card">
            <h2 className="text-lg font-bold mb-4">作品集管理</h2>
            <button 
              onClick={() => togglePortfolio(work.id)}
              className={`btn w-full ${work.addedToPortfolio ? 'bg-green-50 text-green-700 border border-green-200' : 'btn-primary'}`}
            >
              {work.addedToPortfolio ? '已加入我的作品集 (点击移出)' : '加入我的作品集'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetails;
