<script lang="ts">
	import { Search } from 'lucide-svelte';
	import { handleSearch } from '../helpers/search.svelte';

	let { placeholder } = $props();
</script>

<div class="border-b border-gray-200 p-3 dark:border-gray-700">
	<div class="relative">
		<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
		<input
			type="text"
			{placeholder}
			class="w-full rounded-lg bg-gray-100 py-2 pr-4 pl-10 text-sm text-gray-800 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
			onkeyup={(e) => handleSearch(e.currentTarget.value)}
		/>
	</div>

	<!-- Search status
	{#if getIsSearching()}
		<div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Buscando...</div>
	{/if}

	{#if getSearchError()}
		<div class="mt-2 text-xs text-red-500">{getSearchError()}</div>
	{/if} -->
</div>
