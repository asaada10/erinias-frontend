import { writable } from 'svelte/store';

export const messages = writable([]);
export const otherUser = writable(null);

export async function fetchChat(otherUserId: string) {
	try {
		const res = await fetch(`/api/chat/${otherUserId}`, {
			credentials: 'include'
		});
		const data = await res.json();

		if (res.ok) {
			messages.set(data.messages);
			otherUser.set(data.otherUser);
		} else {
			console.error('Error fetching chat:', data.message);
		}
	} catch (error) {
		console.error('Failed to fetch chat:', error);
	}
}
