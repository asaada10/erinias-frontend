import { fetchRefresh } from '$lib/components/helpers/auth';
import type { Room } from '$lib/types';
let inputSearch = $state('');
let rooms: Room[] = $state([]);
let isSearching = $state(false);
let searchError = $state<string | null>(null);
export function handleSearch(e: KeyboardEvent & { currentTarget: HTMLInputElement }) {
    inputSearch = e.currentTarget.value;
  
    if (!inputSearch) {
        rooms = [];
        return;
    }

    async function fetchRooms() {
        isSearching = true;
        searchError = null;

        try {
            const result = await fetchRefresh('/api/users', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ search: inputSearch })
            }).then((res) => res.json());

            if (result && result.rooms) {
                rooms = result.rooms;
            } else {
                rooms = [];
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            searchError = 'Failed to fetch rooms. Please try again.';
        } finally {
            isSearching = false;
        }
    }

    // Debounce search
    const timer = setTimeout(fetchRooms, 300);
    return () => clearTimeout(timer);
}

export function getIsSearching() {
    return isSearching;
}

export function getSearchError() {
    return searchError;
}

export function getRooms() {
    return rooms;
}

