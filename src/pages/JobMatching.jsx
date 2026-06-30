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
    <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.4s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>岗位匹配推荐</h2>
        <p>选择你的目标求职岗位，系统将为你挑选最适合展示的作品，并建议展示顺序。</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={20} color="var(--primary-color)" />
          选择目标岗位
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {jobsList.map(job => {
            const isActive = selectedJob === job;
            return (
              <button
                key={job}
                onClick={() => setSelectedJob(job)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '99px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s',
                  background: isActive ? 'var(--primary-color)' : '#f1f5f9',
                  color: isActive ? 'white' : 'var(--text-main)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {job}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' 
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} color="var(--success-color)" />
          基于“{selectedJob}”的作品推荐
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>共找到 {matchedWorks.length} 个较匹配的作品</span>
      </div>

      {matchedWorks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>没有找到特别匹配该岗位的作品。</p>
          <p style={{ fontSize: '0.85rem' }}>建议：尝试在“智能提取”中进行AI分析，或者选择其他岗位。</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {matchedWorks.map((work, index) => (
            <div key={work.id} className="card" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
              {/* 推荐序号标签 */}
              <div style={{
                position: 'absolute', top: 0, left: 0, 
                background: 'var(--primary-color)', color: 'white', 
                padding: '4px 12px', borderBottomRightRadius: '12px', 
                fontSize: '0.75rem', fontWeight: 700, zIndex: 10
              }}>
                推荐顺序 #{index + 1}
              </div>
              
              <div style={{ display: 'flex', gap: '24px', padding: '24px', paddingTop: '32px' }}>
                {/* 左侧匹配度 */}
                <div style={{ 
                  width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                  borderRight: '1px solid var(--border-color)', paddingRight: '24px', flexShrink: 0 
                }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="80" height="80" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                      <circle cx="40" cy="40" r="36" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="40" r="36" 
                        stroke={work.matchData.score > 80 ? 'var(--success-color)' : 'var(--warning-color)'} 
                        strokeWidth="8" fill="none" 
                        strokeDasharray="226" 
                        strokeDashoffset={226 - (226 * work.matchData.score) / 100} 
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }} 
                      />
                    </svg>
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{work.matchData.score}</span>
                      <Percent size={12} color="var(--text-muted)" style={{ marginTop: '-4px' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>匹配度</span>
                </div>

                {/* 右侧详情 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <Link to={`/details/${work.id}`} style={{ 
                      fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', 
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                    }}>
                      {work.title}
                    </Link>
                    <span className="chip" style={{ flexShrink: 0 }}>{work.type}</span>
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>匹配理由：</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      {work.matchData.reason}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>核心体现能力：</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {work.tags?.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="chip chip-secondary" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{tag}</span>
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

