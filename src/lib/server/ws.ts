import { serve, type ServerWebSocket } from 'bun';
import { handleConnection } from './rooms';
import { authenticateUser } from './auth';
import type { WSData } from '$lib/types';

const server = serve({
	port: 4343,
	fetch(req, server) {
		if (server.upgrade(req)) return;
		return new Response('WebSocket server', { status: 426 });
	},
	websocket: {
		open(ws) {
			console.log('Cliente conectado');
			ws.data = { userId: '', domain: '', room: '' };
		},
		async message(ws: ServerWebSocket<WSData>, message) {
			console.log('Mensaje recibido:', message.toString());
			let data;
			try {
				data = JSON.parse(message.toString());
			} catch (error) {
				console.error('Error al parsear mensaje:', error);
				return;
			}

			// Manejo de autenticación
			if (data.type === 'authenticate') {
				await authenticateUser(ws, data.token);
			}

			// Manejo de salas y mensajes
			if (data.type === 'join' || data.type === 'message') {
				await handleConnection(ws, data);
			}
		},
		// close(ws) {
		// 	// Handle WebSocket close
		// }
	}
});

console.log(`WebSocket corriendo en ws://localhost:${server.port}`);
export default server;
