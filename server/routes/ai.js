import express from 'express';
import OpenAI from 'openai';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// 1. 初始化 OpenAI 客户端
// 兼容 OpenAI 格式，但通过 BASE_URL 支持国内模型（如 DeepSeek, Kimi, 通义千问等）
// 如果环境变量未设置，使用 'missing_key' 占位，防止服务器在启动时直接崩溃
const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY || 'missing_key',
  baseURL: process.env.AI_BASE_URL || 'https://api.deepseek.com/v1', 
});

router.use(authMiddleware);

router.post('/optimize', async (req, res) => {
  const { title, type, materials, role, tools, background, idea, process, highlights, dataFeedback, coverImage } = req.body;

  if (!title) {
    return res.status(400).json({ message: '缺少作品名称' });
  }

  try {
    if (openai.apiKey === 'missing_key') {
      return res.status(500).json({ message: '未配置大模型 API Key。请在 Render 后台的 Environment 变量中配置 AI_API_KEY。' });
    }

    // 2. 编写系统提示词 (Prompt Engineering)
    const systemPrompt = `你是一位严谨的求职文案编辑。你的任务是基于用户提供的【已有素材】进行润色和结构化整理。

核心原则：
1. 绝对忠于原文：只润色用户已提供的信息，禁止凭空编造任何项目细节、数据、成果或经历。
2. 如果某个字段用户没有提供具体内容（如写了"未提供"或为空），在该字段中如实写"暂无"，不要自行发挥。
3. 如果所有素材都是"未提供"，你必须依然返回指定的 JSON 结构（内容全部填"暂无"或"缺乏素材"），绝不能返回普通文本。
4. 润色应限于：让表述更专业精练、补充合理的连接词、调整为更适合求职场景的书面语气。
5. tags 和 jobs 字段需要根据用户已提供的所有内容合理提炼，但不能超出原文所涉范围。

请严格返回一个标准的 JSON 格式对象，不要包含任何额外的 Markdown 标记（例如 \`\`\`json ），必须包含以下字段：
{
  "background": "基于用户原文润色的项目背景（若原文为空则填'暂无'）",
  "role": "用户填写的角色（若原文为空则填'暂无'）",
  "idea": "基于原文润色的核心创意（若原文为空则填'暂无'）",
  "process": "基于原文润色的执行过程（若原文为空则填'暂无'）",
  "highlights": "基于原文润色的成果亮点（若原文为空则填'暂无'）",
  "tags": ["从原文中提炼的能力标签，最多4个"],
  "jobs": ["从原文推断的匹配岗位，最多2个"],
  "matchReasons": "基于原文内容分析为什么匹配这些岗位",
  "projectDescription": "将用户已有的背景、过程、亮点等信息整合为一段STAR法则项目描述，不编造任何新内容",
  "interviewScript": "将项目描述改写为口语化的面试讲述版本，保持内容与项目描述一致"
}`;

    const userPrompt = `以下是用户提供的作品原始素材，请基于这些内容进行润色整理：

作品名称：${title}
作品类型：${type}
上传的源文件：${materials || '未提供'}
个人角色：${role || '未提供'}
使用工具：${tools || '未提供'}
项目背景：${background || '未提供'}
核心创意：${idea || '未提供'}
执行过程：${process || '未提供'}
成果亮点：${highlights || '未提供'}
数据反馈：${dataFeedback || '未提供'}

请严格基于以上已有素材进行润色，返回纯 JSON 格式。禁止编造原文中没有的信息。`;

    // 根据是否有图片，构建不同的请求内容格式
    let userMessageContent;
    if (coverImage) {
      userMessageContent = [
        { type: "text", text: userPrompt },
        { type: "image_url", image_url: { url: coverImage } }
      ];
    } else {
      userMessageContent = userPrompt;
    }

    // 3. 调用 AI 大模型
    const apiOptions = {
      model: process.env.AI_MODEL || 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessageContent }
      ],
      temperature: 0.4
    };

    // 仅在纯文本模式下强行指定 JSON (部分视觉模型不支持该参数)
    if (!coverImage) {
      apiOptions.response_format = { type: "json_object" };
    }

    const response = await openai.chat.completions.create(apiOptions);

    let resultText = response.choices[0].message.content.trim();
    
    // 简单的清理逻辑，防止 AI 强行带上 ```json
    if (resultText.startsWith('```json')) {
      resultText = resultText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }

    let jsonResult;
    try {
      jsonResult = JSON.parse(resultText);
    } catch (parseErr) {
      console.warn('AI 返回的格式非标准 JSON，已启用降级处理:', resultText);
      // 如果 AI 返回非 JSON（通常是因为用户提供的信息为空，AI 拒绝执行而返回纯文本道歉）
      jsonResult = {
        background: '暂无',
        role: '暂无',
        idea: '暂无',
        process: '暂无',
        highlights: '暂无',
        tags: [],
        jobs: [],
        matchReasons: '由于提供的素材过少，暂时无法分析匹配岗位。',
        projectDescription: resultText.includes('未提供') ? 
          'AI 检测到您的作品缺乏具体文字素材，暂无法进行有效润色。建议您先在作品中补充一些“项目背景”或“执行过程”，再让 AI 帮您提炼。' : 
          'AI 提炼失败，请尝试补充更多项目细节。',
        interviewScript: '同上，建议补充素材后再试。'
      };
    }

    res.json(jsonResult);
  } catch (err) {
    console.error('AI 优化失败:', err);
    res.status(500).json({ message: 'AI 优化生成失败，请检查 API 配置或稍后再试。' });
  }
});

export default router;
