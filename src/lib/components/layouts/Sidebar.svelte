<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import Room from './Room.svelte';
	let { layout, sidebarOpen, toggleSidebar } = $props();
</script>

<div
	class={`${sidebarOpen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950' : 'hidden'} h-full w-full md:block`}
>
	<!-- Back button for mobile -->
	{#if sidebarOpen}
		<div class="flex items-center border-b border-gray-200 p-3 dark:border-gray-700 md:hidden">
			<button class="mr-2 p-1" onclick={toggleSidebar}>
				<ArrowLeft class="h-5 w-5 text-gray-500 dark:text-gray-400" />
			</button>
			<span class="font-medium text-gray-800 dark:text-gray-200">Back to Chat</span>
		</div>
	{/if}

	<!-- Sidebar Header -->
	{@render layout.sidebarHeader?.()}

	<!-- Search -->
	{@render layout.search?.()}

	<!-- Room List -->
	<div class="flex-1 overflow-y-auto">
		<Room {toggleSidebar} />
	</div>
</div>
