export async function onRequest(context) {
  try {
      const { pathname } = new URL(context.request.url);
      console.log("Request path:", pathname); // 调试日志

      let dynamicContent;
      switch (pathname) {
          case '/api/dynamic-content':
              dynamicContent = context.env.NAME || "Default DEEPSEEK_API_KEY";
              console.log("DEEPSEEK_API_KEY:", context.env.DEEPSEEK_API_KEY); // 调试日志
              break;
          case '/api/name-content':
              dynamicContent = context.env.DEEPSEEK_API_KEY || "Default NAME";
              console.log("NAME:", context.env.NAME); // 调试日志
              break;
          default:
              return new Response('Not Found', { status: 404 });
      }

      return new Response(dynamicContent, {
          headers: { "Content-Type": "text/plain; charset=UTF-8" }
      });
  } catch (err) {
      return new Response("Internal Server Error", { status: 500 });
  }
}
