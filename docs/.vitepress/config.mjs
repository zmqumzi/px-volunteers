import { defineConfig } from 'vitepress'

const base = process.env.SITE_BASE || '/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'PX',
  description: '通用培训、急救科普、残障人士服务与专项志愿服务准备资料。',
  base,
  cleanUrls: true,
  appearance: false,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg?v=px-a3` }],
    ['meta', { name: 'theme-color', content: '#262626' }]
  ],
  themeConfig: {
    siteTitle: false,
    nav: [
      { text: '通用培训', link: '/general/', activeMatch: '^/general/' },
      { text: '特化培训', link: '/specialized/', activeMatch: '^/specialized/' },
      { text: '资源下载', link: '/resources' },
      { text: '关于我们', link: '/about' }
    ],
    sidebar: {
      '/general/': [{
        text: '通用培训',
        items: [
          { text: '全部基础内容', link: '/general/' },
          { text: '志愿服务基础', link: '/general/basics' },
          { text: '沟通与服务礼仪', link: '/general/communication' },
          { text: '团队协作与交接', link: '/general/teamwork' },
          { text: '服务前的通用准备', link: '/general/prepare' }
        ]
      }],
      '/specialized/': [{
        text: '特化培训',
        items: [
          { text: '全部专题', link: '/specialized/' },
          { text: '急救科普', link: '/specialized/first-aid' },
          { text: '手语与听障沟通', link: '/specialized/sign-language' },
          { text: '盲人指引与视障服务', link: '/specialized/vision-support' },
          { text: '专项服务准备', link: '/specialized/service-preparation' }
        ]
      }]
    },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize(text) {
              // Use the same Chinese word segmentation for indexing and queries.
              const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
              return Array.from(segmenter.segment(text))
                .filter(word => word.isWordLike)
                .map(word => word.segment)
            }
          }
        },
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索资料', buttonAriaLabel: '搜索培训内容' },
              modal: {
                displayDetails: '显示内容摘要',
                resetButtonTitle: '清空搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有找到相关内容，可以换一个关键词。',
                footer: {
                  selectText: '打开', selectKeyAriaLabel: '回车',
                  navigateText: '切换', navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头', closeText: '关闭', closeKeyAriaLabel: 'Esc'
                }
              }
            }
          }
        }
      }
    },
    outline: { label: '本页内容', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    sidebarMenuLabel: '培训目录',
    returnToTopLabel: '返回顶部',
    navMenuLabel: '导航菜单',
    externalLinkIcon: false,
    footer: {
      copyright: 'PX for Volunteers'
    }
  }
})
