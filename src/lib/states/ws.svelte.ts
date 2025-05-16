// ws.ts (archivo de tienda) - sin onMount
import { goto } from '$app/navigation';
import { useApi } from '$lib/composables/api';
import { messages } from './chat.svelte';

const api = useApi();

export const ws = $state<{ socket: WebSocket | null }>({
	socket: null
});

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

export async function connect() {
	try {
		const { data } = await api.otk();
		if (!data.otk) {
			console.error('No se pudo obtener el token de acceso');
			return;
		}

		const socket = new WebSocket('ws://'+ (import.meta.env.DEV ? 'localhost:8888' : import.meta.env.VITE_BASE_URL) +'/v1/ws?otk=' + data.otk);
		console.log('Conectando a WebSocket...');
		socket.addEventListener('open', () => {
			console.log('WebSocket conectado');
			reconnectAttempts = 0; // Reiniciar el contador de intentos al conectar exitosamente
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
			if (reconnectAttempts < maxReconnectAttempts) {
				reconnectAttempts++;
				console.log(`Intentando reconectar... (${reconnectAttempts}/${maxReconnectAttempts})`);
				await connect();
			} else {
				console.error('Se alcanzó el número máximo de intentos de reconexión');
			}
		});
		ws.socket = socket;
	} catch (error) {
		console.error('Error al conectar al WebSocket:', error);
		goto('/login');
	}
}

export function sendMessage(content: string, domain: string, room: string) {
	if (ws.socket && ws.socket.readyState === WebSocket.OPEN) {
		ws.socket.send(JSON.stringify({ type: 'message', content, domain, room }));
	}
}
