<script lang="ts">
	import { fetchRefresh } from '$lib/components/helpers/auth';
	import { setLayoutComponent, cleanLayoutContext } from '$lib/components/helpers/layout.svelte';
	import { getRooms } from '$lib/components/helpers/search.svelte';
	import {
		Room,
		SidebarHeader,
		ChatHeader,
		Chat,
		ChatInput,
		Search
	} from '$lib/components/layouts';
	import { messages, selectedRoom } from '$lib/stores/chat';
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
	let roomId: string | null = null;

	// Conectar WebSocket al montar el componente
	onMount(() => {
		connect('ws://localhost:4343');

		// Obtener el roomId desde la URL o contexto
		const urlParams = new URLSearchParams(window.location.search);
		roomId = urlParams.get('roomId');

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
				messages.set(data.messages);
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
	<Room rooms={getRooms()} />
{/snippet}

{#snippet chatHeader()}
<!-- Esto cambia según /chat (cabecera de chat) /party (cabecera de grupo) /domain (cabecera de dominio) -->
	<ChatHeader  />
{/snippet}

{#snippet chat()}
<!-- Esto cambia según /chat (chat) /party (grupo) /domain (dominio) -->
	<Chat messages={$messages} />
{/snippet}

{#snippet chatInput()}
<!-- Esto cambia según /chat (input de chat) /party (input de grupo) /domain (input de dominio) -->
	<ChatInput />
{/snippet}

{#snippet search()}
<!-- Esto cambia según /chat (buscador) /party (buscador) /domain (buscador) -->
	<Search placeholder="Search..."  />
{/snippet}
