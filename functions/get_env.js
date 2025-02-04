export async function onRequest(context) {
  try {
    // 正确捕获动态路由参数 "*"
    const { 0: envParam } = context.params; // 关键修改
    //                     ^ 参数名对应路由中的 *

    if (!envParam) {
      return new Response('环境变量名参数缺失', { status: 400 });
    }

    const envName = envParam.toUpperCase();
    const envValue = context.env[envName];

    if (!envValue) {
      return new Response(`环境变量 ${envName} 未定义`, { status: 404 });
    }

    return new Response(envValue);

  } catch (error) {
    return new Response(`获取环境变量失败: ${error.message}`, { status: 500 });
  }
}
