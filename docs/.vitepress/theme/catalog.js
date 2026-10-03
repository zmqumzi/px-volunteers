export const training = {
  general: {
    title: '通用培训',
    kicker: '基础知识与通用方法',
    description: '了解服务基础、沟通礼仪、团队协作与服务前的通用准备。',
    items: [
      { topic: '志愿服务基础', title: '理解自己的角色', description: '了解服务目标、职责范围和服务对象的需要。', link: '/general/basics', action: '阅读入门文章' },
      { topic: '沟通与礼仪', title: '清楚表达，认真倾听', description: '确认对方需求，提供清楚的信息，尊重个人选择。', link: '/general/communication', action: '阅读沟通参考' },
      { topic: '团队协作', title: '知道自己如何配合', description: '熟悉分工、交接方式和联络渠道，让现场协作更顺畅。', link: '/general/teamwork', action: '阅读协作参考' },
      { topic: '通用准备', title: '第一次参加服务前', description: '确认时间与地点，了解任务，准备所需物品。', link: '/general/prepare', action: '查看准备清单' }
    ]
  },
  specialized: {
    title: '特化培训',
    kicker: '急救科普 · 残障人士服务 · 专项服务准备',
    description: '按服务对象和具体场景，选择需要的专题。',
    items: [
      { topic: '急救科普', title: '现场协作与专业学习', description: '了解呼救时需要说明的信息、现场配合，以及 CPR、AED 和创伤救护的学习入口。', link: '/specialized/first-aid', action: '查看急救专题' },
      { topic: '残障人士服务 · 听障沟通', title: '手语与听障人士沟通', description: '认识国家通用手语，了解学习资源和服务中需要确认的沟通方式。', link: '/specialized/sign-language', action: '查看手语专题' },
      { topic: '残障人士服务 · 视障支持', title: '盲人指引与视障人士服务', description: '从询问需求开始，学习路线说明、环境提示与陪同行走中的沟通。', link: '/specialized/vision-support', action: '阅读指引参考' },
      { topic: '专项服务准备', title: '为具体服务做好准备', description: '结合助残服务、户外活动或校园引导，确认对象需求、场地条件和所需物品。', link: '/specialized/service-preparation', action: '查看专题准备清单' }
    ]
  }
}

export const resources = [
  {
    title: 'PX 培训部历史资料包', format: 'ZIP · 17 份资料 · 约 21 MB', category: '第 29 届活动与培训参考',
    description: '保留备用资料包的目录，重点收录 2025 年第 29 届活动策划、会议与培训材料，并附报账参考模板。公开版已遮盖识别到的个人联系方式，真实票据换成示意页。',
    link: '/downloads/px-reference-materials-public.zip', filename: 'PX培训部历史资料公开版.zip',
    note: '历史资料 · 公开脱敏版 · 具体活动安排与财务流程请以当前负责人确认为准'
  },
  {
    title: '活动报账参考模板', format: 'ZIP · 可填写模板与示意页', category: '活动后报账',
    description: '单独提供经费报账表、公务卡结算表、活动证明、劳务费和奖品签领等模板。真实发票与收款明细已换成仅供识别栏目的示意页。',
    link: '/downloads/activity-reimbursement-public.zip', filename: '活动报账参考模板公开版.zip',
    note: '历史资料 · 公开脱敏版 · 填写与提交要求请向本次活动财务负责人确认'
  }
]
