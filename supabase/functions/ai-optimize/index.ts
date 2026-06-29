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

    // 可以在这里通过 supabase-js 验证 token，但为了性能直接请求大模型
    const body = await req.json();
    
    // 从 Supabase Secrets 中读取 API Key
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

    const prompt = `
你是一位专业的求职作品集辅导专家。请根据用户提供的零散碎片信息，帮他们提炼并重写出一段专业的作品描述和一段面试口述。

【用户输入的信息】
作品标题：${title || '未提供'}
作品类型：${type || '未提供'}
参考资料链接：${materials || '未提供'}
担任角色：${role || '未提供'}
使用工具：${tools || '未提供'}
项目背景/目的：${background || '未提供'}
核心创意/灵感：${idea || '未提供'}
执行过程/挑战：${process || '未提供'}
项目亮点/总结：${highlights || '未提供'}
数据反馈/结果：${dataFeedback || '未提供'}
封面图URL（如有可参考）：${coverImage || '无'}

【你需要返回的 JSON 格式】
请务必返回合法的 JSON 对象，不包含任何 Markdown 代码块包裹，字段如下：
{
  "projectDescription": "用于写在简历或作品集上的书面说明（建议使用 STAR 法则，分条列点，专业严谨，带 HTML 换行和小标题，不超过400字）",
  "interviewScript": "面试时口述这段经历的逐字稿（口语化，自信，有感染力，约 1 分钟语速，带 【重点语气词】 提示）",
  "tags": ["提炼出的3个核心能力标签", "最多3个"],
  "jobs": ["最适合投递的2个岗位", "最多2个"],
  "matchReasons": "为什么这个作品适合上述岗位（约50字）"
}`;

    // 调用阿里云通义千问 (DashScope) 接口
    const apiRes = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          {
            role: 'system',
            content: '你是一个严格的 JSON 生成助手。只输出合法的 JSON，不要包裹 ```json ... ```。',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
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
