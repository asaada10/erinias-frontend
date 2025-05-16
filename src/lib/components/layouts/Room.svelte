<script lang="ts">
	import { goto } from '$app/navigation';
	import { useApi } from '$lib/composables/api';
	import { profile, selectedRoom, userRooms } from '$lib/states/chat.svelte';
	import { onMount } from 'svelte';
	const api = useApi();
	const { sidebarOpen, toggleSidebar } = $props();
	import * as Avatar from "$lib/components/ui/avatar/index.js";

	// Cargar las salas del usuario autenticado
	onMount(() => {
		api.getAllRooms().then(async (data) => {
			if (!profile.user) {
				profile.user = (await api.getProfile()).data;
			}
			userRooms.rooms =
				data.data?.rooms.map((room: any) => ({
					...room,
					name:
						room.users.length === 2
							? room.users.find((user: any) => user.id !== profile.user.id)?.name
							: room.users.length === 1
								? 'You'
								: room.users.map((user: any) => user.name).join(', ')
				})) ?? [];
		});
	});

	async function goToRoom(room: any) {
		selectedRoom.selected = room;
	
		const { status, data } = await api.createRoom(
			room.users.map((user: any) => user.id),
			null
		);

		if (status === 'success' && data) {
			goto(`/chat/${data.room.id}`);
			if(sidebarOpen) toggleSidebar();
		} else {
			console.error('Error creating private chat');
		}
	}
</script>

{#each userRooms.rooms as room}
	<button
		onclick={() => goToRoom(room)}
		class={`flex w-full items-center p-3 text-left ${
			selectedRoom.selected?.id === room.id
				? 'bg-gray-100 dark:bg-gray-800'
				: 'hover:bg-gray-100 dark:hover:bg-gray-800'
		} cursor-pointer`}
		type="button"
	>
		<div class="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
		
			<Avatar.Root>
				<Avatar.Fallback>{room.name.slice(0, 2)}</Avatar.Fallback>
			  </Avatar.Root>		</div>
		<div class="flex-1">
			<div class="flex justify-between">
				<h3 class="font-medium text-gray-800 dark:text-gray-200">{room.name}</h3>
				<span class="text-xs text-gray-500 dark:text-gray-400">{room.createdAt}</span>
			</div>
			<p class="truncate text-sm text-gray-500 dark:text-gray-400">{room.message}</p>
		</div>
	</button>
{/each}
