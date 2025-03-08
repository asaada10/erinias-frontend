import { db } from '$lib/db';
import * as table from '$lib/db/schema';
import type { ServerWebSocket } from 'bun';
import { eq, and } from 'drizzle-orm';
import type { WSData } from '$lib/types';

const rooms = new Map<string, Map<string, Set<ServerWebSocket<WSData>>>>(); // Aquí guardamos los chats privados

export async function handleConnection(ws: ServerWebSocket<WSData>, data: WSData) {
	if (data.type === 'join') {
		await joinPrivateChat(ws, data);
	}

	if (data.type === 'message') {
		await sendPrivateMessage(ws, data);
	}
}

async function joinPrivateChat(ws: ServerWebSocket<WSData>, data: WSData) {
	if (typeof data.room !== 'string') return;

	const [user1, user2] = data.room.split('-').map((id) => id.trim());

	if (!user1 || !user2) return;

	// Verificamos si el usuario está en la lista de amigos para acceder al chat privado
	const isMember = await db
		.select()
		.from(table.friends)
		.where(and(eq(table.friends.userId, ws.data.user), eq(table.friends.friendId, user1)));

	if (!isMember.length) {
		ws.send(JSON.stringify({ type: 'error', message: 'No eres miembro de este chat privado' }));
		return;
	}

	// Añadir el chat privado a la lista de rooms (si no existe)
	if (!rooms.has('chat')) rooms.set('chat', new Map());
	const chatRooms = rooms.get('chat')!;

	if (!chatRooms.has(data.room)) {
		chatRooms.set(data.room, new Set());
	}

	const roomSet = chatRooms.get(data.room)!;
	roomSet.add(ws); // Añadir el WebSocket al set de la sala

	console.log(`Usuario ${ws.data.user} se unió al chat privado ${data.room}`);
}

async function sendPrivateMessage(ws: ServerWebSocket<WSData>, data: WSData) {
	const chatRooms = rooms.get('chat');
	if (!chatRooms) return;

	const roomSet = chatRooms.get(data.room);
	if (!roomSet) return;

	for (const client of roomSet) {
		if (client !== ws) {
			client.send(JSON.stringify({ type: 'message', content: data.content }));
		}
	}
}
