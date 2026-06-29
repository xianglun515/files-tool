import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import aiRoutes from './routes/ai.js';

// 加载环境变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API 路由
// Auth 和 Works 数据读写已全面迁移至前端直连 Supabase
// 后端仅保留 AI 处理网关，保护大模型 API Key 不被泄露
app.use('/api/ai', aiRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常 (已切换至 Supabase 架构) 🚀' });
});

// 启动服务 (无需连接 MongoDB)
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
    console.log(`📡 API 地址: http://localhost:${PORT}/api`);
  });
};

startServer();
