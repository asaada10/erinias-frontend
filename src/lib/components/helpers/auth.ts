// src/lib/components/utils/auth.ts
import { get } from 'svelte/store';
import { access } from '$lib/stores/auth.svelte';

export async function fetchRefresh(url: string, options: RequestInit = {}): Promise<Response> {
	let {token} = access;
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
			access.token = newToken;
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
	access.token = null;
}
