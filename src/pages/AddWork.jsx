import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext';
import { UploadCloud, FileType, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';

const AddWork = () => {
  const { addWork } = useContext(PortfolioContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', 
    type: '图文作品'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

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
    // 自动用文件名（去掉后缀）填充标题
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

  const handleSave = async () => {
    if (!file) {
      return setError('请先拖入或选择您的作品文件');
    }
    if (!formData.title) {
      return setError('请输入作品名称');
    }
    
    setSaving(true);
    
    // 这里未来会将 file 上传到云存储 (OSS / S3)
    // 目前演示阶段，我们仅保存基本信息和文件名
    const workToSave = { 
      ...formData,
      materials: file.name, // 记录文件名
      // 为了兼容现有 mock 逻辑，填入一些空值
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
      setSaving(false);
    } else {
      navigate('/library');
    }
  };

  const removeFile = () => {
    setFile(null);
    setFormData(prev => ({ ...prev, title: '' }));
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold mb-3 text-gradient inline-block" style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          极简上传，AI 懂你
        </h1>
        <p className="text-muted text-lg">告别繁琐的表单。只需拖入源文件，剩下的交给 AI 自动提取、优化包装。</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* 拖拽上传区域 */}
      <div 
        className={`mb-8 border-3 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center p-12 cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 shadow-[0_0_40px_rgba(59,130,246,0.2)] scale-[1.02]' 
            : file 
              ? 'border-emerald-400 bg-emerald-50/50'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
          }`}
        style={{ minHeight: '320px' }}
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
            <div className={`mx-auto w-24 h-24 mb-6 rounded-full flex items-center justify-center transition-transform duration-500 ${isDragging ? 'bg-blue-100 scale-110' : 'bg-slate-200'}`}>
              <UploadCloud size={48} className={isDragging ? 'text-blue-600' : 'text-slate-500'} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">
              {isDragging ? '松开鼠标即可上传' : '点击或将文件拖拽到这里'}
            </h3>
            <p className="text-slate-500 mb-6">支持 PDF, Word, PPT, 图片, 视频格式。最大 100MB。</p>
            <span className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full font-medium shadow-sm">
              选择文件
            </span>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-5 relative group">
              <div className="w-16 h-16 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <FileType size={32} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg text-slate-800 truncate pr-8" title={file.name}>
                  {file.name}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                  <span>{formatFileSize(file.size)}</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle size={14} /> 上传成功
                  </span>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                title="移除文件"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-blue-500" />
                完善基础信息（AI 将基于此进行优化）
              </h4>
              <div className="grid gap-5">
                <div className="form-group text-left">
                  <label className="form-label text-sm text-slate-600">作品名称 *</label>
                  <input 
                    type="text" 
                    name="title" 
                    className="w-full p-3 border-1.5 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                    placeholder="如：校园迎新短视频" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group text-left">
                  <label className="form-label text-sm text-slate-600">作品类型 *</label>
                  <select 
                    name="type" 
                    className="w-full p-3 border-1.5 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                    value={formData.type} 
                    onChange={handleChange}
                  >
                    <option value="图文作品">图文作品</option>
                    <option value="短视频作品">短视频作品</option>
                    <option value="策划案">策划案</option>
                    <option value="视觉设计作品">视觉设计作品</option>
                    <option value="调研报告">调研报告</option>
                    <option value="实习项目">实习项目</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-10">
        <button 
          onClick={handleSave}
          disabled={saving || !file}
          className={`flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-bold shadow-lg transition-all
            ${(!file || saving) 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1'}`}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              正在上传分析中...
            </span>
          ) : (
            <>
              <Save size={24} />
              上传并交给 AI 优化
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddWork;
