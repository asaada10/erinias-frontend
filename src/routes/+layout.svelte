<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { onMount } from 'svelte';
	import { useApi } from '$lib/composables/api';
	import { profile } from '$lib/states/chat.svelte';
	const api = useApi();
	let { children } = $props();
	onMount(async() => {
			profile.user = (await api.getProfile()).data;
	});
</script>

<ModeWatcher defaultMode={'dark'} />
<Toaster />
{@render children()}
