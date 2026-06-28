// 职位映射与能力标签生成规则
const jobMap = {
  '短视频作品': ['短视频策划', '新媒体运营', '内容运营'],
  '图文作品': ['新媒体运营', '内容运营', '文案策划'],
  '策划案': ['广告策划', '品牌策划', '活动策划'],
  '视觉设计作品': ['视觉策划', '广告创意'],
  '调研报告': ['内容运营', '用户研究助理', '策划助理'],
  '融媒体作品': ['融媒体产品助理', '交互设计助理'],
  '实习项目': ['新媒体运营', '内容运营', '活动执行']
};

const tagMap = {
  '短视频作品': ['内容策划', '视频策划', '剪辑执行', '新媒体传播', '镜头语言表达', '网感'],
  '图文作品': ['选题策划', '内容写作', '标题优化', '平台运营', '文字功底', '热点追踪'],
  '策划案': ['用户洞察', '活动策划', '品牌传播', '方案撰写', '策略思维', '逻辑分析'],
  '视觉设计作品': ['视觉表达', '版式设计', '创意转化', '传播物料设计', '审美能力'],
  '调研报告': ['用户研究', '竞品分析', '信息整理', '结论提炼', '数据分析'],
  '融媒体作品': ['跨媒介叙事', '交互设计', '产品思维', '多媒体整合'],
  '实习项目': ['项目统筹', '跨部门协作', '落地执行', '结果导向', '抗压能力']
};

const optimizeSuggestions = [
  "建议补充具体的数据反馈（如阅读量、点赞量、转化率），增强说服力。",
  "尽量突出你的‘个人贡献’，避免只写团队最终成品，面试官更看重你在这个过程中做了什么。",
  "使用 STAR 法则重写执行过程，增加遇到困难及如何解决的描述。",
  "减少空泛的形容词（如‘取得了很好的效果’），用客观事实和数据代替。",
  "在能力体现中，建议结合目标岗位的要求（如‘新媒体运营’看重的数据分析和网感）进行描述。"
];

export const simulateAIAnalysis = (workData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据作品类型生成对应标签和岗位
      const type = workData.type || '图文作品';
      const availableTags = tagMap[type] || tagMap['图文作品'];
      const availableJobs = jobMap[type] || jobMap['图文作品'];
      
      // 随机抽取 3-5 个标签
      const selectedTags = availableTags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
      
      resolve({
        tags: selectedTags,
        jobs: availableJobs,
        matchReasons: `基于你的作品类型为“${type}”，且执行过程中体现了“${selectedTags.slice(0, 2).join('、')}”的能力，这与${availableJobs[0]}等岗位的核心需求高度匹配。`
      });
    }, 1500); // 模拟网络延迟
  });
};

export const simulateAIGeneration = (workData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const type = workData.type || '图文作品';
      const role = workData.role || '主导者';
      
      const projectDescription = `
### 项目背景
该项目是在“${workData.background || '特定背景'}”下发起，主要面向“${workData.targetUser || '目标受众'}”。核心目的是解决他们的特定需求并传达特定的价值。

### 个人角色与执行过程
在本项目中，我担任“${role}”的角色。在执行过程中，我主要负责了“${workData.process || '核心任务的推进与落地'}”。面对挑战，我通过创新思维和严谨的执行力，确保了项目顺利推进。

### 成果亮点与能力体现
最终项目“${workData.highlights || '取得了预期成果'}”。这个过程充分证明了我具备“${(workData.tags || []).join('、')}”等专业能力，能够胜任相关的岗位工作。
      `;
      
      const interviewScript = `面试官您好，我来介绍一下我的这个“${workData.title}”作品。

【我做了什么＆为什么做】
当时因为“${workData.background || '某项需求'}”，我们决定开展这个项目。目的是为了给“${workData.targetUser || '用户'}”提供有价值的内容或解决方案。

【我负责什么＆结果如何】
在这个项目中我主要负责“${role}”。具体来说，我完成了“${workData.process || '策划与执行工作'}”。最终，我们的项目成果是“${workData.highlights || '达成了非常好的效果'}”，收到了不错的数据反馈。

【能力体现＆复盘思考】
通过这个作品，我觉得很好地锻炼了我的“${(workData.tags || []).slice(0, 2).join('和')}”能力。如果现在让我重新做一次，我会“补充更多的数据验证环节，并且在前期调研阶段做得更深入”，以达到更好的转化效果。`;

      resolve({
        projectDescription: projectDescription.trim(),
        interviewScript: interviewScript.trim(),
        suggestions: optimizeSuggestions.sort(() => 0.5 - Math.random()).slice(0, 2)
      });
    }, 2000);
  });
};
