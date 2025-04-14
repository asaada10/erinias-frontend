// ws.ts (archivo de tienda) - sin onMount
import { fetchRefresh } from '$lib/components/helpers/auth';
import { messages } from './chat.svelte';

export const ws = $state<{ socket: WebSocket | null }>({
	socket: null
});

// Función para obtener un nuevo OTK
async function fetchOTK() {
	const response = await fetchRefresh('/api/v1/auth/otk', {
		method: 'POST',
		credentials: 'include'
	});
	if (response.status === 200) {
		const data = await response.json();
		return data.otk;
	}
	return null;
}

// Función para conectar el WebSocket
export async function connect(id: string) {
	const otk = await fetchOTK();
	if (!otk) return; // Si no se obtuvo el OTK, no hacemos nada

	const socket = new WebSocket('ws://localhost:4343');

	socket.addEventListener('open', () => {
		console.log('WebSocket conectado');
		socket.send(JSON.stringify({ type: 'authenticate', otk }));
	});

	socket.addEventListener('message', (event) => {
		const data = JSON.parse(event.data);
		console.log('Mensaje recibido:', data);
		console.log(`[${data.domain}/${data.room}]: ${data.content}`);

		// if (data.type === 'message') {
		// 		// if(data.room === )
		// 		messages.list.push(data);
		// 	}
	});
	socket.addEventListener('close', async () => {
		console.log('WebSocket desconectado');
		ws.socket = null;
		await reconnect(id); // Intenta reconectar cuando se cierra el WebSocket
	});
	ws.socket = socket;
}

// Función para reconectar el WebSocket
async function reconnect(id: string) {
	const otk = await fetchOTK();
	if (!otk) return; // Si no se pudo obtener un nuevo OTK, no hacemos nada
	connect(id); // Vuelve a conectar el WebSocket con el nuevo OTK
}

// Enviar mensajes a través del WebSocket
export function sendMessage(content: string, domain: string, room: string) {
	if (ws.socket && ws.socket.readyState === WebSocket.OPEN) {
		console.log('Enviando mensaje:', content);
		ws.socket.send(JSON.stringify({ type: 'message', content, domain, room }));
	}
}
