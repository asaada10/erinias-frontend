import type { Room } from '$lib/types';
import { writable } from 'svelte/store';

export const messages = $state({list: []});
export const selectedRoom = writable<Room|null>();
export const searchRooms = $state<{ results: Room[] }>(
	{results: []},
);


export async function fetchChat(roomId: string) {
	try {
		const res = await fetch(`/api/chat/${roomId}`, {
			credentials: 'include'
		});
		const data = await res.json();

		if (res.ok) {
			messages.list = data.messages;
			// room.set(data.otherUser);
		} else {
			console.error('Error fetching chat:', data.message);
		}
	} catch (error) {
		console.error('Failed to fetch chat:', error);
	}
}
