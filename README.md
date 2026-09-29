# PX

英文名称：PX for Volunteers。标识采用已确认的 A3 方案：五位伙伴、石墨灰字标和酸橙绿点缀。

面向深圳大学志愿者联合会及校内志愿者的免费学习网站。以 PC 浏览为主，包含通用培训、特化培训、资源下载和关于我们，不设考试、学习门槛或账号。

## 在电脑上预览

双击项目中的 **预览网站.cmd**，出现网址后，在浏览器中打开 `http://127.0.0.1:5173/`。预览期间保留打开的终端窗口。关闭窗口后，本地预览会结束。

如果电脑已有 Node.js，也可以在项目文件夹中运行：

```sh
npm install
npm run dev
```

## 修改内容从哪里开始

- 首页介绍：`docs/.vitepress/theme/components/HomePage.vue`。
- 通用培训文章：`docs/general/` 中的 `.md` 文件。
- 特化培训文章：`docs/specialized/` 中的 `.md` 文件。
- 培训目录标题与简介：`docs/.vitepress/theme/catalog.js` 中的 `training`。
- 资源名称、说明和下载链接：同一文件中的 `resources`。
- 下载附件：放在 `docs/public/downloads/`。
- 关于我们：`docs/.vitepress/theme/components/AboutPage.vue`。
- 顶部 Logo 原图：`docs/public/images/px-a3-logo.png`，显示范围由 `BrandLogo.vue` 设置；浏览器图标：`docs/public/favicon.svg`。
- 配色和排版：`docs/.vitepress/theme/style.css`。

`.md` 是纯文本文件。`# 标题` 表示文章标题，`## 小标题` 表示段落标题，空行分隔段落。可以复制现有文章，替换文字和资料链接。

新增文章后，同时在 `docs/.vitepress/config.mjs` 中的侧边目录及 `catalog.js` 中的专题列表添加链接。

## 目前的内容与反馈

这一版提供八篇基础与专题文章、三组流程图示、两份可编辑的 TXT 准备清单，以及五页的 A4 随身资料包。资料包包含通用准备、专项准备、听障沟通、视障指引和交接记录。急救内容提供呼救信息与专业学习入口，具体操作结合专业课程学习；手语动作从规范资料和专业示范查阅。文章中附有原始参考来源。

内容评价先完成问题设计，暂不接入外部问卷。文章末尾可预览评价选项、改进方向和建议填写区；内容不提交、不保存。问题草案位于 `内容维护/内容评价问题草案.md`。以后确认收集渠道后，可在 `config.mjs` 的 `themeConfig` 中添加 `feedbackUrl`，显示实际问卷入口。

资料包源文件为 `scripts/build_field_kit.py`，供后续维护；生成 PDF 的输出目录为工作区 `output/pdf/`，检查后复制到 `docs/public/downloads/volunteer-field-kit.pdf`。该脚本使用 Python、ReportLab 与 Windows 微软雅黑字体。

## 生成静态网页

```sh
npm run build
npm run preview
```

生成的网页位于 `docs/.vitepress/dist/`。以后选择托管平台时使用该目录中的输出；不要直接上传 `node_modules/`。

## GitHub Pages 上线

已准备 `.github/workflows/deploy.yml`。启用 GitHub Pages 并选择 **GitHub Actions** 作为发布来源后，向 `main` 分支上传更新，GitHub 会安装依赖、生成网页并发布。发布配置使用 Node.js 24 和 `npm ci`，从 Pages 设置读取 `SITE_BASE`，适配项目子路径、用户主页或后续自定义域名。

详细操作见 [上线操作说明](上线操作说明.md)。仓库根目录应直接包含 `package.json`、`docs/` 和 `.github/`，不要在外面再套一层项目文件夹。

本地模拟项目网址时，可以在 PowerShell 中执行：

```powershell
$env:SITE_BASE = '/px-volunteers/'
npm run build
npm run preview
```

然后访问 `http://127.0.0.1:4173/px-volunteers/`。恢复普通预览时，关闭该终端或执行 `Remove-Item Env:SITE_BASE`，再重新构建。首页、导航、附件和标识均使用兼容子路径的链接；中文搜索使用相同的分词方式建立索引和查询。

## 文件来源

页面内容由本站整理，外部知识资料在文章中注明来源。关于我们的标识来自用户提供的培训部历史资料。正式公开前，请核对内容和素材的使用范围。
