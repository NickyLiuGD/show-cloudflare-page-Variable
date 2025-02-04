addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const name = NAME; // 使用环境变量
    return new Response(name, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
