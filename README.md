# show-cloudflare-page-Variable
## Page动态化的关键
1. Cloudflare Pages 通过将函数放置在 /functions 目录中支持将其部署为 Cloudflare Workers。如果放置在输出目录（如 public），将被视为静态资产。
2. 如果你的项目满足：

- 前端页面已构建到 public/ 目录（或默认输出目录）
- 函数代码位于 /functions 目录

Cloudflare Pages 会自动：

- 部署静态文件（如 public/index.html）
- 将 /functions 中的代码自动转换为 Worker 路由
3. 继续需要

- 使用 npm run build 生成静态文件到 public/
- 执行自定义脚本，比如路由脚本