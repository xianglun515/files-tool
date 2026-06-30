import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ message: '未登录，请先登录' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    
    const AI_API_KEY = Deno.env.get('AI_API_KEY');
    if (!AI_API_KEY) {
      return new Response(
        JSON.stringify({ message: '后台大模型 API Key 未配置' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      title, type, materials, role, tools, background,
      idea, process, highlights, dataFeedback, coverImage
    } = body;

    // 判断标题是否只是一个无意义的文件哈希（如 958b0712aef...）
    const isHashTitle = /^[a-f0-9]{16,}$/i.test((title || '').replace(/[-_]/g, ''));
    const displayTitle = isHashTitle ? '' : (title || '');

    const prompt = `
你是用户本人的"嘴替"——用户做了一个作品，但不太会表达，你要帮他用自然、流畅的语言把这个作品讲清楚。

【你的写作风格】
- 你不是在填表格，而是在"讲一件事"。像写一篇短文一样，有起承转合，读起来顺畅自然。
- 书面说明：用简洁的叙述体，像在作品集里写一段介绍文字。不要出现"情境：""任务：""行动：""结果："这类生硬标签。可以用<strong>加粗</strong>突出关键信息，用<br>换行分段，但整体是连贯的段落，不是填空题。
- 面试口述：像在跟一个同龄的面试官聊天，语气真诚放松。"我当时做了一个xxx""其实这个项目最难的地方是xxx"这种说话方式。
- 绝对忠于用户提供的素材和图片内容，不编造、不夸大。用户没提供的信息就跳过，不要提到"暂无"或"未提供"。
- 如果用户提供的文字素材很少但附带了图片，请仔细观察图片内容来理解这个作品是什么，并基于你看到的内容来写描述。
- 如果标题看起来像一串无意义的编号或哈希值，请忽略它，根据图片和其他素材自行概括作品主题。
- 宁可简短也不要注水。

【用户提供的素材】
作品标题：${displayTitle}
作品类型：${type || ''}
参考资料链接：${materials || ''}
担任角色：${role || ''}
使用工具：${tools || ''}
项目背景/目的：${background || ''}
核心创意/灵感：${idea || ''}
执行过程/挑战：${process || ''}
项目亮点/总结：${highlights || ''}
数据反馈/结果：${dataFeedback || ''}
${coverImage ? '（用户还附带了一张作品封面图，请仔细观察图片来理解作品内容）' : ''}

【返回格式】
返回合法 JSON 对象，不要包裹 Markdown 代码块：
{
  "projectDescription": "作品集书面描述。连贯的叙述段落，不要用'情境/任务/行动/结果'标签。用<br>换行，<strong>加粗关键词</strong>。基于素材和图片写，素材少就写短，200-300字。",
  "interviewScript": "面试口述稿。像跟面试官聊天一样自然地讲这个项目，约1分钟。用【】标注语气重音。",
  "tags": ["从素材和图片中提炼的能力标签，最多3个"],
  "jobs": ["匹配的岗位，最多2个"],
  "matchReasons": "为什么匹配，50字以内"
}`;

    const systemMsg = '你是一个严格的 JSON 生成助手。只输出合法的 JSON，不要包裹 ```json ... ```。如果用户提供了图片，请仔细观察图片内容来辅助理解作品。';

    // 根据是否有封面图选择不同的模型和请求格式
    let messages;
    let model;

    if (coverImage) {
      // 有图片：使用视觉模型，让 AI 能"看到"作品
      model = 'qwen-vl-plus';
      messages = [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: coverImage } },
            { type: 'text', text: `[系统指令]\n${systemMsg}\n\n${prompt}` }
          ]
        }
      ];
    } else {
      // 无图片：使用纯文本模型
      model = 'qwen-plus';
      messages = [
        { role: 'system', content: systemMsg },
        { role: 'user', content: prompt }
      ];
    }

    const apiRes = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, temperature: 0.7 }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('DashScope API Error:', errText);
      throw new Error(`AI 服务请求失败: ${apiRes.statusText}`);
    }

    const data = await apiRes.json();
    let content = data.choices?.[0]?.message?.content || '';

    // 移除可能存在的 Markdown 格式
    content = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

    const parsed = JSON.parse(content);

    return new Response(
      JSON.stringify(parsed),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(
      JSON.stringify({ message: error.message || '内部处理错误' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
