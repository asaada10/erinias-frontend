import { useApi } from '$lib/composables/api';
import { searchRooms } from '$lib/stores/chat.svelte';
import type { Room } from '$lib/types';

const api = useApi();

let debounceTimer: Timer;

export function handleSearch(inputSearch: string) {
	clearTimeout(debounceTimer); // Limpiar el anterior
	debounceTimer = setTimeout(async () => {
		try {
			if (!inputSearch.length) {
				searchRooms.results = [];
				return;
			}

			const result = await fetchRooms(inputSearch);
			if (result.status === 'success') {
				searchRooms.results = Array.isArray(result.data)
					? result.data.map((room: any) => ({
							id: room.id,
							name: room.username,
							image: room.avatar
						}))
					: [];
				return Array.isArray(result.data) ? result.data : [];
			} else {
				console.error('Error al buscar salas:', result.error);
			}
		} catch (error) {
			console.error('Error al buscar salas:', error);
		}
	}, 300);
}

export async function fetchRooms(input: string) {
	const params = { username: input };
	const result = await api.getUserSearch(params);
	return result;
}

export async function fetchRoomsbyId(id: string): Promise<Room> {
	const params = { id };
	const result = await api.getUserSearch(params);
	if (result.status === 'success' && result.data?.users?.[0]) {
		const user = result.data.users[0];
		return {
			id: user.id,
			name: user.username,
			image: user.avatar
		};
	} else {
		throw new Error(result.error || 'No user data found');
	}
}
