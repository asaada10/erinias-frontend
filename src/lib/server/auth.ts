import Token from '$lib/db/token'; // Clase que ya usas para gestionar tokens
import { db } from '$lib/db';
import * as table from '$lib/db/schema';
import type { WSData } from '$lib/types';
import type { ServerWebSocket } from 'bun';
import { eq } from 'drizzle-orm';
import { redis } from '$lib/db/redis';

export async function authenticateUser(ws: ServerWebSocket<WSData>, otk: string) {
	const token = await redis.get(otk);
	if(!token) {
		ws.send(JSON.stringify({ type: 'error', message: 'Token no válido' }));
		return 
	}
	const validateOtk = await Token.validate(token, 'access');

	if (!validateOtk || !validateOtk.userId) {
		ws.send(JSON.stringify({ type: 'error', message: 'Token no válido' }));
		ws.close();
		return;
	}

	const user = await db.select().from(table.user).where(eq(table.user.id, validateOtk.userId));

	if (!user) {
		ws.send(JSON.stringify({ type: 'error', message: 'Usuario no encontrado' }));
		ws.close();
		return;
	}
	
	redis.del(otk);
	ws.data.user = validateOtk.userId;
	console.log(`Usuario ${ws.data.user} autenticado`);
}
