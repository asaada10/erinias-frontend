<script lang="ts">
	import { setLayoutComponent, cleanLayoutContext } from '$lib/components/helpers/layout.svelte';
	import {
		Room,
		SidebarHeader,
		ChatHeader,
		Chat,
		ChatInput,
		Search
	} from '$lib/components/layouts';

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

	import { onMount } from 'svelte';
	// import { darkMode, toggleDarkMode } from '$lib/stores/theme';
	import { connect } from '$lib/stores/ws';
	import { fetchRefresh } from '$lib/components/helpers/auth';
	import type { Room as RoomType } from '$lib/types';

	// Search state
	let inputSearch = $state('');
	let rooms: RoomType[] = $state([]);
	let isSearching = $state(false);
	let searchError = $state<string | null>(null);

	// Connect to WebSocket on mount
	onMount(() => {
		connect('ws://localhost:4343');
	});

	function handleSearch() {
		if (!inputSearch) {
			rooms = [];
			return;
		}

		async function fetchRooms() {
			isSearching = true;
			searchError = null;

			try {
				const result = await fetchRefresh('/api/users', {
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify({ inputSearch })
				}).then((res) => res.json());

				if (result && result.rooms) {
					rooms = result.rooms;
				} else {
					rooms = [];
				}
			} catch (error) {
				console.error('Error fetching rooms:', error);
				searchError = 'Failed to fetch rooms. Please try again.';
			} finally {
				isSearching = false;
			}
		}

		// Debounce search
		const timer = setTimeout(fetchRooms, 300);
		return () => clearTimeout(timer);
	}
</script>

{#snippet sidebarHeader()}
	<SidebarHeader title="All Chats" />
{/snippet}

{#snippet room()}
	<Room {rooms} />
{/snippet}

{#snippet chatHeader()}
	<ChatHeader />
{/snippet}

{#snippet chat()}
	<Chat />
{/snippet}

{#snippet chatInput()}
	<ChatInput />
{/snippet}

{#snippet search()}
	<Search placeholder="Search..." search={inputSearch} {handleSearch} {isSearching} {searchError} />
{/snippet}
