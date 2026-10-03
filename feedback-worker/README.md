# PX 共享评价接口

本目录是独立的 Cloudflare Worker，不参与 GitHub Pages 的静态网页构建。网站前端已接入，组件为 `docs/.vitepress/theme/components/ContentFeedback.vue`。

数据库：`px-feedback`。D1 仅保存文章路径、随机浏览器 UUID 和评价选择；不保存姓名、学号、IP。Cloudflare 本身的网络服务仍处理请求 IP。每个浏览器对每篇文章最多一个有效评价，清除浏览器存储或换浏览器仍可再次评价。

## 开发与部署

需要 Node.js 24。在本目录执行：

```sh
npm ci
npm test
npm run schema:local
npm run dev
```

在另一终端执行 `node scripts/smoke.js`，检查真实本地 Worker/D1 运行环境。该脚本只提交随机标识的测试评价，结束时取消自身评价，恢复原有数量。

部署前使用 Cloudflare 官方 Wrangler 登录，授权范围为读取账户、用户信息，管理 Workers 和 D1：

```sh
npx wrangler login --scopes account:read user:read workers:write workers_scripts:write d1:write
npm run schema:remote
npm run deploy
node scripts/smoke.js https://实际发布的地址.workers.dev
```

登录凭据由 Wrangler 保存在用户配置目录，不写进仓库或前端。`wrangler.jsonc` 中账户和数据库 ID 是资源标识，不是密钥。授权可在 Cloudflare 撤销，也可以使用 `npx wrangler logout` 退出。

Wrangler 会同时申请 `offline_access`，用于后续刷新登录凭据。Workers 管理权限是账户范围，不只限于本接口；当前申请未包含额外的域名、R2、邮件等独立授权范围。

## 接口约定

- `GET /health`：检查部署和数据库表是否就绪。
- `GET /v1/feedback?article=general/basics.md`：获取两项共享数量。
- 可选请求头 `X-PX-Visitor`：UUID v4，返回该浏览器自己的选择。
- `POST /v1/feedback`：请求头 `Content-Type: application/json`、`X-PX-Visitor`；JSON `{ "article": "general/basics.md", "vote": "useful" }`。
- `vote` 为 `useful` / `unhelpful` / `null`；`null` 取消，重复提交同一值不增加数量。
- 成功响应为 `{ "article": "...", "counts": { "useful": 0, "unhelpful": 0 }, "vote": null }`。

数据库主键、计数触发器与 D1 批处理事务保证数量同步；查询直接读取计数表，不扫描全部评价。接口只接受允许的文章 ID；新增文章时更新 `src/index.js` 中的 `ARTICLES` 并重新部署，测试会检查文章名单是否匹配。

CORS 允许 `https://zmqumzi.github.io` 和当前本地开发、预览地址。CORS 不能代替登录或抵挡伪造请求；匿名评价不作为身份认证或考核依据。写入限制为每个网络地址每分钟约 30 次，Cloudflare 边缘限流不是全球精确配额。网络地址只用于短期限流，不写入 D1。未来更换域名时需更新 `ORIGINS`。

返回 400 表示参数错误，403 来源不允许，413 数据过长，415 类型不正确，429 操作频繁，503 服务暂不可用。前端应在失败时提示重试，不把本地数字伪装成全站计数。

## 发布记录与访问检查

2026-10-04 已发布 Worker，地址：`https://px-feedback-api.px-feedback-api.workers.dev`。健康检查路径 `/health`。

版本 ID：`3d17772d-1c2d-475d-a754-6d35337b9c21`。云端 D1 已执行 `schema.sql`，两张表和三个计数触发器均已检查，DB 和 VOTE_LIMITER 绑定部署成功。

本地逻辑测试 5 组通过；本地实际 Worker/D1 验证通过；云端健康检查、两名匿名访客共享数量、重复提交、切换、取消、CORS 验证通过。测试结束已取消测试访客的评价，云端有效评价数量恢复为 0。

**访问限制：** 当前网络的普通 DNS 将该域名解析为与 Cloudflare DNS over HTTPS 返回结果不同的地址，普通连接超时或 TLS 握手失败。云端测试通过 `PX_API_CONNECT_IP` 指定当时由 Cloudflare DNS 查询得到的正确地址，仅用于测试，保留域名、SNI 与 HTTPS 证书校验，不修改系统 DNS。地址可能变化，不应将测试 IP 写入网站。普通浏览器及校内网络能否稳定访问尚未确认；需要在前端正式启用前确认可访问性，必要时采用可正常访问的自定义域名。

诊断用法（Windows，先查询当前正确地址）：

```powershell
$env:PX_API_CONNECT_IP = '当时查询得到的地址'
node scripts/smoke.js https://px-feedback-api.px-feedback-api.workers.dev
Remove-Item Env:PX_API_CONNECT_IP
```

网站前端已接入，保留两个图标；旧版浏览器评价不自动迁入共享计数。前端使用随机 UUID、本地存储、10 秒请求超时和服务端确认后更新机制。请求失败保留先前确认的状态并显示提示，首次无法获取数量时显示“—”。构建通过，已用前端实际脚本与本地 Worker/D1 联调共享计数、重复点击、刷新恢复、切换、取消和网络失败行为。
