<script lang="ts">
	import { Plus, MoreVertical } from 'lucide-svelte';
	let { title } = $props();
	// toggleOptions = "TODO";
</script>

<div class="flex items-center justify-between p-3">
	<div class="flex items-center">
		<span class="font-medium text-gray-800 dark:text-gray-200">{title}</span>
		<svg
			class="ml-1 h-4 w-4 text-gray-500 dark:text-gray-400"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M19 9L12 16L5 9"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>
	<div class="flex items-center space-x-2">
		<button
			class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
		>
			<Plus class="h-5 w-5" />
		</button>
		<button
			class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
		>
			<MoreVertical class="h-5 w-5" />
		</button>
	</div>
</div>
