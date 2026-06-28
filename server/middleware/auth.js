import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // 从请求头中获取 token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未登录，请先登录' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'fallback_default_secret_key_12345!@#';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: '登录已过期，请重新登录' });
  }
};

export default authMiddleware;
