// // ws.ts (archivo de tienda) - sin onMount
// import { fetchRefresh } from '$lib/components/helpers/auth';
// import { writable } from 'svelte/store';

// export const ws = writable<WebSocket | null>(null);

// // Función para obtener un nuevo OTK
// async function fetchOTK() {
// 	const response = await fetchRefresh('/api/auth/otk', { method: 'POST', credentials: 'include' });
// 	if (response.status === 200) {
// 		const data = await response.json();
// 		return data.otk;
// 	}
// 	return null;
// }

// // Función para conectar el WebSocket
// export async function connectWebSocket() {
// 	const otk = await fetchOTK();
// 	if (!otk) return; // Si no se obtuvo el OTK, no hacemos nada

// 	const socket = new WebSocket('ws://localhost:4343');

// 	socket.addEventListener('open', () => {
// 		console.log('WebSocket conectado');
// 		socket.send(JSON.stringify({ type: 'authenticate', otk }));
// 	});

// 	socket.addEventListener('message', (event) => {
// 		const data = JSON.parse(event.data);
// 		console.log('Mensaje recibido:', data);
// 	});

// 	socket.addEventListener('close', async () => {
// 		console.log('WebSocket desconectado');
// 		ws.set(null);
// 		await reconnect(); // Intenta reconectar cuando se cierra el WebSocket
// 	});

// 	ws.set(socket);
// }

// // Función para reconectar el WebSocket
// async function reconnect() {
// 	const otk = await fetchOTK();
// 	if (!otk) return; // Si no se pudo obtener un nuevo OTK, no hacemos nada
// 	connectWebSocket(); // Vuelve a conectar el WebSocket con el nuevo OTK
// }

// // Enviar mensajes a través del WebSocket
// export function sendMessage(content: string, domain: string, room: string) {
// 	ws.update((socket) => {
// 		if (socket && socket.readyState === WebSocket.OPEN) {
// 			console.log('Enviando mensaje:', content);
// 			socket.send(JSON.stringify({ type: 'message', content, domain, room }));
// 		}
// 		return socket;
// 	});
// }

import { writable, derived } from 'svelte/store';
import type { Message } from '$lib/types';

// Connection status
export const connectionStatus = writable<'connecting' | 'connected' | 'disconnected'>('disconnected');

// Messages store
export const messages = writable<Message[]>([]);

// Derived store for messages grouped by date
export const messagesByDate = derived(messages, $messages => {
  const grouped: Record<string, Message[]> = {};
  
  $messages.forEach(message => {
    const date = new Date(message.createdAt).toDateString();
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(message);
  });
  
  return grouped;
});

// WebSocket instance
export const ws = writable<WebSocket | null>(null);

// Connect to WebSocket
export function connect(url: string): void {
  connectionStatus.set('connecting');
  console.log('Connecting to WebSocket:', url);
  const socket = new WebSocket(url);
  console.log('socket', socket);
  
  socket.addEventListener('open', () => {
    connectionStatus.set('connected');
	console.log('WebSocket connected');
    ws.set(socket);
  });
  
  socket.addEventListener('close', () => {
    connectionStatus.set('disconnected');
    ws.set(null);
    
    // Reconnect after delay
    setTimeout(() => connect(url), 5000);
  });
  
  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        messages.update(msgs => [...msgs, data]);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    connectionStatus.set('disconnected');
  });
}

// Send message
export function sendMessage(content: string, domain: string, room: string): void {
  ws.subscribe(socket => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    
    const message = {
      type: 'message',
      content,
      domain,
      room,
      createdAt: new Date().toISOString()
    };
    
    socket.send(JSON.stringify(message));
  })();
}