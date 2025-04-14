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
		open() {
			console.log('Cliente conectado');
		},
		async message(ws: ServerWebSocket<WSData>, message) {
			
			try {
				ws.data = JSON.parse(message.toString());
			} catch (error) {
				console.error('Error al parsear mensaje:', error);
				return;
			}

			// Manejo de autenticación
			if (ws.data.type === 'authenticate' && ws.data.otk) {
				await authenticateUser(ws, ws.data.otk);
			}

			// Manejo de salas y mensajes
			if (ws.data.type === 'join' || ws.data.type === 'message') {
				await handleConnection(ws);
			}
		}
		// close(ws) {
		// 	// Handle WebSocket close
		// }
	}
});

console.log(`WebSocket corriendo en ws://localhost:${server.port}`);
export default server;
