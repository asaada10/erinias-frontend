<script lang="ts">
	import {
		Header,
		Room,
		SidebarHeader,
		ChatHeader,
		Chat,
		ChatInput
	} from '$lib/components/layouts';

	import { Search, ArrowLeft } from 'lucide-svelte';


	// Estado reactivo para el modo oscuro
	let darkMode: boolean = $state(true);
	// Estado para controlar la visibilidad del sidebar en móvil
	let sidebarOpen: boolean = $state(false);

	// Función para alternar el modo oscuro
	function toggleDarkMode(): void {
		darkMode = !darkMode;
	}
	// Función para alternar la visibilidad del sidebar
	function toggleSidebar(): void {
		sidebarOpen = !sidebarOpen;
	}
	
</script>

<div
	class={`min-h-screen w-full overflow-hidden bg-white shadow-xl ${darkMode ? 'dark:bg-slate-950' : ''}`}
>
	<Header {sidebarOpen} {darkMode} {toggleSidebar} {toggleDarkMode} />
	<!-- Main Content -->
	<div class="flex h-[calc(100vh-64px)]">
		<!-- Sidebar - Mobile: absolute positioning, Desktop: normal flow -->
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
			<SidebarHeader />

			<!-- Search: pendiente de adaptar con Input.svelte -->
			<div class="border-b border-gray-200 p-3 dark:border-gray-700">
				<div class="relative">
					<Search
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
					/>
					<input
						type="text"
						placeholder="Search Friends to start new chat"
						class="w-full rounded-lg bg-gray-100 py-2 pr-4 pl-10 text-sm text-gray-800 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
					/>
				</div>
			</div>

			<!-- Contacts List -->
			<div class="flex-1 overflow-y-auto">
				<Room  {sidebarOpen} />
			</div>
		</div>

		<!-- Chat Area -->
		<div class="flex flex-1 flex-col">
			<!-- Chat Header -->
			<ChatHeader  {toggleSidebar} />

			<!-- Messages -->
			<div class="flex-1 overflow-y-auto p-4">
				<Chat />
			</div>
			<ChatInput />
		</div>
	</div>
</div>
