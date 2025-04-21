import { fetchRefresh } from '$lib/components/helpers/auth';
import { searchRooms } from '$lib/stores/chat.svelte';
import type { Room } from '$lib/types';

let debounceTimer: Timer;

export function handleSearch(inputSearch: string) {
	clearTimeout(debounceTimer); // Limpiar el anterior
	debounceTimer = setTimeout(async () => {
		try {
			if (!inputSearch.length) {
				searchRooms.results = [];
				return;
			}

			const results = await fetchRooms(inputSearch);
			searchRooms.results = results.map((room: any) => ({
				id: room.id,
				name: room.username,
				image: room.avatar
			}));
			return results;
		} catch (error) {
			console.error('Error al buscar salas:', error);
		}
	}, 300);
}

export async function fetchRooms(input: String) {
	const result = await fetchRefresh('/api/v1/user/search', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username: input })
	}).then((res) => res.json());
	return result.data.users;
}

export async function fetchRoomsbyId(id: String): Promise<Room> {
	const result = await fetchRefresh('/api/v1/user/search', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id })
	}).then((res) => res.json());
	return result.data.users[0];
}
