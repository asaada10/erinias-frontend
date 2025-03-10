<script lang="ts">
	import '../app.css';
	let { children } = $props();
import { connectWebSocket } from '$lib/stores/ws';
import { onMount } from 'svelte';
onMount(connectWebSocket);
</script>

{@render children()}
