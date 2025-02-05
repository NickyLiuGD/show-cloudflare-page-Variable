// functions/env.js
export async function getEnvValue(envName) {
    try {
        const response = await fetch('/get_env', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ envParam: envName })
        });

        if (!response.ok) {
            throw new Error(`HTTP错误 ${response.status}`);
        }
        
        return await response.text();
    } catch (error) {
        throw new Error(`请求失败: ${error.message}`);
    }
}
