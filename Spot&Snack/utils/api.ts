const BASE_URL = 'https://hackathonai-etei.onrender.com/api';

export async function apiPost(path: string, body: any) {
    try {
        const res = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'API request failed');

        return data;
    } catch (err) {
        console.error('API POST error:', err);
        throw err;
    }
}
