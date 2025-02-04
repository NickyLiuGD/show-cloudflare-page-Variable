// 通过环境变量获取动态内容
export async function onRequest(context) {
    try {
      // 从环境变量读取内容
      const dynamicContent = context.env.DEEKSEEK_API_KEY || "Default dynamic content";
      
      return new Response(dynamicContent, {
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
          // 可选：解决CORS问题
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      return new Response("Failed to load dynamic content", { status: 500 });
    }
  }
  
