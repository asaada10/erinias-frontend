<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	let {
		value = $bindable(),
		placeholder,
		type
	}: { value: string; placeholder: string; type: HTMLInputTypeAttribute } = $props();
</script>

<input
	{type}
	{placeholder}
	bind:value
	class="w-full inline-block rounded-lg bg-gray-800/60 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:ring-2 focus:ring-white/20 focus:outline-none"
/>
