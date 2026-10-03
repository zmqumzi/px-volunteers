# PX

英文名称：PX for Volunteers。标识采用已确认的 A3 方案：五位伙伴、石墨灰字标和酸橙绿点缀。

公开网站：[https://zmqumzi.github.io/px-volunteers/](https://zmqumzi.github.io/px-volunteers/)。本文件夹是网站源码仓库，`docs/` 中的文章和资源经过构建后发布到 GitHub Pages。

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
- 活动报账指南：`docs/resources/reimbursement.md`，入口位于资源下载页。
- 培训目录标题与简介：`docs/.vitepress/theme/catalog.js` 中的 `training`。
- 资源名称、说明和下载链接：生成的 `docs/.vitepress/theme/resources.js`，修改源列表后重新生成。
- 资料分类与原文件对应关系：`scripts/prepare_resources.py`；运行后生成 `docs/.vitepress/theme/resources.js`。
- 下载附件：放在 `docs/public/downloads/` 的分类目录中，由原文件复制生成。
- 关于我们：`docs/.vitepress/theme/components/AboutPage.vue`。
- 顶部 Logo 原图：`docs/public/images/px-a3-logo.png`，显示范围由 `BrandLogo.vue` 设置；浏览器图标：`docs/public/favicon.svg`。
- 配色和排版：`docs/.vitepress/theme/style.css`。

`.md` 是纯文本文件。`# 标题` 表示文章标题，`## 小标题` 表示段落标题，空行分隔段落。可以复制现有文章，替换文字和资料链接。

新增培训文章后，同时在 `docs/.vitepress/config.mjs` 的侧边目录及 `catalog.js` 的专题列表添加链接；资源类文章的入口在 `ResourceList.vue` 中维护。

## 目前的内容与反馈

当前版本提供八篇基础与专题文章、一篇精简的活动报账指南、三组流程图示，以及 25 份独立下载文件。资料按志愿培训、大会筹备、现场执行、部门日常、活动报账五类排列，优先展示 2025 年资料。不再提供整个文件夹的打包下载。

下载文件来自网站仓库同级的 `备用的资料包/`，使用原版，保留原文、姓名和文件排版。活动报账压缩包拆为单独的表格、说明和票据样例；志联标识仅作为站点素材，不列为工作资料。每份下载文件已与原件核对一致。历史模板的本次使用要求向负责人确认。

附件存放在 `docs/public/downloads/` 下的五个分类文件夹中。在项目目录执行 `python scripts/prepare_resources.py` 可从本地原件重新生成附件及目录；执行 `python scripts/prepare_resources.py --check` 可核对文件完整性。新增资料时修改该脚本中的文件列表与分类。

急救内容提供呼救信息与专业学习入口，具体操作结合专业课程学习；手语动作从规范资料和专业示范查阅。文章中附有原始参考来源。

文章末尾只保留“有用”的拇指图标和“没帮助”的表情图标，并显示数量。当前版本在当前浏览器保存每篇文章的一次选择；可切换或取消，刷新后保留。数字仅表示当前浏览器的记录，不代表全站评价数量。全站共享计数需在确认数据服务后接入。规则见 `内容维护/内容评价问题草案.md`。

活动报账指南位于 `docs/resources/reimbursement.md`，精简为准备材料、填写表格、按需补齐附件三步，并链接到单独的原版表格。

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

页面内容由本站整理，外部知识资料在文章中注明来源。网站资料下载来自用户提供的培训部历史文件，关于我们的标识也来自其中。历史活动信息与当前实践可能不同，下载页已标明资料用途和核对要求。
