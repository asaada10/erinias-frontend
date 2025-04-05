import { fetchRefresh } from '$lib/components/helpers/auth';
import { searchRooms, selectedRoom } from '$lib/stores/chat.svelte';
import type { Room } from '$lib/types';

export function handleSearch(inputSearch: string) {
    const timer = setTimeout(async () => {
        try {
            searchRooms.results = await fetchRooms(inputSearch);
        } catch (error) {
            console.error('Error al buscar salas:', error);
        } finally {
        }
    }, 300);
    return () => clearTimeout(timer);
}

export async function fetchRooms(input: String) {
        const result = await fetchRefresh('/api/users', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ search: input })
        }).then((res) => res.json());
        return result.rooms ?? [];
}

export async function fetchRoomsbyId(id: String): Promise<Room> {
    const result  = await fetchRefresh('/api/users', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ id })
    }).then((res) => res.json());
    return result.rooms[0]; 
}

