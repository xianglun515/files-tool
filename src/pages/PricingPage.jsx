import React, { useState, useContext } from 'react';
import { SubscriptionContext } from '../context/SubscriptionContext';
import { AuthContext } from '../context/AuthContext';
import { Crown, Check, X, Zap, Sparkles, Shield, CreditCard, QrCode } from 'lucide-react';

const PricingPage = () => {
  const { plan, expiresAt, upgradeToPro, downgradeToFree, loading: subLoading } = useContext(SubscriptionContext);
  const { user } = useContext(AuthContext);
  
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpgradeClick = () => {
    if (!user) {
      alert("请先登录");
      return;
    }
    setShowModal(true);
    setPaymentMethod('');
    setSuccess(false);
  };

  const handleSimulatedPayment = async () => {
    setProcessing(true);
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await upgradeToPro();
    setProcessing(false);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    } else {
      alert("升级失败：" + (result.message || "未知错误"));
    }
  };

  if (subLoading) return null;

  return (
    <div style={{
      maxWidth: '1000px', margin: '0 auto', padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .pricing-card {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pro-card {
          position: relative;
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .pro-card::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 26px;
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
          z-index: -1;
        }
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>
          套餐与定价
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
          选择适合你的方案，释放作品的全部潜力
        </p>
      </div>

      {/* Cards Container */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '40px', alignItems: 'center', marginBottom: '80px' 
      }}>
        
        {/* Free Plan */}
        <div className="pricing-card" style={{
          background: 'white', borderRadius: '24px', padding: '40px',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>基础版</h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>适合刚开始整理作品集的同学</p>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '32px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b' }}>¥0</span>
            <span style={{ color: '#64748b', marginLeft: '4px' }}>/月</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <FeatureItem included>每天 3 次 AI 智能提取</FeatureItem>
            <FeatureItem included>基础作品管理功能</FeatureItem>
            <FeatureItem included>在线作品集预览</FeatureItem>
            <FeatureItem included={false}>无限次 AI 提取</FeatureItem>
            <FeatureItem included={false}>高级视觉大模型</FeatureItem>
          </div>

          <button 
            disabled={plan === 'free'}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: plan === 'free' ? '#f1f5f9' : 'white',
              color: plan === 'free' ? '#94a3b8' : '#0f172a',
              border: plan === 'free' ? 'none' : '1px solid #e2e8f0',
              fontWeight: 600, fontSize: '1rem', cursor: plan === 'free' ? 'not-allowed' : 'pointer'
            }}
          >
            {plan === 'free' ? '当前方案' : '免费使用'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="pricing-card pro-card">
          <div style={{
            position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white',
            padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(168,85,247,0.3)'
          }}>
            <Crown size={14} /> 最受欢迎
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px', display:'flex', alignItems:'center', gap:'8px' }}>
            专业版 <Sparkles size={20} color="#a855f7" />
          </h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>解锁无限制的 AI 能力，打造顶尖作品集</p>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '32px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b' }}>¥29</span>
            <span style={{ color: '#64748b', marginLeft: '4px' }}>/月</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <FeatureItem included><strong>无限制</strong> AI 智能提取</FeatureItem>
            <FeatureItem included>所有基础版功能</FeatureItem>
            <FeatureItem included>专属高级视觉大模型</FeatureItem>
            <FeatureItem included>优先技术支持</FeatureItem>
            <FeatureItem included>新功能抢先体验</FeatureItem>
          </div>

          {plan === 'pro' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: '#f0fdf4', color: '#16a34a', padding: '14px', borderRadius: '12px',
                fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                <Check size={20} /> 已激活专业版
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '12px' }}>
                有效期至：{new Date(expiresAt).toLocaleDateString()}
              </p>
              <button 
                onClick={downgradeToFree}
                style={{
                  background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem',
                  textDecoration: 'underline', marginTop: '12px', cursor: 'pointer'
                }}
              >
                测试用：强制降级到免费版
              </button>
            </div>
          ) : (
            <button 
              onClick={handleUpgradeClick}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                color: 'white', border: 'none',
                fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              立即升级
            </button>
          )}
        </div>
      </div>

      {/* Simulated Payment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative'
            }}
          >
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={24} />
            </button>

            {success ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ 
                  width: '64px', height: '64px', background: '#22c55e', borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                  color: 'white' 
                }}>
                  <Check size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>支付成功！</h3>
                <p style={{ color: '#64748b' }}>您已升级为专业版，尽情享受 AI 的力量吧。</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px', textAlign: 'center' }}>
                  请选择支付方式
                </h3>
                
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <PaymentBtn 
                    active={paymentMethod === 'wechat'} 
                    onClick={() => setPaymentMethod('wechat')}
                    color="#05c160" icon={<QrCode size={18} />} label="微信支付"
                  />
                  <PaymentBtn 
                    active={paymentMethod === 'alipay'} 
                    onClick={() => setPaymentMethod('alipay')}
                    color="#1677ff" icon={<CreditCard size={18} />} label="支付宝"
                  />
                </div>

                {paymentMethod ? (
                  <div style={{ 
                    border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '40px 20px', 
                    textAlign: 'center', marginBottom: '24px', background: '#f8fafc' 
                  }}>
                    <QrCode size={64} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                    <p style={{ fontWeight: 600, color: '#475569', marginBottom: '8px' }}>模拟扫码区域</p>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>当前为演示模式，请点击下方按钮完成流程</p>
                  </div>
                ) : (
                  <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                    选择支付方式后显示二维码
                  </div>
                )}

                <button
                  disabled={!paymentMethod || processing}
                  onClick={handleSimulatedPayment}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    background: paymentMethod ? '#1e293b' : '#e2e8f0',
                    color: paymentMethod ? 'white' : '#94a3b8',
                    border: 'none', fontWeight: 600, fontSize: '1rem', 
                    cursor: paymentMethod && !processing ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  {processing ? '处理中...' : '✓ 模拟支付成功 (¥29)'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const FeatureItem = ({ included, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: included ? '#334155' : '#cbd5e1' }}>
    {included ? <Check size={18} color="#22c55e" /> : <X size={18} />}
    <span style={{ fontSize: '0.95rem' }}>{children}</span>
  </div>
);

const PaymentBtn = ({ active, onClick, color, icon, label }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1, padding: '12px', borderRadius: '12px',
      background: active ? `${color}15` : 'white',
      border: `2px solid ${active ? color : '#e2e8f0'}`,
      color: active ? color : '#64748b',
      fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
      cursor: 'pointer', transition: 'all 0.2s'
    }}
  >
    {icon} {label}
  </button>
);

export default PricingPage;
