import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import { AuthContext } from '../context/AuthContext';
import { simulateAIGeneration } from '../utils/aiSimulator';
import { Wand2, Copy, Check, Info, FileText, MessageSquare, Lightbulb } from 'lucide-react';

const AIOptimization = () => {
  const [searchParams] = useSearchParams();
  const initialWorkId = searchParams.get('workId');
  const defaultType = searchParams.get('type') || 'description';
  
  const { works, updateWork } = useContext(PortfolioContext);
  const { token } = useContext(AuthContext);

  const [selectedWorkId, setSelectedWorkId] = useState(initialWorkId || '');
  const [activeTab, setActiveTab] = useState(defaultType);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState('');

  const selectedWork = works.find(w => w.id === selectedWorkId);

  // 如果 URL 变了，同步状态
  useEffect(() => {
    if (initialWorkId) setSelectedWorkId(initialWorkId);
    if (defaultType) setActiveTab(defaultType);
  }, [initialWorkId, defaultType]);

  const handleGenerate = async () => {
    if (!selectedWork) return;
    setGenerating(true);
    
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_BASE}/ai/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Direct read for simplicity
        },
        body: JSON.stringify({
          title: selectedWork.title,
          type: selectedWork.type,
          materials: selectedWork.materials,
          role: selectedWork.role,
          tools: selectedWork.tools,
          background: selectedWork.background,
          idea: selectedWork.idea,
          process: selectedWork.process,
          highlights: selectedWork.highlights,
          dataFeedback: selectedWork.dataFeedback,
          coverImage: selectedWork.coverImage
        })
      });

      if (!response.ok) {
        let errData;
        try { errData = await response.json(); } catch(e) {}
        throw new Error(errData?.message || 'AI 生成失败');
      }
      
      const result = await response.json();
      
      // 更新作品数据，保存生成的文本
      updateWork(selectedWork.id, {
        projectDescription: result.projectDescription,
        interviewScript: result.interviewScript,
        background: result.background,
        role: result.role,
        idea: result.idea,
        process: result.process,
        highlights: result.highlights,
        tags: result.tags,
        jobs: result.jobs,
        matchReasons: result.matchReasons,
        optimized: true,
        suggestions: ["你的作品已经被 AI 全面提取和优化，可以直接在简历和面试中使用了！"]
      });
    } catch (error) {
      console.error(error);
      alert(`AI 优化失败：\n${error.message}`);
    }
    
    setGenerating(false);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">AI 表达优化</h1>
        <p className="text-muted">将零散的记录转化为专业的项目说明和面试讲述稿。</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* 左侧：选择作品与控制面板 */}
        <div className="col-span-1 space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold mb-4">选择作品</h2>
            <select 
              className="form-select w-full mb-4"
              value={selectedWorkId}
              onChange={(e) => {
                setSelectedWorkId(e.target.value);
                // 更新 URL 但不刷新页面
                navigate(`/ai?workId=${e.target.value}&type=${activeTab}`, { replace: true });
              }}
            >
              <option value="" disabled>请选择一个作品...</option>
              {works.map(w => (
                <option key={w.id} value={w.id}>{w.title}</option>
              ))}
            </select>

            {selectedWork && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
                <p className="font-medium mb-1">当前选择：</p>
                <p className="text-gray-700 line-clamp-2 mb-2">{selectedWork.title}</p>
                <div className="flex gap-2">
                  <span className="chip text-[10px]">{selectedWork.type}</span>
                  {selectedWork.optimized && <span className="chip chip-success text-[10px]">已优化</span>}
                </div>
              </div>
            )}

            <button 
              className="btn btn-primary w-full"
              onClick={handleGenerate}
              disabled={!selectedWork || generating}
            >
              <Wand2 size={16} />
              {generating ? 'AI 正在极速撰写中...' : '一键生成表达优化'}
            </button>
          </div>

          {selectedWork && selectedWork.suggestions && (
            <div className="card border-orange-200 bg-orange-50/30">
              <h2 className="text-md font-bold mb-3 flex items-center gap-2 text-orange-800">
                <Lightbulb size={18} />
                人工优化建议
              </h2>
              <ul className="space-y-3">
                {selectedWork.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-orange-900 flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 右侧：生成内容展示 */}
        <div className="col-span-2">
          <div className="ai-alert mb-6">
            <Info size={20} className="flex-shrink-0" />
            <p>AI 生成内容仅供参考，请勿虚构项目经历、夸大个人职责或编造数据。成果数据、获奖情况和个人贡献需要由您本人确认。</p>
          </div>

          <div className="card h-[600px] flex flex-col">
            <div className="flex border-b border-gray-200 mb-4">
              <button 
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'description' ? 'border-primary-color text-primary-color' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => {
                  setActiveTab('description');
                  if (selectedWorkId) navigate(`/ai?workId=${selectedWorkId}&type=description`, { replace: true });
                }}
              >
                <FileText size={16} />
                书面项目说明 (用于简历/作品集)
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'interview' ? 'border-primary-color text-primary-color' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => {
                  setActiveTab('interview');
                  if (selectedWorkId) navigate(`/ai?workId=${selectedWorkId}&type=interview`, { replace: true });
                }}
              >
                <MessageSquare size={16} />
                面试讲述稿 (约1分钟)
              </button>
            </div>

            <div className="flex-1 overflow-y-auto relative p-2">
              {!selectedWork ? (
                <div className="h-full flex flex-col items-center justify-center text-muted">
                  <Wand2 size={48} className="text-gray-200 mb-4" />
                  <p>请先在左侧选择一个作品</p>
                </div>
              ) : generating ? (
                <div className="h-full flex flex-col items-center justify-center text-muted">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-primary-color rounded-full animate-spin mb-4"></div>
                  <p>AI 正在重构语言逻辑...</p>
                </div>
              ) : (
                <div className="relative h-full">
                  <div className="absolute top-0 right-0">
                    <button 
                      className="btn btn-secondary btn-sm bg-white shadow-sm flex items-center gap-1"
                      onClick={() => handleCopy(activeTab === 'description' ? selectedWork.projectDescription : selectedWork.interviewScript, activeTab)}
                      disabled={!(activeTab === 'description' ? selectedWork.projectDescription : selectedWork.interviewScript)}
                    >
                      {copied === activeTab ? <><Check size={14} className="text-green-500"/> 已复制</> : <><Copy size={14} /> 复制全文</>}
                    </button>
                  </div>
                  
                  <div className="prose prose-sm max-w-none pt-2 pr-2">
                    {activeTab === 'description' ? (
                      selectedWork.projectDescription ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedWork.projectDescription.replace(/\n/g, '<br/>').replace(/### /g, '<strong>').replace(/<br\/><strong>/g, '<br/><br/><strong>').replace(/<strong>(.*?)<br\/>/g, '<strong>$1</strong><br/>') }} />
                      ) : (
                        <p className="text-gray-400 italic mt-10 text-center">尚未生成，请点击左侧生成按钮。</p>
                      )
                    ) : (
                      selectedWork.interviewScript ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedWork.interviewScript.replace(/\n/g, '<br/>').replace(/【/g, '<strong>【').replace(/】/g, '】</strong>') }} />
                      ) : (
                        <p className="text-gray-400 italic mt-10 text-center">尚未生成，请点击左侧生成按钮。</p>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOptimization;
