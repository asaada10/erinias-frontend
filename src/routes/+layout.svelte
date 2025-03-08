<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { accessToken } from '$lib/stores/auth';
	import { connectWebSocket } from '$lib/stores/ws';

	let token: string | null = null;
	async function refreshToken() {
		const response = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
		const data = await response.json();
		return data.accessToken;
	}
	$effect(() => {
		if (!$accessToken) {
			refreshToken().then((token) => {
				$accessToken = token;
			});
		}

		console.log($accessToken);
		token = $accessToken;
		if (token) {
			connectWebSocket(token);
		}
	});
</script>

{@render children()}
