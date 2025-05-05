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
		<Resizable.PaneGroup direction="horizontal">
			<Resizable.Pane
				class="md:relative md:flex md:w-80 md:flex-col md:border-r md:border-gray-200 dark:bg-gray-900/90 md:dark:border-gray-700"
				defaultSize={20}
			>
				<Sidebar {layout} {sidebarOpen} {toggleSidebar} />
			</Resizable.Pane>
			<Resizable.Handle withHandle />

			<!-- Chat Area -->
			<Resizable.Pane class="flex flex-1 flex-col">
				<!-- Chat Header -->
				{@render layout.chatHeader?.()}

				<!-- Messages -->
				<div class="flex-1 overflow-y-auto p-4">
					{@render layout.chat?.()}
				</div>

				<!-- Chat Input -->

				{@render layout.chatInput?.()}
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</div>
</div>
{@render children?.()}
