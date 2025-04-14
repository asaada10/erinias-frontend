<script lang="ts">
	import { setLayoutComponent, cleanLayoutContext } from '$lib/components/helpers/layout.svelte';
	import { Room, SidebarHeader, Chat, ChatInput, Search } from '$lib/components/layouts';
	// Asigna los componentes al contexto
	setLayoutComponent({
		sidebarHeader,
		room,
		search
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

<!-- {#snippet chatHeader()}
	<ChatHeader />
{/snippet} -->

<!-- {#snippet chat()}
	<Chat />
{/snippet} -->

<!-- {#snippet chatInput()}
	<ChatInput />
{/snippet} -->

{#snippet search()}
	<Search placeholder="Search..." />
{/snippet}
