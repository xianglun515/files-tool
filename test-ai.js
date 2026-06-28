import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY || 'sk-c081e74a813840af9e4e666a7b7381ff', // Using a dummy key just for testing if Deepseek SDK throws on format
  baseURL: process.env.AI_BASE_URL || 'https://api.deepseek.com/v1',
});

const systemPrompt = `你是一位严谨的求职文案编辑。你的任务是基于用户提供的【已有素材】进行润色和结构化整理。

核心原则：
1. 绝对忠于原文：只润色用户已提供的信息，禁止凭空编造任何项目细节、数据、成果或经历。
2. 如果某个字段用户没有提供具体内容（如写了"未提供"或为空），在该字段中如实写"暂无"，不要自行发挥。
3. 润色应限于：让表述更专业精练、补充合理的连接词、调整为更适合求职场景的书面语气。
4. tags 和 jobs 字段需要根据用户已提供的所有内容合理提炼，但不能超出原文所涉范围。

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

作品名称：ChatGPT Image 2026年6月28日 18_17_57
作品类型：图文作品
上传的源文件：未提供
个人角色：未提供
使用工具：未提供
项目背景：未提供
核心创意：未提供
执行过程：未提供
成果亮点：未提供
数据反馈：未提供

请严格基于以上已有素材进行润色，返回纯 JSON 格式。禁止编造原文中没有的信息。`;

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' }
    });
    console.log('AI OUTPUT:');
    console.log(response.choices[0].message.content);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}
main();
