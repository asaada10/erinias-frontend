import { useApi } from '$lib/composables/api';
import { searchRooms } from '$lib/stores/chat.svelte';
import type { Room, User } from '$lib/types/index.d';

const api = useApi();
let debounceTimer: NodeJS.Timeout;

export function handleSearch(inputSearch: string) {
	clearTimeout(debounceTimer); // Limpiar el anterior
	debounceTimer = setTimeout(async () => {
		try {
			if (!inputSearch.length) {
				searchRooms.results = [];
				return;
			}

			const result = await fetchRooms(inputSearch);
			if (result.status === 'success' && result.data?.users) {
				searchRooms.results = result.data.users.map((room: any) => ({
					id: room.id,
					name: room.username,
					image: room.avatar,
					createdAt: room.createdAt,
					isActive: room.isActive,
					role: room.role
				}));
				return result.data.users;
			} else {
				console.log(result);
				console.error(
					'Error al buscar salas:',
					result?.error?.message || 'No se recibieron resultados'
				);
				searchRooms.results = [];
			}
		} catch (error) {
			console.error('Error al buscar salas:', error);
			searchRooms.results = [];
		}
	}, 300);
}

export async function fetchRooms(input: string): Promise<any> {
	const params = { username: input };
	const result = await api.getUserSearch(params);
	return result;
}

export async function fetchRoomsbyId(id: string): Promise<Room> {
	const params = { id };
	const result = await api.getUserSearch(params);
	if (
		result.status === 'success' &&
		result.data &&
		'users' in result.data &&
		result.data.users[0]
	) {
		const user = result.data.users[0];
		return {
			id: user.id,
			name: user.username,
			image: user.avatar
		};
	} else {
		throw new Error(result.error?.message || 'No user data found');
	}
}
