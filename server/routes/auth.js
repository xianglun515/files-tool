import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

// 生成 JWT Token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_default_secret_key_12345!@#';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

// ==================== 注册 ====================
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查必填字段
    if (!username || !email || !password) {
      return res.status(400).json({ message: '请填写所有必填项' });
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: '该用户名已被注册' });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: '该邮箱已被注册' });
    }

    // 创建新用户
    const user = await User.create({ username, email, password });

    // 异步发送欢迎邮件（不阻塞主流程）
    sendEmail({
      to: email,
      subject: '欢迎加入！让你的作品会说话',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #007AFF;">Hi ${username},</h2>
          <p>欢迎来到<strong>传媒生作品集助手</strong>！你的账号已经成功创建。</p>
          <p>在这里，你可以：</p>
          <ul>
            <li>将零散的项目素材集中管理</li>
            <li>使用 AI 智能润色项目描述</li>
            <li>一键提炼面试讲述话术</li>
          </ul>
          <p>快去<a href="https://xianglun515.github.io/files-tool" style="color: #007AFF;">添加你的第一个作品</a>吧！</p>
          <p style="margin-top: 30px; font-size: 0.9em; color: #888;">
            此致,<br/>
            传媒生作品集助手 团队
          </p>
        </div>
      `
    }).catch(e => console.error("欢迎邮件发送异常", e));

    // 返回 token 和用户信息
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    // Mongoose 验证错误
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error('注册错误:', error.name, error.message);
    console.error('错误堆栈:', error.stack);
    res.status(500).json({ message: '服务器内部错误: ' + error.message });
  }
});

// ==================== 登录 ====================
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 检查必填字段
    if (!email || !password) {
      return res.status(400).json({ message: '请输入邮箱和密码' });
    }

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '邮箱或密码不正确' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '邮箱或密码不正确' });
    }

    // 返回 token 和用户信息
    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// ==================== 获取当前用户 ====================
// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

export default router;
