<script lang="ts">
	import { setLayoutComponent, cleanLayoutContext } from '$lib/components/helpers/layout.svelte';
	import { Room, SidebarHeader, Chat, ChatInput, Search } from '$lib/components/layouts';
	// Asigna los componentes al contexto
	setLayoutComponent({
		sidebarHeader,
		room,
		search,
		chatHeader
	});

	$effect(() => {
		return cleanLayoutContext;
	});

	import { onMount } from 'svelte';
	// import { darkMode, toggleDarkMode } from '$lib/stores/theme';
	import { connect } from '$lib/stores/ws.svelte';
	import { searchRooms } from '$lib/stores/chat.svelte';

	// Search state

	// Connect to WebSocket on mount
	onMount(() => {
		connect();
	});
</script>

{#snippet sidebarHeader()}
	<SidebarHeader title="All Chats" />
{/snippet}

{#snippet room()}
	<Room rooms={searchRooms.results} />
{/snippet}

{#snippet chatHeader()}
<div class="flex h-full items-center justify-center">
	<div class="text-center">
		<h1 class="mb-4 text-2xl font-bold">No hay chat seleccionado</h1>
		<p class="text-gray-600">Selecciona una sala para comenzar a chatear.</p>
	</div>
</div>
{/snippet}


{#snippet search()}
	<Search placeholder="Search..." />
{/snippet}
