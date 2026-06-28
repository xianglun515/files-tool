import React, { useContext, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import { Search, Filter, FolderPlus, UploadCloud, FileType, CheckCircle, AlertCircle, X, Sparkles, Save } from 'lucide-react';

const WorkLibrary = () => {
  const { works, togglePortfolio, addWork } = useContext(PortfolioContext);
  
  // ================= 1. 上传相关的状态 =================
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', type: '图文作品' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };
  const handleFileSelection = (selectedFile) => {
    setFile(selectedFile);
    if (!formData.title) {
      const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setFormData(prev => ({ ...prev, title: fileNameWithoutExt }));
    }
    setError('');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const removeFile = () => {
    setFile(null);
    setFormData(prev => ({ ...prev, title: '' }));
  };
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSave = async () => {
    if (!file) return setError('请先拖入或选择您的作品文件');
    if (!formData.title) return setError('请输入作品名称');
    
    setSaving(true);
    const workToSave = { 
      ...formData,
      materials: file.name,
      source: '上传文件提取', 
      date: new Date().toISOString().split('T')[0], 
      role: '主创',
      background: '等待 AI 自动从文件中提取...',
      idea: '等待 AI 自动从文件中提取...',
      process: '等待 AI 自动从文件中提取...',
    };
    
    const res = await addWork(workToSave);
    if (res && res.success === false) {
      setError(res.message || '保存失败');
    } else {
      // 成功后清空状态
      setFile(null);
      setFormData({ title: '', type: '图文作品' });
      setError('');
    }
    setSaving(false);
  };


  // ================= 2. 列表相关的状态 =================
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('全部');
  const [filterTag, setFilterTag] = useState('');

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-slate-800">作品库</h1>
          <p className="text-slate-500">统一管理所有源文件、作品履历，并交由 AI 一键提炼话术。</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* ================= 拖拽上传区域 ================= */}
      <div 
        className={`mb-10 border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-8 cursor-pointer
          ${isDragging 
            ? 'border-emerald-500 bg-emerald-50 scale-[1.01]' 
            : file 
              ? 'border-emerald-300 bg-white shadow-sm'
              : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
          }`}
        style={{ minHeight: file ? 'auto' : '220px' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />

        {!file ? (
          <div className="text-center pointer-events-none">
            <div className={`mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center transition-transform duration-500 ${isDragging ? 'bg-emerald-100 scale-110' : 'bg-white shadow-sm'}`}>
              <UploadCloud size={28} className={isDragging ? 'text-emerald-600' : 'text-slate-400'} />
            </div>
            <h3 className="text-lg font-bold mb-1 text-slate-700">
              {isDragging ? '松开鼠标即可添加' : '将新作品拖拽到这里，或点击选择'}
            </h3>
            <p className="text-slate-400 text-sm">支持 PDF, Word, 图片, 视频等常用格式</p>
          </div>
        ) : (
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-6">
              {/* 文件信息块 */}
              <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4 relative group">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileType size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-700 truncate pr-8" title={file.name}>
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle size={12} /> 待保存
                    </span>
                  </div>
                </div>
                <button 
                  onClick={removeFile}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="移除文件"
                >
                  <X size={16} />
                </button>
              </div>

              {/* 信息补全与保存 */}
              <div className="flex-1 flex gap-3">
                <input 
                  type="text" 
                  name="title" 
                  className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  placeholder="作品名称" 
                  value={formData.title} 
                  onChange={handleChange} 
                />
                <select 
                  name="type" 
                  className="w-32 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm" 
                  value={formData.type} 
                  onChange={handleChange}
                >
                  <option value="图文作品">图文作品</option>
                  <option value="短视频">短视频</option>
                  <option value="策划案">策划案</option>
                  <option value="视觉设计">视觉设计</option>
                  <option value="调研报告">调研报告</option>
                </select>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center gap-2 px-6 rounded-xl font-bold transition-all
                    ${saving 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5'}`}
                >
                  {saving ? '保存中...' : <><Save size={18} /> 保存</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 列表区域 ================= */}
      <div className="card mb-8 p-4">
        <div className="flex gap-4 items-center">
          <div className="form-group mb-0 flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm transition-all" 
              placeholder="搜索作品名称或关键词..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-40">
            <select 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 transition-all" 
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="全部">全部类型</option>
              <option value="图文作品">图文作品</option>
              <option value="短视频作品">短视频作品</option>
              <option value="策划案">策划案</option>
              <option value="视觉设计作品">视觉设计作品</option>
            </select>
          </div>
          <div className="w-40">
            <select 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 transition-all" 
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
            >
              <option value="">全部能力标签</option>
              {allTags.map((tag, idx) => (
                <option key={idx} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredWorks.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FolderPlus size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">没有找到相关作品</h3>
          <p className="text-slate-400 text-sm">您可以尝试调整筛选条件，或者在上方拖拽上传新的作品。</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredWorks.map(work => (
            <div key={work.id} className="card flex flex-col h-full hover:shadow-lg transition-all duration-300 border-t-4 border-t-slate-200 hover:border-t-emerald-500 p-5">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 text-slate-800" title={work.title}>{work.title}</h3>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{work.type}</span>
                  {work.materials && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 line-clamp-1 max-w-[120px]" title={work.materials}>
                      📄 {work.materials}
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-slate-400 mb-1.5 font-medium">作品履历标签</p>
                  <div className="flex flex-wrap gap-1.5">
                    {work.tags?.length > 0 ? work.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200">{tag}</span>
                    )) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1"><AlertCircle size={12}/> 未生成标签</span>
                    )}
                    {work.tags?.length > 3 && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200">+{work.tags.length - 3}</span>}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-auto flex justify-between items-center gap-3">
                <Link to={`/ai?workId=${work.id}`} className="flex-1 py-1.5 text-center rounded-lg text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
                  <Sparkles size={12} className="inline mr-1 text-emerald-500" /> AI 提炼话术
                </Link>
                <Link to={`/details/${work.id}`} className="flex-1 py-1.5 text-center rounded-lg text-xs font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors">
                  查看详情
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkLibrary;
