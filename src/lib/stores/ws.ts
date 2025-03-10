// ws.ts (archivo de tienda) - sin onMount
import { writable } from 'svelte/store';

export const ws = writable<WebSocket | null>(null);

// Función para obtener un nuevo OTK
async function fetchOTK() {
	const response = await fetch('/api/auth/otk', { method: 'POST', credentials: 'include' });
	if (response.status === 200) {
		const data = await response.json();
		return data.otk;
	}
	return null;
}

// Función para conectar el WebSocket
export async function connectWebSocket() {
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
	});

	socket.addEventListener('close', async () => {
		console.log('WebSocket desconectado');
		ws.set(null);
		await reconnect(); // Intenta reconectar cuando se cierra el WebSocket
	});

	ws.set(socket);
}

// Función para reconectar el WebSocket
async function reconnect() {
	const otk = await fetchOTK();
	if (!otk) return; // Si no se pudo obtener un nuevo OTK, no hacemos nada
	connectWebSocket(); // Vuelve a conectar el WebSocket con el nuevo OTK
}

// Enviar mensajes a través del WebSocket
export function sendMessage(content: string, domain: string, room: string) {
	ws.update((socket) => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			console.log('Enviando mensaje:', content);
			socket.send(JSON.stringify({ type: 'message', content, domain, room }));
		}
		return socket;
	});
}
