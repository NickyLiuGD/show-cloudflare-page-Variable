export async function onRequest(context) {
  try {
      const url = new URL(context.request.url);
      const path = url.pathname;

      let dynamicContent;

      switch (path) {
          case '/api/dynamic-content':
              dynamicContent = context.env.DEEPSEEK_API_KEY || "Default DEEPSEEK_API_KEY";
              break;
          case '/api/name-content':
              dynamicContent = context.env.NAME || "Default NAME";
              break;
          default:
              return new Response('Not Found', { status: 404 });
      }

      return new Response(dynamicContent, {
          headers: {
              "Content-Type": "text/plain; charset=UTF-8",
              "Access-Control-Allow-Origin": "*"
          }
      });
  } catch (err) {
      return new Response("Failed to load dynamic content", { status: 500 });
  }
}
