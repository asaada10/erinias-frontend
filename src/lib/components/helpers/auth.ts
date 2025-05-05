// src/lib/components/utils/auth.ts
import { access } from '$lib/states/auth.svelte';

// Esta función ha sido reemplazada por el composable API
// Usar useApi().refreshToken() en su lugar

export async function logout() {
	await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
	access.token = null;
}
