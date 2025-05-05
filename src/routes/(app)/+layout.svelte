<script lang="ts">
	import { initLayoutContext } from '$lib/components/helpers/layout.svelte';
	import { Header, Sidebar } from '$lib/components/layouts';
	import { setDarkMode } from '$lib/states/themes.svelte';
	import { onMount } from 'svelte';
	const layout = initLayoutContext();
	let { children } = $props();
	let sidebarOpen = $state(false);
	function toggleSidebar(): void {
		sidebarOpen = !sidebarOpen;
	}
	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
			setDarkMode(true);
			document.documentElement.classList.add('dark');
		} else {
			setDarkMode(false);
			document.documentElement.classList.remove('dark');
		}
	});
</script>

<div
	class="min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100"
>
	<!-- Header -->
	<Header {sidebarOpen} {toggleSidebar} />

	<!-- Main Content -->
	<div class="flex h-[calc(100vh-64px)]">
		<!-- Sidebar -->
		<div
			class="md:relative md:flex md:w-80 md:flex-col md:border-r md:border-gray-200 dark:bg-gray-900/90 md:dark:border-gray-700"
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
