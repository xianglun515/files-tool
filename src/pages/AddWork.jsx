import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import { simulateAIAnalysis } from '../utils/aiSimulator';
import { Sparkles, Save, Info } from 'lucide-react';

const AddWork = () => {
  const { addWork } = useContext(PortfolioContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '', type: '图文作品', source: '', date: '', role: '', tools: '',
    background: '', targetUser: '', idea: '', process: '', highlights: '',
    materials: '', dataFeedback: '', coverName: ''
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.title) return alert('请输入作品名称');
    
    // 如果有 AI 分析结果，一并保存
    const workToSave = { ...formData };
    if (analysisResult) {
      workToSave.tags = analysisResult.tags;
      workToSave.jobs = analysisResult.jobs;
      workToSave.matchReasons = analysisResult.matchReasons;
    }
    
    addWork(workToSave);
    navigate('/library');
  };

  const handleAIAnalyze = async () => {
    if (!formData.title) return alert('请至少输入作品名称和基本信息再进行分析');
    setAnalyzing(true);
    const result = await simulateAIAnalysis(formData);
    setAnalysisResult(result);
    setAnalyzing(false);
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">添加新作品</h1>
        <p className="text-muted">请尽可能详细地填写，结构化的输入能帮助 AI 更准确地提取你的核心能力。</p>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">基础信息</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">作品名称 *</label>
            <input type="text" name="title" className="form-input" placeholder="如：校园迎新短视频" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">作品类型 *</label>
            <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
              <option value="图文作品">图文作品</option>
              <option value="短视频作品">短视频作品</option>
              <option value="策划案">策划案</option>
              <option value="视觉设计作品">视觉设计作品</option>
              <option value="调研报告">调研报告</option>
              <option value="融媒体作品">融媒体作品</option>
              <option value="实习项目">实习项目</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">作品来源</label>
            <input type="text" name="source" className="form-input" placeholder="如：课程作业、竞赛、实习" value={formData.source} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">完成时间</label>
            <input type="month" name="date" className="form-input" value={formData.date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">个人角色</label>
            <input type="text" name="role" className="form-input" placeholder="如：导演、剪辑、文案" value={formData.role} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">使用工具</label>
            <input type="text" name="tools" className="form-input" placeholder="如：PR, PS, Excel" value={formData.tools} onChange={handleChange} />
          </div>
          <div className="form-group col-span-2">
            <label className="form-label">上传封面 / 填写文件名 (仅归档展示)</label>
            <input type="text" name="coverName" className="form-input" placeholder="如：项目封面图.jpg" value={formData.coverName} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">深度结构化描述</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="form-group">
            <label className="form-label">项目背景 (为什么做？)</label>
            <textarea name="background" className="form-textarea h-24" placeholder="描述项目发起的初衷和背景..." value={formData.background} onChange={handleChange}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">目标用户</label>
              <input type="text" name="targetUser" className="form-input" value={formData.targetUser} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">核心创意</label>
              <input type="text" name="idea" className="form-input" value={formData.idea} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">执行过程 (你怎么做的？遇到什么困难如何解决？)</label>
            <textarea name="process" className="form-textarea h-32" placeholder="详细描述你的行动步骤..." value={formData.process} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">成果亮点 (最终取得了什么效果？)</label>
            <textarea name="highlights" className="form-textarea h-24" placeholder="突出的创意或获得的好评..." value={formData.highlights} onChange={handleChange}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">过程材料文件名</label>
              <input type="text" name="materials" className="form-input" placeholder="如：分镜脚本.pdf" value={formData.materials} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">数据反馈 (阅读量、奖项等)</label>
              <input type="text" name="dataFeedback" className="form-input" placeholder="如：阅读量2w+" value={formData.dataFeedback} onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky bottom-6 z-10">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Info size={16} />
          <span>结构化数据已自动保存在本地</span>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={handleAIAnalyze} disabled={analyzing}>
            <Sparkles size={16} />
            {analyzing ? 'AI分析中...' : 'AI分析作品能力'}
          </button>
          <button className="btn btn-secondary bg-gray-900 text-white hover:bg-gray-800" onClick={handleSave}>
            <Save size={16} />
            保存至作品库
          </button>
        </div>
      </div>

      {analysisResult && (
        <div className="mt-8 card border-primary-color animate-fade-in mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-primary-color" size={20} />
            <h2 className="text-lg font-bold">AI 分析结果</h2>
          </div>
          <div className="ai-alert mb-4">
            <Info size={20} className="flex-shrink-0" />
            <p>AI 生成内容仅供参考，请勿虚构项目经历、夸大个人职责或编造数据。成果数据、获奖情况和个人贡献需要由您本人确认。</p>
          </div>
          
          <div className="grid gap-6">
            <div>
              <h3 className="font-medium text-sm text-muted mb-2">提取能力标签</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.tags.map((tag, idx) => (
                  <span key={idx} className="chip">{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted mb-2">适配岗位推荐</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.jobs.map((job, idx) => (
                  <span key={idx} className="chip chip-success">{job}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted mb-2">匹配理由</h3>
              <p className="bg-gray-50 p-4 rounded-md text-sm leading-relaxed">
                {analysisResult.matchReasons}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWork;
