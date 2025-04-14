import type { ServerWebSocket } from 'bun';
import type { WSData } from '$lib/types';

const rooms = new Map<string, Map<string, Set<ServerWebSocket<WSData>>>>(); // Aquí guardamos los chats privados

export async function handleConnection(ws: ServerWebSocket<WSData>) {
	if (ws.data.type === 'join') {
		await joinPrivateChat(ws);
	}

	if (ws.data.type === 'message') {
		await sendPrivateMessage(ws);
	}
}

async function joinPrivateChat(ws: ServerWebSocket<WSData>) {
	console.log(ws.data.room);
	if (typeof ws.data.room !== 'string') return;
	const [user1, user2] = ws.data.room.split('-').map((id) => id.trim());
	console.log(user1, user2);
	if (!user1 || !user2) return;
	// Verificamos si el usuario está en la lista de amigos para acceder al chat privado
	// const isMember = await db
	// 	.select()
	// 	.from(table.friends)
	// 	.where(and(eq(table.friends.userId, ws.data.user), eq(table.friends.friendId, user1)));

	// if (!isMember.length) {
	// 	ws.send(JSON.stringify({ type: 'error', message: 'No eres miembro de este chat privado' }));
	// 	return;
	// }

	// Añadir el chat privado a la lista de rooms (si no existe)
	if (!rooms.has('chat')) rooms.set('chat', new Map());
	const chatRooms = rooms.get('chat')!;

	if (!chatRooms.has(ws.data.room)) {
		chatRooms.set(ws.data.room, new Set());
	}

	const roomSet = chatRooms.get(ws.data.room)!;
	roomSet.add(ws); // Añadir el WebSocket al set de la sala

	console.log(`Usuario ${ws.data.user} se unió al chat privado ${ws.data.room}`);
}

async function sendPrivateMessage(ws: ServerWebSocket<WSData>) {
	// const chatRooms = rooms.get('chat');
	// if (!chatRooms) return;

	// const roomSet = chatRooms.get(data.room);
	// if (!roomSet) return;
	// console.log(data.content);

	// for (const client of roomSet) {
	// 	if (client !== ws) {
	console.log(ws);
			ws.send(JSON.stringify({ type: 'message', content: ws.data.content, domain: ws.data.domain, room: ws.data.room }));
	// 	}
	// }
}
