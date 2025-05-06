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
	class="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-[#db324d] focus:outline-none focus:ring-2 focus:ring-[#db324d]"
/>
