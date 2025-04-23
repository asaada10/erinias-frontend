<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { setLayoutComponent, cleanLayoutContext } from '$lib/components/helpers/layout.svelte';
	import { fetchRoomsbyId } from '$lib/components/helpers/search.svelte';
	import {
		Room,
		SidebarHeader,
		ChatHeader,
		Chat,
		ChatInput,
		Search
	} from '$lib/components/layouts';
	import { messages, searchRooms, selectedRoom } from '$lib/stores/chat.svelte';
	import { connect } from '$lib/stores/ws.svelte';
	import { onMount } from 'svelte';
	import { useApi } from '$lib/composables/api';

	// Asigna los componentes al contexto
	setLayoutComponent({
		sidebarHeader,
		room,
		chatHeader,
		chat,
		chatInput,
		search
	});

	$effect(() => {
		return cleanLayoutContext;
	});

	// Obtener el ID de la sala del chat actual
	let roomId = $state<string>(page.params.id);

	// Conectar WebSocket al montar el componente
	onMount(async () => {
		if (!selectedRoom.selected) {
			const fetchRoom = await fetchRoomsbyId(roomId);
			console.log('fetchRoom', fetchRoom);
			selectedRoom.selected = fetchRoom;
		}
		// Obtener el roomId desde la URL o contexto

		if (roomId) {
			await fetchChatMessages(roomId);
			connect();
		}
	});

	// Obtener los mensajes del chat
	async function fetchChatMessages(roomId: string) {
		const api = useApi();
		try {
			const res = await api.getChatMessages(roomId);
			if (res.status === 'success' && res.data?.messages) {
				messages.list = res.data.messages;
			} else {
				console.error('Error fetching messages:', res.error);
			}
		} catch (error) {
			console.error('Error fetching messages:', error);
		}
	}
</script>

{#snippet sidebarHeader()}
	<!-- Esto cambia según /chat (nombre usuario) /party (nombre del grupo) /domain (nombre del dominio) -->
	<SidebarHeader title="All Chats" />
{/snippet}

{#snippet room()}
	<!-- Esto cambia según /chat (lista de chats) /party (lista de grupos) /domain (lista de dominios) -->
	<Room rooms={searchRooms.results} />
{/snippet}

{#snippet chatHeader()}
	<!-- Esto cambia según /chat (cabecera de chat) /party (cabecera de grupo) /domain (cabecera de dominio) -->
	{#if selectedRoom.selected}
		<ChatHeader selectedRoom={selectedRoom.selected} />
	{:else}
		<div class="flex h-full items-center justify-center">
			<div class="text-center">
				<h1 class="mb-4 text-2xl font-bold">No hay chat seleccionado</h1>
				<p class="text-gray-600">Selecciona una sala para comenzar a chatear.</p>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet chat()}
	<!-- Esto cambia según /chat (chat) /party (grupo) /domain (dominio) -->
	<Chat />
{/snippet}

{#snippet chatInput()}
	<!-- Esto cambia según /chat (input de chat) /party (input de grupo) /domain (input de dominio) -->
	<ChatInput room={selectedRoom.selected?.id} domain="chat" />
{/snippet}

{#snippet search()}
	<!-- Esto cambia según /chat (buscador) /party (buscador) /domain (buscador) -->
	<Search placeholder="Search..." />
{/snippet}
