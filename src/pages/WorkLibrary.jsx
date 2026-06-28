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

    // 如果是图片，读取为 Base64 以供展示
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFormData(prev => ({ ...prev, coverImage: null }));
    }
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
      background: '未提供',
      idea: '未提供',
      process: '未提供',
    };
    
    const res = await addWork(workToSave);
    if (res && res.success === false) {
      setError(res.message || '保存失败');
    } else {
      // 成功后清空状态
      setFile(null);
      setFormData({ title: '', type: '图文作品', coverImage: null });
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>作品库</h1>
          <p style={{ color: 'var(--text-muted)' }}>统一管理所有源文件、作品履历，并交由 AI 一键提炼话术。</p>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--danger-bg)', color: 'var(--danger-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ================= 拖拽上传区域 ================= */}
      <div 
        className="card"
        style={{ 
          marginBottom: '2.5rem', 
          border: isDragging ? '1px solid var(--primary-color)' : '1px dashed rgba(0,0,0,0.15)',
          background: isDragging ? 'rgba(0, 113, 227, 0.05)' : 'var(--surface-color)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          padding: '2rem', cursor: 'pointer',
          minHeight: file ? 'auto' : '220px',
          boxShadow: isDragging ? 'var(--shadow-md)' : 'none'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          style={{ display: 'none' }}
          ref={fileInputRef} 
          onChange={handleFileChange}
        />

        {!file ? (
          <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ margin: '0 auto 1rem', width: '56px', height: '56px', borderRadius: '50%', background: isDragging ? 'rgba(0,113,227,0.1)' : 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={28} style={{ color: isDragging ? 'var(--primary-color)' : 'var(--text-light)' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              {isDragging ? '松开鼠标即可添加' : '将新作品拖拽到这里，或点击选择'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>支持 PDF, Word, 图片, 视频等常用格式</p>
          </div>
        ) : (
          <div style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {/* 文件信息块 */}
              <div className="group" style={{ flex: 1, background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0,113,227,0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileType size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '2rem' }} title={file.name}>
                    {file.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{formatFileSize(file.size)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)', fontWeight: 500 }}>
                      <CheckCircle size={12} /> 待保存
                    </span>
                  </div>
                </div>
                <button 
                  onClick={removeFile}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', padding: '6px', color: 'var(--text-light)', background: 'transparent', border: 'none', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s' }}
                  title="移除文件"
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ff3b30'; e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* 信息补全与保存 */}
              <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  name="title" 
                  className="form-input" 
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)', outline: 'none' }}
                  placeholder="作品名称" 
                  value={formData.title} 
                  onChange={handleChange} 
                />
                <select 
                  name="type" 
                  className="form-select"
                  style={{ width: '120px', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)', outline: 'none' }}
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
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 1.25rem', borderRadius: '12px', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? '保存中...' : <><Save size={16} /> 保存</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 列表区域 ================= */}
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', border: 'none' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.6)', outline: 'none', fontSize: '0.85rem' }} 
            placeholder="搜索作品名称或关键词..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ width: '160px' }}>
          <select 
            style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.6)', outline: 'none', fontSize: '0.85rem' }} 
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
        <div style={{ width: '160px' }}>
          <select 
            style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.6)', outline: 'none', fontSize: '0.85rem' }} 
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

      {filteredWorks.length === 0 ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', textAlign: 'center', border: 'none' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(0,0,0,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <FolderPlus size={32} style={{ color: 'var(--text-light)' }} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>没有找到相关作品</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>您可以尝试调整筛选条件，或者在上方拖拽上传新的作品。</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {filteredWorks.map(work => (
            <div key={work.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', border: 'none' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {work.coverImage ? (
                  <div style={{ 
                    height: '140px', 
                    borderRadius: '12px', 
                    marginBottom: '1rem',
                    backgroundImage: `url(${work.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }} />
                ) : (
                  <div style={{
                    height: '140px',
                    borderRadius: '12px',
                    marginBottom: '1rem',
                    background: 'rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <FileType size={32} style={{ color: 'var(--text-light)' }} />
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={work.title}>{work.title}</h3>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
                  <span className="chip">{work.type}</span>
                  {work.materials && (
                    <span className="chip" style={{ background: 'rgba(0, 113, 227, 0.08)', color: 'var(--primary-color)' }} title={work.materials}>
                      📄 {work.materials}
                    </span>
                  )}
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>作品履历标签</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {work.tags?.length > 0 ? work.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="chip" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>{tag}</span>
                    )) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> 未生成标签</span>
                    )}
                    {work.tags?.length > 3 && <span className="chip" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>+{work.tags.length - 3}</span>}
                  </div>
                </div>
              </div>


                <Link to={`/details/${work.id}`} style={{ flex: 1, padding: '0.5rem', textAlign: 'center', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 500, background: 'var(--primary-color)', color: 'white', textDecoration: 'none' }}>
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
