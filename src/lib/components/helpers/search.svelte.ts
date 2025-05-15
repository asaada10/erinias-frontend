import { useApi } from "$lib/composables/api";
import { searchRooms } from "$lib/states/chat.svelte";
import type { Room } from "$lib/types";
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
	const result = await api.getRoom(id);
	if (
		result.status === 'success' &&
		result.data &&
	
		result.data.room
	) {
		const user = result.data.room;
		return {
			id: user.id,
			name: user.name || "",
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			users: user.users.map((user: any) => ({
				id: user.id,
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt
			}))
		};
	} else {
		throw new Error(result.message || 'No user data found');
	}
}
