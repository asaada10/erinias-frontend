<script lang="ts">
	import { initLayoutContext } from '$lib/components/helpers/layout.svelte';
	import { Header, Sidebar } from '$lib/components/layouts';
	const layout = initLayoutContext();
	let { children } = $props();
	let sidebarOpen = $state(false);
	function toggleSidebar(): void {
		sidebarOpen = !sidebarOpen;
	}
</script>

<div class="min-h-screen w-full overflow-hidden bg-white shadow-xl dark:bg-slate-950">
	<!-- Header -->
	<Header {sidebarOpen} {toggleSidebar} />

	<!-- Main Content -->
	<div class="flex h-[calc(100vh-64px)]">
		<!-- Sidebar -->
		<div
			class="md:relative md:flex md:w-80 md:flex-col md:border-r md:border-gray-200 md:dark:border-gray-700"
		>
			<Sidebar {layout} {sidebarOpen} {toggleSidebar} />
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
