# show-cloudflare-page-Variable
本项目属于一个page部署，目的是中首页中展示设置在cloudflare page中的环境变量。
## 使用工作面管理版本分支的实践
### 实践一    
**准备工作面**
- 设定`deploy`分支为默认的分支
- 基于新的默认`deploy`分支创建新的`codespace`
- **严格在刚刚新创建的`codespace`中修改代码**
- 在其部署目标的page中设置：`分支控制`中的`生产分支`指针指向这个分支。 

**更换工作面**
- 在当前`codespace`中选择适当的提交后，创建新的命名为`pd`的分支。 
- 设定`pd`分支为默认的分支
- 将当前分支`deploy`按既有的版本规律重新命名，或者删除
- 重新命名`pd`为`deploy`
- 基于新的默认`deploy`分支创建新的`codespace`
- **严格在刚刚新创建的`codespace`中修改代码**
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
## 代码结构
```
your-repo/
├── functions/
│   └── api/
│       └── dynamic-content.js
├── public/
│   └── index.html
└── _routes.json
```
## worker路由设置文件:`_routes.json`
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*"]
}
```
- `"include": ["/*"]` 告诉Cloudflare Pages，默认情况下，所有路径都应首先尝试匹配静态文件。
- `"exclude": ["/api/*"]` 告诉Cloudflare Pages，特定路径（以 `/api/` 开头）应直接由API函数处理，不寻找静态文件。
## 路由
</api/dynamic-content>
## 参数化获取page的环境变量的探索
- 使用两极路由的传递环境变量名参数的方式，长时间的尝试都**没有找到合适的方法**。原因在于我们使用两级的路由时，比如\get_env\deepseek_api_key，cloudflare更倾向于将末端deepseek_api_key解释成一个函数入口deepseek_api_key.js，而不是一个代表环境变量名的参数。
- 当前的**成功探索**是，使用一级路由\get_env确定函数入口\functions\get_env.js，然后在静态文件中使用POST的方法传递环境变量名进函数，从而获得环境变量值。
- 多参数切换试验成功：只在index.html文件的第20行：
  ```
  body: JSON.stringify({ envParam: "name" })  // 硬编码环境变量名
  ```
  修改envParam的键值为想要的环境变量名即可。
  ### 封装成以变量名为参数，获得变量名对应的环境变量值返回的getEnvValue函数
