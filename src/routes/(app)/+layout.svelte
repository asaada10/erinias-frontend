<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { initLayoutContext } from '$lib/components/helpers/layout.svelte';
	const layout = initLayoutContext();
	let { children } = $props();
	// Estado del sidebar móvil
	let sidebarOpen = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<div class="min-h-screen w-full overflow-hidden bg-white shadow-xl dark:bg-slate-950">
	<!-- Header -->
	{@render layout.header?.()}

	<!-- Main Content -->
	<div class="flex h-[calc(100vh-64px)]">
		<!-- Sidebar -->
		<div
			class={`${sidebarOpen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950' : 'hidden'} md:relative md:flex md:w-80 md:flex-col md:border-r md:border-gray-200 md:dark:border-gray-700`}
		>
			<!-- Back button for mobile -->
			{#if sidebarOpen}
				<div class="flex items-center border-b border-gray-200 p-3 md:hidden dark:border-gray-700">
					<button class="mr-2 p-1" onclick={toggleSidebar}>
						<ArrowLeft class="h-5 w-5 text-gray-500 dark:text-gray-400" />
					</button>
					<span class="font-medium text-gray-800 dark:text-gray-200">Back to Chat</span>
				</div>
			{/if}

			<!-- Sidebar Header -->
			<div class="border-b">
				{@render layout.sidebarHeader?.()}
			</div>

			<!-- Search -->
			{@render layout.search?.()}

			<!-- Room List -->
			<div class="flex-1 overflow-y-auto">
				{@render layout.room?.()}
			</div>
		</div>

		<!-- Chat Area -->
		<div class="flex flex-1 flex-col">
			<!-- Chat Header -->
			{@render layout.chatHeader?.()}

			<!-- Messages -->
			<div class="flex-1 overflow-y-auto p-4">
				{@render layout.chat?.()}
			</div>

			<!-- Chat Input -->

			{@render layout.chatInput?.()}
		</div>
	</div>
</div>
{@render children?.()}
