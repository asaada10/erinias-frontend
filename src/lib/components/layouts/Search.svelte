<script lang="ts">
	import { Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { useApi } from '$lib/composables/api';
	import { profile, selectedRoom, userRooms } from '$lib/states/chat.svelte';
	import { goto } from '$app/navigation';

	const api = useApi();
	let { placeholder } = $props();

	let query = $state('');
	let searchResults = $state<any[]>([]);
	let isSearching = $state(false);
	let searchError = $state('');
	let showResults = $state(false);

	async function goToRoom(room: any) {
		const { status, data } = await api.createRoom([profile.user.id, room.id], null);
		selectedRoom.selected = {
			...data?.room,
			id: data?.room?.id ?? '',
			name: data?.room?.name ?? ''
		};
		if (status === 'success' && data) {
			goto(`/chat/${data.room.id}`);
			showResults = false;
		} else {
			console.error('Error creating private chat');
		}
	}

	async function handleSearch(q: string) {
		query = q;
		if (!q) {
			searchResults = [];
			showResults = false;
			return;
		}

		isSearching = true;
		searchError = '';
		showResults = true;

		try {
			const { status, data } = await api.searchRooms({ name: q });
			if (status === 'success' && data) {
				searchResults = data.rooms;
			}
		} catch (error) {
			searchError = 'Hubo un error al buscar.';
		} finally {
			isSearching = false;
		}
	}

	onMount(async () => {
		const data = await api.getAllRooms();
		userRooms.rooms =
			data.data?.rooms.map((room) => ({
				...room,
				name: room.name ?? ''
			})) ?? [];
	});
</script>

<div class="relative mx-4 mb-4">
	<div class="relative">
		<Search
			class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500"
		/>
		<input
			type="text"
			{placeholder}
			class="w-full rounded-lg bg-white py-2 pl-10 pr-4 text-sm text-gray-800 transition-colors focus:border-[#db324d] focus:outline-none focus:ring-2 focus:ring-[#db324d] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
			onfocus={() => (showResults = true)}
			onblur={() => setTimeout(() => (showResults = false), 200)}
			oninput={(e) => handleSearch(e.currentTarget.value)}
		/>
	</div>

	{#if showResults}
		<div class="search-dropdown">
			{#if isSearching}
				<div class="flex items-center justify-center p-4 text-sm text-gray-500 dark:text-gray-400">
					<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							fill="none"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Buscando...
				</div>
			{:else if searchError}
				<div class="p-4 text-sm text-[#db324d] dark:text-[#f04d6a]">
					<div class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clip-rule="evenodd"
							/>
						</svg>
						{searchError}
					</div>
				</div>
			{:else if searchResults.length > 0}
				<ul class="max-h-60 overflow-y-auto py-1">
					{#each searchResults as room}
						<button
							onclick={() => goToRoom(room)}
							class="cursor-pointer px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
						>
							<div class="flex items-center">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-[#db324d] dark:bg-pink-900 dark:text-pink-100"
								>
									{room.name.charAt(0).toUpperCase()}
								</div>
								<span class="ml-3">{room.name}</span>
							</div>
						</button>
					{/each}
				</ul>
			{:else if query}
				<div class="p-4 text-sm text-gray-500 dark:text-gray-400">
					<div class="flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clip-rule="evenodd"
							/>
						</svg>
						No se encontraron resultados.
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
