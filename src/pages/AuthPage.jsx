import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (isLogin) {
      // 登录
      if (!formData.email || !formData.password) {
        setFormError('请填写邮箱和密码');
        setSubmitting(false);
        return;
      }
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setFormError(result.message);
        setSubmitting(false);
      } else {
        setFormSuccess('登录成功，正在跳转...');
      }
    } else {
      // 注册
      if (!formData.username || !formData.email || !formData.password) {
        setFormError('请填写所有必填项');
        setSubmitting(false);
        return;
      }
      if (formData.password.length < 6) {
        setFormError('密码至少需要6位');
        setSubmitting(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setFormError('两次输入的密码不一致');
        setSubmitting(false);
        return;
      }
      const result = await register(formData.username, formData.email, formData.password);
      if (!result.success) {
        setFormError(result.message);
        setSubmitting(false);
      } else {
        setFormSuccess('注册成功，正在为您登录...');
      }
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormError('');
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div style={styles.pageWrapper}>
      {/* 装饰性背景 */}
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.bgOrb3} />

      <div style={styles.container}>
        {/* 左侧品牌区 */}
        <div style={styles.brandSide}>
          <div style={styles.brandContent}>
            <div style={styles.logoMark}>
              <Sparkles size={32} color="white" />
            </div>
            <h1 style={styles.brandTitle}>让作品会说话</h1>
            <p style={styles.brandSubtitle}>传媒生作品集成长助手</p>
            <div style={styles.brandDivider} />
            <p style={styles.brandDesc}>
              把零散作品转化为可展示、可讲述、可投递的求职作品集。
              用 AI 赋能每一份作品，让你的能力被看见。
            </p>
            <div style={styles.featureList}>
              {['智能作品管理', 'AI 优化建议', '一键生成作品集'].map((f, i) => (
                <div key={i} style={styles.featureItem}>
                  <div style={styles.featureDot} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧表单区 */}
        <div style={styles.formSide}>
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>{isLogin ? '欢迎回来' : '创建账号'}</h2>
              <p style={styles.formSubtitle}>
                {isLogin ? '登录后继续管理你的作品集' : '注册后即刻开始成长之旅'}
              </p>
            </div>

            {formError && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>⚠</span>
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div style={styles.successBox}>
                <span style={styles.successIcon}>✓</span>
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {!isLogin && (
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>用户名</label>
                  <div style={styles.inputWrapper}>
                    <User size={18} style={styles.inputIcon} />
                    <input
                      type="text"
                      name="username"
                      placeholder="输入你的用户名"
                      value={formData.username}
                      onChange={handleChange}
                      style={styles.input}
                      autoComplete="username"
                    />
                  </div>
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>邮箱地址</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} style={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>密码</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.inputIcon} />
                  <input
                    type="password"
                    name="password"
                    placeholder={isLogin ? '输入密码' : '至少6位密码'}
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                </div>
              </div>

              {!isLogin && (
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>确认密码</label>
                  <div style={styles.inputWrapper}>
                    <Lock size={18} style={styles.inputIcon} />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="再次输入密码"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={styles.input}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.submitBtn,
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? (
                  <span style={styles.loadingDots}>处理中...</span>
                ) : (
                  <>
                    <span>{isLogin ? '登 录' : '注 册'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div style={styles.switchRow}>
              <span style={styles.switchText}>
                {isLogin ? '还没有账号？' : '已有账号？'}
              </span>
              <button onClick={switchMode} style={styles.switchBtn}>
                {isLogin ? '立即注册' : '去登录'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Inline Styles ============
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff1f2 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '1rem',
  },
  bgOrb1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
    top: '-200px',
    left: '-150px',
    animation: 'float 8s ease-in-out infinite',
  },
  bgOrb2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
    bottom: '-150px',
    right: '-100px',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  bgOrb3: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
    top: '50%',
    left: '60%',
    animation: 'float 12s ease-in-out infinite',
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    minHeight: '600px',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5)',
    position: 'relative',
    zIndex: 1,
  },
  // ---- 左侧品牌 ----
  brandSide: {
    flex: '1 1 45%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    padding: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  brandContent: {
    position: 'relative',
    zIndex: 2,
    color: 'white',
  },
  logoMark: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  brandTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: '1rem',
    opacity: 0.85,
    fontWeight: 400,
  },
  brandDivider: {
    width: '50px',
    height: '3px',
    background: 'rgba(255,255,255,0.4)',
    borderRadius: '2px',
    margin: '1.5rem 0',
  },
  brandDesc: {
    fontSize: '0.9rem',
    opacity: 0.8,
    lineHeight: 1.7,
    marginBottom: '2rem',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    opacity: 0.9,
  },
  featureDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.6)',
    flexShrink: 0,
  },
  // ---- 右侧表单 ----
  formSide: {
    flex: '1 1 55%',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    padding: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: '380px',
  },
  formHeader: {
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '0.5rem',
    letterSpacing: '-0.01em',
  },
  formSubtitle: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.75rem',
    color: '#dc2626',
    fontSize: '0.85rem',
    marginBottom: '1.25rem',
  },
  errorIcon: {
    fontSize: '1rem',
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '0.75rem',
    color: '#16a34a',
    fontSize: '0.85rem',
    marginBottom: '1.25rem',
  },
  successIcon: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  inputLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#0f172a',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '0.875rem',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    background: 'rgba(255,255,255,0.8)',
    color: '#0f172a',
    fontFamily: 'inherit',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.85rem 1.5rem',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
  },
  loadingDots: {
    letterSpacing: '0.1em',
  },
  switchRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    marginTop: '1.75rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #f1f5f9',
  },
  switchText: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  switchBtn: {
    fontSize: '0.85rem',
    color: '#6366f1',
    fontWeight: 600,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '0.25rem',
    transition: 'color 0.2s',
  },
};

export default AuthPage;
