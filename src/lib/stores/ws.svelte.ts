// ws.ts (archivo de tienda) - sin onMount
import { goto } from '$app/navigation';
import { fetchRefresh } from '$lib/components/helpers/auth';
import { messages } from './chat.svelte';

export const ws = $state<{ socket: WebSocket | null }>({
	socket: null
});

async function fetchOTK() {
	const response = await fetchRefresh('/api/v1/auth/otk', {
		method: 'POST',
		credentials: 'include'
	});
	if (response.status === 200) {
		const { data } = await response.json();
		return data.otk;
	}
	return null;
}

export async function connect(id: string) {
	const socket = new WebSocket('wss://localhost:8888/v1/ws');

	socket.addEventListener('open', () => {
		console.log('WebSocket conectado');
	});

	socket.addEventListener('message', (event) => {
		const data = JSON.parse(event.data);
		console.log('Mensaje recibido:', data);
		console.log(`[${data.domain}/${data.room}]: ${data.content}`);

		messages.list.push({ ...data, createdAt: new Date() });
	});
	socket.addEventListener('close', async (e) => {
		console.log('WebSocket desconectado');
		ws.socket = null;
		if (e.code === 1008) {
			goto('/login');
			return;
		}
		await connect(id);
	});
	ws.socket = socket;
}

export function sendMessage(content: string, domain: string, room: string) {
	if (ws.socket && ws.socket.readyState === WebSocket.OPEN) {
		console.log('Enviando mensaje:', content);
		ws.socket.send(JSON.stringify({ type: 'message', content, domain, room }));
	}
}
