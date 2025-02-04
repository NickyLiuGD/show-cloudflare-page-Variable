export async function onRequest(context) {
  try {
      // 获取请求方法
      const { request } = context;
      const method = request.method;

      if (method !== 'POST') {
          return new Response('仅支持 POST 请求', {
              status: 405,
              headers: {
                  'Content-Type': 'text/plain; charset=UTF-8',
              },
          });
      }

      // 解析请求体
      const requestBody = await request.text();
      const requestData = requestBody ? JSON.parse(requestBody) : {};

      // 获取环境变量名
      const envParam = requestData.envParam;

      if (!envParam) {
          return new Response('环境变量名参数缺失', {
              status: 400,
              headers: {
                  'Content-Type': 'text/plain; charset=UTF-8',
              },
          });
      }

      // 将小写的环境变量名转换为大写形式
      const envName = envParam.toUpperCase();

      // 从环境变量中获取值
      const envValue = context.env[envName];

      if (!envValue) {
          return new Response(`环境变量 ${envName} 未定义`, {
              status: 404,
              headers: {
                  'Content-Type': 'text/plain; charset=UTF-8',
              },
          });
      }

      // 返回环境变量的值
      return new Response(envValue, {
          headers: {
              'Content-Type': 'text/plain; charset=UTF-8',
          },
      });

  } catch (error) {
      return new Response(`获取环境变量失败: ${error.message}`, {
          status: 500,
          headers: {
              'Content-Type': 'text/plain; charset=UTF-8',
          },
      });
  }
}
