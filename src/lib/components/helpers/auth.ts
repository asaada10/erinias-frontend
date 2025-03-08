// src/lib/components/utils/auth.ts
import { get } from 'svelte/store';
import { accessToken } from '$lib/stores/auth';

export async function fetchRefresh(url: string, options: RequestInit = {}): Promise<Response> {
	let token = get(accessToken);
	let res = await fetch(url, {
		...options,
		headers: {
			...(options.headers || {}),
			Authorization: `Bearer ${token}`
		}
	});

	if (res.status === 401) {
		const refreshRes = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });

		if (refreshRes.ok) {
			const { accessToken: newToken } = await refreshRes.json();
			accessToken.set(newToken);
			token = newToken;

			res = await fetch(url, {
				...options,
				headers: {
					...(options.headers || {}),
					Authorization: `Bearer ${token}`
				}
			});
		}
	}

	return res;
}

export async function logout() {
	await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
	accessToken.set(null);
}
