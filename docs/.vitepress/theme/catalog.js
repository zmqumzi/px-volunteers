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
    title: 'PX 志愿服务随身资料包', format: 'PDF · 5 页 · A4 可打印', category: '通用培训与专项服务',
    description: '包含通用准备、专项准备、听障沟通、视障指引与交接记录五页，可按需要单独打印。',
    link: '/downloads/volunteer-field-kit.pdf', filename: 'PX志愿服务随身资料包.pdf',
    note: '本站整理 · 2026-09-29 · 专题参考来源见资料页'
  },
  {
    title: '志愿服务前通用准备清单', format: 'TXT · 可编辑、可打印', category: '通用培训',
    description: '核对时间地点、任务、物品与交接安排。',
    link: '/downloads/general-checklist.txt', filename: '志愿服务前通用准备清单.txt',
    note: '本站整理 · 2026-09-29'
  },
  {
    title: '专项志愿服务准备清单', format: 'TXT · 可编辑、可打印', category: '专项服务准备',
    description: '围绕服务对象、沟通方式、场地与项目需要，逐项记录待确认事项。',
    link: '/downloads/specialized-checklist.txt', filename: '专项志愿服务准备清单.txt',
    note: '本站整理 · 2026-09-29'
  },
  {
    title: '急救科普学习资源', format: '外部资料', category: '急救科普',
    description: '了解公众急救培训的主题，并从机构最新公告查阅课程安排。',
    link: 'https://wjw.sz.gov.cn/szsjjzx/',
    note: '来源：深圳市急救中心'
  },
  {
    title: '国家通用手语资料', format: '外部资料', category: '手语与听障沟通',
    description: '从教育部资料目录查阅国家通用手语相关规范资料。',
    link: 'https://www.moe.gov.cn/jyb_sjzl/ziliao/A19/',
    note: '来源：教育部'
  },
  {
    title: '盲人指引参考资料', format: '外部资料 · 英文', category: '视障人士服务',
    description: '阅读视障服务机构的引导资料与示范。',
    link: 'https://www.rnib.org.uk/living-with-sight-loss/supporting-others/guiding-a-blind-or-partially-sighted-person/',
    note: '来源：RNIB'
  }
]
