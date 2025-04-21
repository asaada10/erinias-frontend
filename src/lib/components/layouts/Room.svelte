<script lang="ts">
	import { goto } from '$app/navigation';
	let { rooms } = $props();
	const active = true;
	import { selectedRoom } from '$lib/stores/chat.svelte';

	// Incluir una función para dar clic a una sala.
	let resultRooms = $derived.by(() => {
		return rooms;
	});

	async function goToRoom(room: any) {
		selectedRoom.selected = room;
		const response = await fetch(`/api/v1/room/create`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				isPrivate: true,
				userIds: [selectedRoom.selected.id, room.id]
			}),
		});

		if (response.ok) {
			const data = await response.json();
			goto(`/chat/${data.data.room.id}`);
		} else {
			console.error('Error creating private chat:', response.statusText);
		}
	}
</script>

{#each resultRooms as room}
	<button
		onclick={() => goToRoom(room)}
		class={`flex w-full items-center p-3 text-left ${
			active ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
		} cursor-pointer`}
		type="button"
	>
		<div class="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
			<img
				src={room.image || '/placeholder.svg'}
				alt={room.username}
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="flex-1">
			<div class="flex justify-between">
				<h3 class="font-medium text-gray-800 dark:text-gray-200">{room.name}</h3>
				<span class="text-xs text-gray-500 dark:text-gray-400">{room.createdAt}</span>
			</div>
			<p class="truncate text-sm text-gray-500 dark:text-gray-400">{room.message}</p>
		</div>
	</button>
{/each}
