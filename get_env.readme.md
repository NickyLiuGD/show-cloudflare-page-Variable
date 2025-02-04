

以下是当前完整的代码结构说明：

---

### **目录结构**
```bash
.
├── public/
│   └── index.html         # 静态页面入口
├── functions/
│   └── get_env.js         # 处理环境变量查询的Cloudflare Function
└── _routes.json           # 路由配置文件
```

---

### **1. 静态页面 (`public/index.html`)**
```html
<!DOCTYPE html>
<html>
<head>
    <title>显示环境变量</title>
</head>
<body>
    <h1>环境变量 DEEPSEEK_API_KEY 的值：</h1>
    <div id="env-value" style="font-weight: bold; color: blue;"></div>

    <script>
        // 页面加载后自动发起 POST 请求
        window.onload = function() {
            fetch('/get_env', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ envParam: "deepseek_api_key" }) // 硬编码环境变量名
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP 错误 ${response.status}`);
                return response.text();
            })
            .then(value => {
                document.getElementById('env-value').textContent = value;
            })
            .catch(error => {
                document.getElementById('env-value').textContent = `错误: ${error.message}`;
                document.getElementById('env-value').style.color = 'red';
            });
        };
    </script>
</body>
</html>
```

---

### **2. Cloudflare Function (`functions/get_env.js`)**
```javascript
export async function onRequest(context) {
    try {
        // 仅允许 POST 请求
        if (context.request.method !== 'POST') {
            return new Response('仅支持 POST 请求', { status: 405 });
        }

        // 解析请求体
        const requestBody = await context.request.json();
        const envParam = requestBody.envParam;

        if (!envParam) {
            return new Response('环境变量名参数缺失', { status: 400 });
        }

        // 转换环境变量名为大写
        const envName = envParam.toUpperCase();
        const envValue = context.env[envName];

        if (!envValue) {
            return new Response(`环境变量 ${envName} 未定义`, { status: 404 });
        }

        // 返回环境变量值
        return new Response(envValue, {
            headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
        });

    } catch (error) {
        return new Response(`服务器错误: ${error.message}`, { status: 500 });
    }
}
```

---

### **3. 路由配置 (`_routes.json`)**
```json
{
    "version": 1,
    "include": ["/index.html", "/assets/*"],  // 静态文件路径
    "exclude": ["/get_env"],                  // 排除动态路由
    "routes": [
        {
            "path": "/get_env",               // 路由路径
            "method": "POST",                 // 仅处理 POST 请求
            "function": "get_env"             // 指向 get_env.js 函数
        }
    ]
}
```

---

### **关键流程**
1. **用户访问页面**  
   - 浏览器加载 `public/index.html`。
   - 页面加载完成后，自动发送 POST 请求到 `/get_env`。

2. **后端处理请求**  
   - Cloudflare 根据 `_routes.json` 将 POST 请求路由到 `get_env.js`。
   - `get_env.js` 解析请求体中的 `envParam`，返回环境变量值。

3. **前端展示结果**  
   - 页面接收到响应后，直接将环境变量值显示在 `<div id="env-value">` 中。

---

### **注意事项**
1. **环境变量配置**  
   - 需要在 Cloudflare Pages 控制台中设置 `DEEPSEEK_API_KEY`（全大写）。

2. **安全性**  
   - 公开暴露环境变量值存在风险，确保仅在可信环境使用此方案。

3. **部署验证**  
   - 部署后访问页面，检查控制台网络请求是否成功（状态码 200）。  
   - 若失败，可通过 `wrangler tail` 查看实时日志。
  


---

## **`get_env` POST 接口文档**

#### **1. 功能说明**
通过 POST 请求查询指定环境变量的值。环境变量需提前在 Cloudflare Pages 项目中配置。

---

#### **2. 接口地址**
```bash
POST /get_env
```

---

#### **3. 请求格式**
- **Headers**  
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
  
- **Body**  
  ```json
  {
    "envParam": "环境变量名（小写或混合大小写）"
  }
  ```
  **示例**：  
  ```json
  {
    "envParam": "deepseek_api_key"
  }
  ```

---

#### **4. 响应格式**
##### **成功响应**
- **状态码**：`200 OK`
- **Body**：环境变量值的纯文本  
  ```text
  sk-123456789abcdef
  ```

##### **错误响应**
| 状态码         | 错误原因                        | Body 示例                                    |
|----------------|-------------------------------|---------------------------------------------|
| `400 Bad Request` | 未提供 `envParam` 参数          | `环境变量名参数缺失`                          |
| `404 Not Found`   | 环境变量未定义                  | `环境变量 DEEPSEEK_API_KEY 未定义`            |
| `405 Method Not Allowed` | 非 POST 方法调用       | `仅支持 POST 请求`                            |
| `500 Internal Server Error` | 服务器内部错误      | `服务器错误: JSON 解析失败`                   |

---

#### **5. 调用示例**
##### **使用 cURL**
```bash
curl -X POST https://your-site.pages.dev/get_env \
-H "Content-Type: application/json" \
-d '{"envParam": "deepseek_api_key"}'
```

##### **使用 JavaScript（前端）**
```javascript
fetch('/get_env', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ envParam: 'deepseek_api_key' })
})
.then(response => response.text())
.then(value => console.log('环境变量值:', value))
.catch(error => console.error('错误:', error));
```

---

#### **6. 环境变量配置**
1. 登录 Cloudflare Pages 控制台。  
2. 进入项目设置 → **Environment Variables**。  
3. 添加环境变量，名称需全大写（如 `DEEPSEEK_API_KEY`）。  

---

#### **7. 注意事项**
- **大小写敏感**：  
  请求中的 `envParam` 会自动转为大写（如 `deepseek_api_key` → `DEEPSEEK_API_KEY`）。
- **安全性**：  
  避免在前端暴露敏感环境变量，必要时添加访问控制（如 IP 白名单）。
- **跨域问题（CORS）**：  
  若需跨域调用，在响应头中添加：  
  ```http
  Access-Control-Allow-Origin: *
  ```

---

#### **8. 路由配置参考**
确保 `_routes.json` 包含以下规则：  
```json
{
  "routes": [
    {
      "path": "/get_env",
      "method": "POST",
      "function": "get_env"
    }
  ]
}
```

---

**文档版本**：1.0  
**最后更新**：2023-10-15
