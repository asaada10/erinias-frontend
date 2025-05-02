// ws.ts (archivo de tienda) - sin onMount
import { goto } from '$app/navigation';
import { useApi } from '$lib/composables/api';
import { messages } from './chat.svelte';

const api = useApi();

export const ws = $state<{ socket: WebSocket | null }>({
	socket: null
});

export async function connect() {
	const socket = new WebSocket('ws://localhost:8888/v1/ws');
	console.log('Conectando a WebSocket...');
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
		await connect();
	});
	ws.socket = socket;
}

export function sendMessage(content: string, domain: string, room: string) {
	if (ws.socket && ws.socket.readyState === WebSocket.OPEN) {
		console.log('Enviando mensaje:', content);
		ws.socket.send(JSON.stringify({ type: 'message', content, domain, room }));
	}
}
