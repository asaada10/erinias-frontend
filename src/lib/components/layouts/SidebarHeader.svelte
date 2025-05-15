<script lang="ts">
	import { Plus, MoreVertical } from 'lucide-svelte';
	let { title } = $props();
</script>

<div class="flex items-center justify-between p-3">
	<div class="flex items-center">
		<span class="font-medium text-gray-800 dark:text-gray-200">{title}</span>

	</div>
</div>
