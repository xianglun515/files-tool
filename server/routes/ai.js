import express from 'express';
import OpenAI from 'openai';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// 1. 初始化 OpenAI 客户端
// 兼容 OpenAI 格式，但通过 BASE_URL 支持国内模型（如 DeepSeek, Kimi, 通义千问等）
const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || 'https://api.deepseek.com/v1', 
});

router.use(authMiddleware);

router.post('/optimize', async (req, res) => {
  const { title, type, materials } = req.body;

  if (!title) {
    return res.status(400).json({ message: '缺少作品名称' });
  }

  try {
    // 2. 编写系统提示词 (Prompt Engineering)
    const systemPrompt = `你现在是一位资深的资深大厂 HR 兼传媒类作品集辅导专家。
你的任务是根据用户提供的简短【作品名称】和【作品类型】，发挥合理的专业想象，自动为其生成一份极其惊艳、符合 STAR 法则（情境、任务、行动、结果）的详细项目履历。
因为用户采用了“极简拖拽上传”，他们没有填写具体内容，你要基于作品名自动生成最符合常理的高光内容。

请严格返回一个标准的 JSON 格式对象，不要包含任何额外的 Markdown 标记（例如 \`\`\`json ），必须包含以下字段：
{
  "background": "项目背景与目标（约50字）",
  "role": "你在项目中担任的角色（如：主策划、导演、核心开发）",
  "idea": "核心创意与构思（约50字）",
  "process": "详细的执行过程（约100字）",
  "highlights": "项目的高光时刻与数据表现（约50字）",
  "tags": ["能力标签1", "能力标签2", "能力标签3", "能力标签4"],
  "jobs": ["匹配岗位1", "匹配岗位2"],
  "matchReasons": "为什么匹配这些岗位的分析（约50字）",
  "projectDescription": "一段适合写在简历上的STAR法则项目描述（约150字）",
  "interviewScript": "一段如果面试官问起这个项目，你应该怎么流利对答的话术（口语化，约150字）"
}`;

    const userPrompt = `作品名称：${title}\n作品类型：${type}\n上传的源文件：${materials || '未提供文件名称'}\n\n请为我自动生成并优化这个作品的信息，返回纯 JSON 格式。`;

    // 3. 调用 AI 大模型
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" } // 强制返回 JSON (某些模型可能不支持，这里先保守使用普通模式配合提示词)
    });

    let resultText = response.choices[0].message.content.trim();
    
    // 简单的清理逻辑，防止 AI 强行带上 ```json
    if (resultText.startsWith('```json')) {
      resultText = resultText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }

    const jsonResult = JSON.parse(resultText);

    res.json(jsonResult);
  } catch (err) {
    console.error('AI 优化失败:', err);
    res.status(500).json({ message: 'AI 优化生成失败，请检查 API 配置或稍后再试。' });
  }
});

export default router;
