import React, { useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import { Printer, ArrowLeft, Award, Briefcase, FileText, Sparkles } from 'lucide-react';

import { AuthContext } from '../context/AuthContext';

const PortfolioPreview = () => {
  const { works } = useContext(PortfolioContext);
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const targetJob = searchParams.get('job') || '新媒体运营';
  const portfolioWorks = works.filter(w => w.addedToPortfolio);

  // 默认使用「经典杂志」模板
  const [activeTemplate, setActiveTemplate] = useState('magazine');

  const templates = [
    { id: 'magazine', name: '经典杂志', icon: '📖', desc: '时尚、高对比度、气场强的现代杂志排版' },
    { id: 'minimalist', name: '优雅极简', icon: '✒️', desc: '典雅、金灰配色、极富文学与画册呼吸感' },
    { id: 'tech', name: '数智未来', icon: '💻', desc: '极客暗黑、霓虹炫光、科技感爆棚的数字交互' },
    { id: 'lookbook', name: '创意画册', icon: '🎨', desc: '大胆色块、不对称网格、前卫大胆的个人视觉秀' },
    { id: 'bento', name: '模块化 (Bento)', icon: '🍱', desc: '新潮的圆角卡片拼接排版，适合互联网/UX作品' },
    { id: 'notion', name: '极简文档 (Notion)', icon: '📄', desc: '清晰克制的结构化文档风，适合文字为主的策划案' },
    { id: 'landscape', name: '横向演示', icon: '📽️', desc: '横向幻灯片比例，适合直接全屏演示' },
  ];

  // 统计标签
  const tagCounts = {};
  portfolioWorks.forEach(w => {
    (w.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  const handlePrint = () => {
    window.print();
  };

  if (portfolioWorks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">作品集为空</h2>
        <p className="text-gray-500 mb-6">请先在作品库中将作品加入到您的作品集中。</p>
        <button onClick={() => navigate('/portfolio')} className="btn btn-primary">返回我的作品集</button>
      </div>
    );
  }

  return (
    <div className={`preview-wrapper template-${activeTemplate} bg-slate-200 min-h-screen pb-20 relative`}>
      {/* 悬浮控制栏 - 打印时隐藏 */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md shadow-lg rounded-full px-6 py-3 flex items-center gap-6 z-50 print:hidden border border-slate-200">
        <button onClick={() => navigate(-1)} className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> 返回
        </button>
        <div className="w-px h-4 bg-slate-200"></div>
        
        {/* 模板快捷选择器 */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">排版风格:</span>
          <div className="flex gap-1 bg-slate-100 p-0.5 rounded-full border border-slate-200">
            {templates.map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTemplate(t.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeTemplate === t.id 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t.desc}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-4 bg-slate-200"></div>
        <button onClick={handlePrint} className="btn bg-slate-900 text-white btn-sm rounded-full flex items-center gap-2 hover:bg-slate-800 shadow-sm">
          <Printer size={14} /> 导出为 PDF / 打印
        </button>
      </div>

      {/* A4 排版视图容器 */}
      <div className="pt-24 print:pt-0 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* 1. 封面页 */}
        <div className="a4-page page-cover">
          <div className="page-header">
            <span>Portfolio Showcase</span>
            <span>NO. 01 / COVER</span>
          </div>

          <div className="cover-main flex-1 flex flex-col justify-center">
            {activeTemplate === 'minimalist' && (
              <div className="centered-cover-box text-center py-8 px-6 border border-amber-800/20 max-w-xl mx-auto rounded-sm">
                <h3 className="text-sm font-bold text-amber-800 uppercase tracking-[0.25em] mb-4">MEDIA & DESIGN PORTFOLIO</h3>
                <div className="w-12 h-px bg-amber-800/30 mx-auto mb-6"></div>
                <h1 className="cover-title mb-6">求职作品集</h1>
                <p className="text-sm text-slate-500 italic mb-8">展示个人核心能力与多维度实践成果</p>
                <div className="inline-block bg-amber-800/10 text-amber-900 font-semibold px-6 py-2 rounded-sm text-sm">
                  意向岗位：{targetJob}
                </div>
              </div>
            )}

            {activeTemplate === 'tech' && (
              <div className="tech-cover-box font-mono p-8 border border-cyan-500/20 bg-slate-900/50 rounded-lg">
                <p className="text-cyan-400 text-xs mb-3">&gt; SYSTEM INIT PORTFOLIO_LOADER</p>
                <h1 className="cover-title mb-6">[ 传媒与技术作品集 ]</h1>
                <div className="bg-cyan-500/10 text-cyan-300 p-4 rounded border border-cyan-500/20 inline-block mb-8">
                  <span className="font-bold text-cyan-400">TARGET //</span> {targetJob}
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>MODULE: CORE_ABILITIES_REPORT</p>
                  <p>PLATFORM: RESUME_ASSISTANT_V2</p>
                  <p>STATUS: COMPILING_SUCCESSFUL</p>
                </div>
              </div>
            )}

            {activeTemplate === 'lookbook' && (
              <div className="lookbook-cover-box flex items-center justify-between">
                <div className="max-w-md">
                  <h3 className="text-sm font-black text-rose-600 tracking-[0.3em] mb-4 uppercase">CREATIVE BOOK</h3>
                  <h1 className="cover-title mb-6">我的作品集.</h1>
                  <span className="bg-rose-600 text-white text-xl font-bold px-6 py-2 uppercase tracking-wide inline-block">
                    {targetJob}
                  </span>
                </div>
                <div className="w-48 h-48 bg-rose-50 border-4 border-rose-600 rounded-sm flex items-center justify-center opacity-70">
                  <span className="text-rose-600 font-bold text-9xl">01</span>
                </div>
              </div>
            )}

            {activeTemplate === 'magazine' && (
              <div className="relative pl-10 border-l-8 border-indigo-600 py-6">
                <div className="absolute top-0 right-0 opacity-10">
                  <Sparkles size={160} className="text-indigo-600" />
                </div>
                <h3 className="text-xs font-bold text-indigo-600 tracking-[0.2em] mb-3 uppercase">SELECTED WORKS</h3>
                <h1 className="cover-title mb-6 leading-none">能力证明与<br/>项目复盘.</h1>
                <div className="bg-indigo-600 text-white p-4 inline-block rounded-sm shadow-md">
                  <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1">Target Position</p>
                  <p className="text-xl font-bold">{targetJob}</p>
                </div>
              </div>
            )}

            {activeTemplate === 'bento' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-8 rounded-[24px] flex flex-col justify-between min-h-[300px]">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Selected Works</h3>
                  <h1 className="cover-title leading-tight mt-auto">创意<br/>作品集</h1>
                </div>
                <div className="bg-indigo-600 p-8 rounded-[24px] text-white flex flex-col justify-between">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-8">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-indigo-200 uppercase tracking-wider mb-2">TARGET ROLE</p>
                    <p className="text-2xl font-bold">{targetJob}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTemplate === 'notion' && (
              <div className="max-w-2xl mx-auto w-full">
                <div className="text-6xl mb-6">📝</div>
                <h1 className="cover-title mb-6">我的求职作品集</h1>
                <div className="border-t border-gray-200 pt-6 mt-8">
                  <p className="text-gray-500 font-medium flex items-center gap-2 mb-2"><Briefcase size={16} /> 意向岗位：{targetJob}</p>
                  <p className="text-gray-400 text-sm">本文档包含 {portfolioWorks.length} 个核心项目复盘。</p>
                </div>
              </div>
            )}

            {activeTemplate === 'landscape' && (
              <div className="flex flex-col h-full justify-center text-center">
                <h3 className="text-lg text-gray-400 tracking-[0.4em] mb-4 uppercase">PRESENTATION</h3>
                <h1 className="cover-title mb-8">个人精选作品集</h1>
                <div className="inline-block bg-white/10 px-8 py-3 rounded-full text-white font-bold tracking-widest uppercase border border-white/20">
                  {targetJob}
                </div>
              </div>
            )}
          </div>

          <div className="cover-footer flex justify-between items-end border-t border-slate-200/80 pt-6 mt-12">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Author</p>
              <p className="text-sm font-bold text-slate-800">{user?.username || '求职人姓名'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Projects</p>
              <p className="text-sm font-bold text-slate-800">{portfolioWorks.length} 精选案例</p>
            </div>
          </div>
        </div>

        {/* 2. 能力总览页 */}
        <div className="a4-page page-overview">
          <div className="page-header">
            <span>Portfolio Showcase</span>
            <span>NO. 02 / CAPABILITY</span>
          </div>

          <div className="overview-main flex-1 flex flex-col justify-center">
            <div className="mb-10 text-center">
              <h2 className="section-title mb-2">核心能力大盘</h2>
              <p className="section-subtitle">基于个人过往项目提炼的核心专业素养与擅长领域</p>
            </div>

            <div className="grid grid-cols-2 gap-10">
              {/* 左栏：核心专长云 */}
              <div>
                <h3 className="overview-subtitle mb-6 flex items-center gap-2">
                  <Award size={16} /> 核心专长 (按使用频次)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sortedTags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className={`tag-badge ${idx < 3 ? 'tag-primary' : 'tag-secondary'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 右栏：适配岗位陈述 */}
              <div className="overview-card p-6 rounded-lg border border-slate-200 bg-slate-50/50 relative overflow-hidden">
                <h3 className="overview-subtitle mb-4">岗位契合度陈述</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  通过以下 {portfolioWorks.length} 个核心项目案例，我充分印证了自己与<span className="font-bold text-slate-900">【{targetJob}】</span>岗位的契合度。在项目运作中，我能够运用专业工具，主动洞察用户需求，完成从策划到执行的全案闭环，确保产出高质量的业务成果。
                </p>
              </div>
            </div>
          </div>

          <div className="page-footer">
            <span>PORTFOLIO / {targetJob}</span>
            <span>02</span>
          </div>
        </div>

        {/* 3. 作品展示页（每页展示一个作品） */}
        {portfolioWorks.map((work, index) => {
          const pageNum = index + 3;
          return (
            <div key={work.id} className="a4-page page-work print-avoid-break">
              <div className="page-header">
                <span>{targetJob} 作品集</span>
                <span>NO. {String(pageNum).padStart(2, '0')} / PROJECT</span>
              </div>

              <div className="work-main flex-1 flex flex-col justify-between">
                {/* 顶部标题与类型栏 */}
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h2 className="work-title mb-2">{work.title}</h2>
                    <div className="flex gap-2">
                      <span className="work-badge badge-primary">{work.type}</span>
                      <span className="work-badge badge-secondary">{work.role || '主创'}</span>
                      <span className="work-badge badge-secondary">{work.date || '近期'}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400 font-mono">
                    PROJECT #{String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* 左右图文布局 */}
                <div className="grid grid-cols-5 gap-8 flex-1 items-start">
                  
                  {/* 左栏：成果亮点与图示 */}
                  <div className="col-span-2 space-y-6">
                    {work.coverImage ? (
                      <div className="work-cover-image aspect-[4/3] rounded border border-slate-200 overflow-hidden bg-slate-100">
                        <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="work-cover-placeholder aspect-[4/3] bg-slate-100 rounded border border-slate-200 overflow-hidden flex flex-col items-center justify-center text-center p-4">
                        <FileText size={32} className="text-slate-300 mb-2" />
                        <span className="text-[11px] font-bold text-slate-500 line-clamp-1">{work.coverName || '项目主图'}</span>
                        <span className="text-[9px] text-slate-400 mt-1">作品视觉展示占位</span>
                      </div>
                    )}
                    
                    <div className="highlights-box p-4 rounded border border-slate-100 bg-slate-50">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">成果数据 & 亮点</h4>
                      <p className="text-slate-800 text-xs font-semibold leading-relaxed whitespace-pre-wrap">{work.highlights || '精细化执行与落地。'}</p>
                      
                      {work.dataFeedback && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-sm font-bold text-indigo-600">{work.dataFeedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="tools-box">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">使用工具</h4>
                      <p className="text-xs text-slate-600">{work.tools || '未标明'}</p>
                    </div>
                  </div>
                  
                  {/* 右栏：项目说明 (如果AI优化过则渲染结构化排版，否则排版标准段落) */}
                  <div className="col-span-3 space-y-6">
                    {work.projectDescription && work.optimized ? (
                      <div className="prose-container text-xs text-slate-600 leading-relaxed">
                        <div dangerouslySetInnerHTML={{ 
                          __html: work.projectDescription
                            .replace(/\n/g, '<br/>')
                            .replace(/### (.*?)(<br\/>|$)/g, '<h4 class="work-section-h">$1</h4>')
                        }} />
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                        <div>
                          <h4 className="work-section-h">项目背景</h4>
                          <p className="whitespace-pre-wrap">{work.background || '未提供项目详细背景'}</p>
                        </div>
                        <div>
                          <h4 className="work-section-h">执行过程</h4>
                          <p className="whitespace-pre-wrap">{work.process || '未提供执行步骤细节'}</p>
                        </div>
                        <div className="tip-box bg-amber-50 text-amber-800 p-3 rounded border border-amber-100 text-[10px] font-medium flex items-start gap-1">
                          <span>💡</span>
                          <span>建议前往“AI优化”栏目一键重写项目描述，生成高品质结构化排版。</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="page-footer">
                <span>PORTFOLIO / {targetJob}</span>
                <span>{String(pageNum).padStart(2, '0')}</span>
              </div>
            </div>
          );
        })}

        {/* 4. 封底页 */}
        <div className="a4-page page-back print-avoid-break">
          <div className="page-header">
            <span>Portfolio Showcase</span>
            <span>BACK COVER</span>
          </div>

          <div className="back-main flex-1 flex flex-col justify-center items-center text-center">
            <h1 className="back-title mb-4">THANK YOU.</h1>
            <div className="w-12 h-1 bg-slate-900 mb-6"></div>
            <p className="text-sm text-slate-400">期待与您的进一步沟通交流</p>
            <p className="text-xs text-slate-400 mt-2 font-mono">Generated by Let Works Speak Portfolio Assistant</p>
          </div>

          <div className="page-footer">
            <span>PORTFOLIO / END</span>
            <span>{String(portfolioWorks.length + 3).padStart(2, '0')}</span>
          </div>
        </div>

      </div>

      {/* 动态模板 CSS 注入 */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* --- A4 Page Setup (Screen View) --- */
        .a4-page {
          width: 210mm;
          height: 297mm;
          min-height: 297mm;
          margin: 30px auto;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          box-sizing: border-box;
          padding: 20mm 20mm 15mm 20mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 4px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          padding-bottom: 6px;
          border-bottom: 1px solid #e2e8f0;
          color: #94a3b8;
          font-family: sans-serif;
        }

        .page-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: #94a3b8;
          padding-top: 6px;
          border-top: 1px solid #e2e8f0;
          font-family: sans-serif;
        }

        /* --- 模板1：经典杂志 (Magazine) --- */
        .template-magazine {
          background-color: #f1f5f9;
        }
        .template-magazine .a4-page {
          font-family: 'Outfit', 'Noto Sans SC', sans-serif;
          color: #1e293b;
        }
        .template-magazine .cover-title {
          font-size: 4rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .template-magazine .section-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
        }
        .template-magazine .overview-subtitle,
        .template-magazine .work-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
        }
        .template-magazine .tag-badge {
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 2px;
        }
        .template-magazine .tag-primary {
          background-color: #0f172a;
          color: #ffffff;
        }
        .template-magazine .tag-secondary {
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }
        .template-magazine .work-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 2px;
        }
        .template-magazine .badge-primary {
          background-color: #e0e7ff;
          color: #4f46e5;
        }
        .template-magazine .badge-secondary {
          background-color: #f1f5f9;
          color: #475569;
        }
        .template-magazine .work-section-h {
          font-size: 11px;
          font-weight: 800;
          color: #4f46e5;
          text-transform: uppercase;
          border-bottom: 2px solid #e0e7ff;
          padding-bottom: 2px;
          margin-top: 14px;
          margin-bottom: 6px;
        }
        .template-magazine .back-title {
          font-size: 3.5rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: 0.05em;
        }

        /* --- 模板2：优雅极简 (Minimalist) --- */
        .template-minimalist {
          background-color: #f5f4ef;
        }
        .template-minimalist .a4-page {
          font-family: Georgia, 'Noto Serif SC', serif;
          background-color: #fefdfb;
          color: #2e2e2e;
          box-shadow: 0 10px 30px rgba(139, 90, 43, 0.05);
        }
        .template-minimalist .page-header,
        .template-minimalist .page-footer {
          border-color: rgba(184, 134, 11, 0.15);
          color: #a89472;
          font-style: italic;
        }
        .template-minimalist .cover-title {
          font-size: 3.2rem;
          font-weight: 300;
          color: #1c1c1c;
          letter-spacing: 0.05em;
        }
        .template-minimalist .section-title {
          font-size: 1.6rem;
          font-weight: 400;
          color: #1c1c1c;
          letter-spacing: 0.02em;
        }
        .template-minimalist .overview-subtitle,
        .template-minimalist .work-title {
          font-size: 1.3rem;
          font-weight: 400;
          color: #1c1c1c;
        }
        .template-minimalist .tag-badge {
          padding: 6px 14px;
          font-size: 11px;
          border-radius: 0px;
          font-style: italic;
        }
        .template-minimalist .tag-primary {
          background-color: #8c6d31;
          color: #ffffff;
        }
        .template-minimalist .tag-secondary {
          background-color: transparent;
          color: #6e6e6e;
          border: 1px solid rgba(140, 109, 49, 0.25);
        }
        .template-minimalist .work-badge {
          font-size: 9px;
          font-style: italic;
          padding: 1px 6px;
          border-radius: 0px;
          border: 1px solid #cbd5e1;
        }
        .template-minimalist .badge-primary {
          border-color: #8c6d31;
          color: #8c6d31;
          background: transparent;
        }
        .template-minimalist .badge-secondary {
          color: #7e7e7e;
          background: transparent;
        }
        .template-minimalist .work-section-h {
          font-size: 11px;
          font-weight: 700;
          font-style: italic;
          color: #8c6d31;
          border-bottom: 1px solid rgba(140, 109, 49, 0.2);
          padding-bottom: 2px;
          margin-top: 14px;
          margin-bottom: 6px;
        }
        .template-minimalist .back-title {
          font-size: 3rem;
          font-weight: 300;
          color: #1c1c1c;
          letter-spacing: 0.1em;
        }
        .template-minimalist .overview-card,
        .template-minimalist .highlights-box {
          border-color: rgba(140, 109, 49, 0.15);
          background: #faf8f3;
        }

        /* --- 模板3：数智未来 (Tech) --- */
        .template-tech {
          background-color: #0b0f19;
        }
        .template-tech .a4-page {
          font-family: 'Consolas', 'Courier New', sans-serif;
          background-color: #0f172a;
          color: #cbd5e1;
          box-shadow: 0 10px 40px rgba(6, 182, 212, 0.05);
          border: 1px solid rgba(6, 182, 212, 0.15);
        }
        .template-tech .page-header,
        .template-tech .page-footer {
          border-color: rgba(6, 182, 212, 0.2);
          color: #06b6d4;
        }
        .template-tech .cover-title {
          font-size: 2.8rem;
          font-weight: bold;
          color: #06b6d4;
          text-shadow: 0 0 15px rgba(6, 182, 212, 0.35);
        }
        .template-tech .section-title {
          font-size: 1.6rem;
          color: #38bdf8;
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
        }
        .template-tech .section-subtitle {
          color: #64748b;
        }
        .template-tech .overview-subtitle,
        .template-tech .work-title {
          font-size: 1.2rem;
          color: #38bdf8;
          font-weight: bold;
        }
        .template-tech .tag-badge {
          padding: 6px 12px;
          font-size: 11px;
          border-radius: 4px;
          font-family: monospace;
        }
        .template-tech .tag-primary {
          background-color: #06b6d4;
          color: #0f172a;
          font-weight: bold;
        }
        .template-tech .tag-secondary {
          background-color: rgba(15, 23, 42, 0.6);
          color: #06b6d4;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }
        .template-tech .work-badge {
          font-size: 9px;
          padding: 1px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
        .template-tech .badge-primary {
          background-color: rgba(139, 92, 246, 0.2);
          color: #c084fc;
          border: 1px solid rgba(139, 92, 246, 0.4);
        }
        .template-tech .badge-secondary {
          background-color: rgba(51, 65, 85, 0.5);
          color: #94a3b8;
          border: 1px solid rgba(51, 65, 85, 0.8);
        }
        .template-tech .work-section-h {
          font-size: 11px;
          font-weight: bold;
          color: #22d3ee;
          background-color: rgba(6, 182, 212, 0.08);
          padding: 2px 6px;
          border-left: 3px solid #06b6d4;
          margin-top: 14px;
          margin-bottom: 6px;
        }
        .template-tech .back-title {
          font-size: 3rem;
          color: #06b6d4;
          text-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
        }
        .template-tech .overview-card,
        .template-tech .highlights-box {
          border-color: rgba(6, 182, 212, 0.2);
          background: rgba(15, 23, 42, 0.8);
        }
        .template-tech .work-cover-placeholder {
          background-color: #1e293b;
          border-color: rgba(56, 189, 248, 0.25);
        }
        .template-tech .text-slate-600 {
          color: #94a3b8;
        }
        .template-tech .text-slate-800 {
          color: #e2e8f0;
        }

        /* --- 模板4：创意画册 (Lookbook) --- */
        .template-lookbook {
          background-color: #e2e8f0;
        }
        .template-lookbook .a4-page {
          font-family: sans-serif;
          color: #111111;
        }
        .template-lookbook .cover-title {
          font-size: 4.8rem;
          font-weight: 900;
          color: #000;
          line-height: 0.95;
          letter-spacing: -0.04em;
        }
        .template-lookbook .section-title {
          font-size: 2rem;
          font-weight: 900;
          color: #000000;
          text-transform: uppercase;
        }
        .template-lookbook .overview-subtitle,
        .template-lookbook .work-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #000;
          text-transform: uppercase;
        }
        .template-lookbook .tag-badge {
          padding: 8px 14px;
          font-size: 11px;
          font-weight: bold;
          border-radius: 0px;
        }
        .template-lookbook .tag-primary {
          background-color: #dc2626;
          color: #ffffff;
        }
        .template-lookbook .tag-secondary {
          background-color: #f8fafc;
          color: #111;
          border: 2px solid #111;
        }
        .template-lookbook .work-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 0px;
        }
        .template-lookbook .badge-primary {
          background-color: #fee2e2;
          color: #dc2626;
        }
        .template-lookbook .badge-secondary {
          background-color: #f1f5f9;
          color: #111111;
        }
        .template-lookbook .work-section-h {
          font-size: 11px;
          font-weight: 900;
          color: #dc2626;
          text-transform: uppercase;
          border-left: 4px solid #000000;
          padding-left: 6px;
          margin-top: 14px;
          margin-bottom: 6px;
        }
        .template-lookbook .back-title {
          font-size: 3.8rem;
          font-weight: 950;
          color: #000;
        }
        .template-lookbook .overview-card,
        .template-lookbook .highlights-box {
          border: 2px solid #111;
          background: #ffffff;
          box-shadow: 4px 4px 0px #000;
        }
        .template-lookbook .work-cover-placeholder {
          border: 2px solid #111;
          box-shadow: 4px 4px 0px #000;
          background: #ffffff;
        }

        /* --- 模板5：模块化 (Bento) --- */
        .template-bento {
          background-color: #f3f4f6;
        }
        .template-bento .a4-page {
          font-family: 'Inter', -apple-system, sans-serif;
          background-color: #ffffff;
          border-radius: 24px;
          color: #111827;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
          padding: 24mm 24mm;
        }
        .template-bento .page-header, .template-bento .page-footer {
          border-color: #f3f4f6;
          color: #9ca3af;
        }
        .template-bento .cover-title {
          font-size: 4.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #111827 0%, #4b5563 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .template-bento .section-title {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .template-bento .work-title {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .template-bento .overview-card, .template-bento .highlights-box, .template-bento .work-cover-image {
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .template-bento .tag-badge {
          border-radius: 9999px;
          padding: 6px 14px;
          background: #f3f4f6;
          color: #374151;
        }
        .template-bento .tag-primary {
          background: #111827;
          color: #ffffff;
        }
        .template-bento .work-section-h {
          font-size: 12px;
          font-weight: 700;
          color: #4b5563;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        /* --- 模板6：极简文档 (Notion) --- */
        .template-notion {
          background-color: #ffffff;
        }
        .template-notion .a4-page {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
          color: #37352f;
          box-shadow: none;
          border: 1px solid #e9e9e7;
          border-radius: 3px;
        }
        .template-notion .page-header, .template-notion .page-footer {
          border-color: #ededed;
          color: #9b9a97;
        }
        .template-notion .cover-title {
          font-size: 3rem;
          font-weight: 700;
        }
        .template-notion .section-title, .template-notion .work-title {
          font-size: 1.8rem;
          font-weight: 700;
          border-bottom: 1px solid #ededed;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }
        .template-notion .tag-badge {
          background: rgba(227, 226, 224, 0.5);
          color: #32302c;
          border-radius: 3px;
          padding: 4px 8px;
        }
        .template-notion .overview-card, .template-notion .highlights-box, .template-notion .work-cover-image {
          background: transparent;
          border: 1px solid #e9e9e7;
          border-radius: 3px;
        }
        .template-notion .work-section-h {
          font-size: 14px;
          font-weight: 600;
          color: #37352f;
          margin-top: 20px;
          margin-bottom: 8px;
        }

        /* --- 模板7：横向演示 (Landscape) --- */
        .template-landscape .a4-page {
          width: 297mm;
          height: 210mm;
          min-height: 210mm;
          padding: 15mm 20mm;
          background-color: #1e1e1e;
          color: #ffffff;
        }
        .template-landscape .page-header, .template-landscape .page-footer {
          border-color: #333333;
          color: #888888;
        }
        .template-landscape .cover-title {
          font-size: 4rem;
          font-weight: bold;
          background: linear-gradient(90deg, #ff8a00, #e52e71);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .template-landscape .section-title, .template-landscape .work-title {
          font-size: 2.2rem;
          font-weight: bold;
          color: #ffffff;
        }
        .template-landscape .overview-card, .template-landscape .highlights-box, .template-landscape .work-cover-image {
          background: #2a2a2a;
          border: none;
          border-radius: 8px;
        }
        .template-landscape .text-slate-600 {
          color: #aaaaaa;
        }
        .template-landscape .tag-badge {
          background: #333333;
          color: #ffffff;
          border-radius: 4px;
        }
        .template-landscape .tag-primary {
          background: #e52e71;
        }

        /* --- Printing Rules --- */
        @media print {
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .preview-wrapper {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .pt-24 {
            padding-top: 0 !important;
          }
          .a4-page {
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            page-break-after: always !important;
            break-after: page !important;
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .template-landscape .a4-page {
            width: 297mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
          }
          
          @page {
            size: A4 portrait;
            margin: 0;
          }
          .template-landscape @page {
            size: A4 landscape;
          }
          
          /* Dark template special printing rule */
          .template-tech .a4-page {
            background-color: #0f172a !important;
            color: #cbd5e1 !important;
            border: none !important;
          }
          .template-minimalist .a4-page {
            background-color: #fefdfb !important;
          }
          .template-tech .text-slate-600 {
            color: #94a3b8 !important;
          }
          .template-tech .text-slate-800 {
            color: #e2e8f0 !important;
          }
        }
      `}} />
    </div>
  );
};

export default PortfolioPreview;
