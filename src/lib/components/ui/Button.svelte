<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		type,
		onclick,
		children
	}: { type: 'button' | 'submit' | 'reset'; onclick: () => void; children: Snippet<[]> } = $props();
</script>

<button
	{type}
	{onclick}
	class="w-full rounded-lg bg-[#db324d] px-4 py-3 font-medium text-white transition-colors hover:bg-[#c02843]"
>
	{@render children()}
</button>
