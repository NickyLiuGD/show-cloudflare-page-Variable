// /functions/get_env.js

export async function onRequest(context) {
  console.log('Params:', context.params);
  try {
    // 获取路由参数
    const params = context.params || {};  // 确保 params 不为 null
    const envParam = params.envParam;

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
