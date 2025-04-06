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
            searchRooms.results = results;
            return results;
        } catch (error) {
            console.error('Error al buscar salas:', error);
        }
    }, 300);
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

