<script lang="ts">
	let { selectedRoom } = $props();
	import { MoreVertical } from 'lucide-svelte';
</script>

<div class="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-700">
	<div class="flex items-center">
		<!-- Mobile back button to show sidebar -->
		<!-- <button class="p-1 mr-2 md:hidden" on:click={toggleSidebar}>
        <Menu class="h-5 w-5 text-gray-500 dark:text-gray-400" />
    </button> -->

		<div class="mr-3 h-10 w-10 overflow-hidden rounded-full">
			<img
				src={selectedRoom.image || '/placeholder.svg'}
				alt={selectedRoom.name}
				class="h-full w-full object-cover"
			/>
		</div>
		<div>
			<h3 class="font-medium text-gray-800 dark:text-gray-200">{selectedRoom.name}</h3>
			<p class="text-xs text-gray-500 dark:text-gray-400">Online</p>
		</div>
	</div>
	<button class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
		<MoreVertical class="h-5 w-5" />
	</button>
</div>
