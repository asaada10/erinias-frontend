<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { fetchRefresh } from '$lib/components/helpers/auth';
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
	import { connect } from '$lib/stores/ws';
	import { onMount } from 'svelte';

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

	console.log(selectedRoom.selected);
	// Conectar WebSocket al montar el componente
	onMount(async () => {
		connect('ws://localhost:4343');
		console.log('selectedRoom', selectedRoom.selected);
		if (!selectedRoom.selected) {
			const fetchRoom = await fetchRoomsbyId(roomId);
			console.log('fetchRoom', fetchRoom);
			selectedRoom.selected = fetchRoom;
		}
		// Obtener el roomId desde la URL o contexto

		if (roomId) {
			fetchChatMessages(roomId);
		}
	});

	// Obtener los mensajes del chat
	async function fetchChatMessages(roomId: string) {
		try {
			const res = await fetchRefresh(`/api/chat/${roomId}`, {
				credentials: 'include'
			});
			const data = await res.json();
			if (data.messages) {
				messages.list = data.messages;
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
	<Chat messages={messages.list} />
{/snippet}

{#snippet chatInput()}
	<!-- Esto cambia según /chat (input de chat) /party (input de grupo) /domain (input de dominio) -->
	<ChatInput />
{/snippet}

{#snippet search()}
	<!-- Esto cambia según /chat (buscador) /party (buscador) /domain (buscador) -->
	<Search placeholder="Search..." />
{/snippet}
