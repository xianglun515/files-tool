import React, { useContext, useState } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';
import { Briefcase, Target, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobMatching = () => {
  const { works } = useContext(PortfolioContext);
  
  const jobsList = [
    '新媒体运营', '内容运营', '广告策划', '品牌策划', 
    '活动策划', '短视频策划', '视觉策划', '融媒体产品助理', 
    '用户研究助理', '交互设计助理'
  ];

  const [selectedJob, setSelectedJob] = useState('新媒体运营');

  // 计算匹配度逻辑模拟
  const calculateMatch = (work, targetJob) => {
    if (!work.jobs || !work.tags) return { score: 0, reason: '未进行AI分析或数据缺失' };
    
    // 如果直接在适配岗位里，基础分高
    let score = work.jobs.includes(targetJob) ? 80 : 40;
    
    // 随机上下浮动一点分数，模拟复杂算法
    score += Math.floor(Math.random() * 15);
    if (score > 98) score = 98;

    return {
      score,
      reason: work.matchReasons || `该作品体现的能力与${targetJob}部分需求契合。`
    };
  };

  const matchedWorks = works.map(work => {
    const matchData = calculateMatch(work, selectedJob);
    return { ...work, matchData };
  }).sort((a, b) => b.matchData.score - a.matchData.score)
    .filter(w => w.matchData.score > 50); // 只显示匹配度>50的作品

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">岗位匹配推荐</h1>
        <p className="text-muted">选择你的目标求职岗位，系统将为你挑选最适合展示的作品，并建议展示顺序。</p>
      </div>

      <div className="card mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Briefcase size={20} className="text-primary-color" />
          选择目标岗位
        </h2>
        <div className="flex flex-wrap gap-3">
          {jobsList.map(job => (
            <button
              key={job}
              onClick={() => setSelectedJob(job)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedJob === job 
                  ? 'bg-primary-color text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {job}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Target size={20} className="text-green-500" />
          基于“{selectedJob}”的作品推荐
        </h2>
        <span className="text-sm text-muted">共找到 {matchedWorks.length} 个较匹配的作品</span>
      </div>

      {matchedWorks.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-muted mb-4">没有找到特别匹配该岗位的作品。</p>
          <p className="text-sm">建议：尝试在“添加作品”或“作品库”中完善作品描述并进行AI分析，或者选择其他岗位。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matchedWorks.map((work, index) => (
            <div key={work.id} className="card relative overflow-hidden group mb-6">
              {/* 推荐序号标签 */}
              <div className="absolute top-0 left-0 bg-primary-color text-white px-4 py-1.5 rounded-br-lg text-xs font-bold z-10 shadow-sm">
                推荐顺序 #{index + 1}
              </div>
              
              <div className="flex gap-6 mt-4 items-stretch">
                {/* 左侧匹配度 */}
                <div className="w-32 flex flex-col items-center justify-center border-r border-gray-100 pr-6 flex-shrink-0">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                      <circle cx="40" cy="40" r="36" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="40" r="36" stroke={work.matchData.score > 80 ? '#10B981' : '#F59E0B'} strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset={226 - (226 * work.matchData.score) / 100} className="transition-all" style={{ transitionDuration: '1000ms' }} />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xl font-bold">{work.matchData.score}</span>
                      <Percent size={12} className="text-muted -mt-1" />
                    </div>
                  </div>
                  <span className="text-xs text-muted mt-2">匹配度</span>
                </div>

                {/* 右侧详情 */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/details/${work.id}`} className="text-lg font-bold hover:text-primary-color transition-colors line-clamp-1">
                      {work.title}
                    </Link>
                    <span className="chip flex-shrink-0">{work.type}</span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">匹配理由：</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">{work.matchData.reason}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted mb-1">核心体现能力：</p>
                    <div className="flex flex-wrap gap-1">
                      {work.tags?.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="chip chip-secondary text-[10px] px-2 py-0.5">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatching;
