export async function onRequest(context) {
  console.log('Params:', context.params); // 确保参数解析正确
  const envParam = context.params?.envParam;

  if (!envParam) {
    return new Response('环境变量名参数缺失', { status: 400 });
  }

  const envName = envParam.toUpperCase();
  const envValue = context.env[envName];

  if (!envValue) {
    return new Response(`环境变量 ${envName} 未定义`, { status: 404 });
  }

  return new Response(envValue);
}
