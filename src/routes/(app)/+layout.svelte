<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { initLayoutContext } from '$lib/components/helpers/layout.svelte';
	import { Header, Sidebar } from '$lib/components/layouts';
	const layout = initLayoutContext();
	let { children } = $props();
	let sidebarOpen = $state(false);
	function toggleSidebar(): void {
		sidebarOpen = !sidebarOpen;
	}
</script>

<div
	class="min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100"
>
	<!-- Header -->
	<Header {sidebarOpen} {toggleSidebar} />

	<!-- Main Content -->
	<div class="flex h-[calc(100vh-64px)]">
		<!-- Sidebar -->
		<div class="hidden w-full md:flex">
			<Resizable.PaneGroup direction="horizontal" class="flex w-full">
				<Resizable.Pane
					class="relative flex w-80 flex-col border-r border-gray-200 dark:border-gray-700 dark:bg-gray-900/90"
					defaultSize={20}
				>
					<Sidebar {layout} {sidebarOpen} {toggleSidebar} />
				</Resizable.Pane>
				<Resizable.Handle withHandle />
				<Resizable.Pane class="flex flex-1 flex-col">
					{@render layout.chatHeader?.()}
					<div class="flex-1 overflow-y-auto p-4">
						{@render layout.chat?.()}
					</div>
					{@render layout.chatInput?.()}
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</div>

		<!-- Mobile: condicional según sidebarOpen -->
		{#if sidebarOpen}
			<div class="flex w-full md:hidden">
				<Sidebar {layout} {sidebarOpen} {toggleSidebar} />
			</div>
		{:else}
			<div class="flex w-full flex-col md:hidden">
				{@render layout.chatHeader?.()}
				<div class="flex-1 overflow-y-auto p-4">
					{@render layout.chat?.()}
				</div>
				{@render layout.chatInput?.()}
			</div>
		{/if}
	</div>
</div>
{@render children?.()}
