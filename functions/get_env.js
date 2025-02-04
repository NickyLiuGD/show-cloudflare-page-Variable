export async function onRequest(context) {
  console.log('Params:', context.params);

  try {
    // 正确捕获动态路由参数 "*"
    const { 0: envParam } = context.params; // 关键修改
    //                     ^ 参数名对应路由中的 *

    if (!envParam) {
      return new Response('环境变量名参绝对缺失', { status: 400 });
    }

    const envName = envParam.toUpperCase();

    return new Response(envName);

  } catch (error) {
    return new Response(`获取环境变量失败: ${error.message}`, { status: 500 });
  }
}
