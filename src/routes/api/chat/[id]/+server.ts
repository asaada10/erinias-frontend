import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import * as table from '$lib/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import { redis } from '$lib/db/redis';
import Token from '$lib/db/token';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const accessToken = cookies.get('access_token');

	// Validar que el usuario esté autenticado
	if (!accessToken) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const tokenPayload = await Token.validate(accessToken, "access"); // Obtener ID del usuario autenticado
	if (!tokenPayload) {
		return json({ message: 'Invalid token' }, { status: 401 });
	}
    let userId = tokenPayload.userId;

    const otherUserId = params.id ?? '';
	// Verificar si los usuarios son amigos (opcional, si se requiere)
	// const friendship = await db
	// 	.select()
	// 	.from(table.friends)
	// 	.where(
	// 		or(
	// 			and(eq(table.friends.userId, userId), eq(table.friends.friendId, otherUserId)),
	// 			and(eq(table.friends.userId, otherUserId), eq(table.friends.friendId, userId))
	// 		)
	// 	);

	// if (friendship.length === 0) {
	// 	return json({ message: 'You are not friends with this user' }, { status: 403 });
	// }

	// Obtener los datos del otro usuario
	const otherUser = await db
		.select({
			id: table.user.id,
			username: table.user.username,
			avatar: table.user.avatar
		})
		.from(table.user)
		.where(eq(table.user.id, otherUserId))
		.then((res) => res.at(0));

	if (!otherUser) {
		return json({ message: 'User not found' }, { status: 404 });
	}

	// Verificar si hay mensajes en caché (Redis)
	const cachedMessages = await redis.get(`chat:messages:${userId}:${otherUserId}`);
	if (cachedMessages) {
		return json({
			otherUser,
			messages: JSON.parse(cachedMessages)
		});
	}

	// Obtener mensajes recientes entre ambos usuarios
	const messages = await db
		.select({
			id: table.message.id,
			content: table.message.content,
			authorId: table.message.authorId,
			createdAt: table.message.createdAt
		})
		.from(table.message)
		.where(
			or(
				and(eq(table.message.authorId, userId), eq(table.message.channelId, otherUserId)),
				and(eq(table.message.authorId, otherUserId), eq(table.message.channelId, userId))
			)
		)
		.orderBy(desc(table.message.createdAt))
		.limit(50); // Solo los últimos 50 mensajes

	// Guardar mensajes en caché (Redis) para futuras consultas
	await redis.set(
		`chat:messages:${userId}:${otherUserId}`,
		JSON.stringify(messages),
		'EX',
		60 * 5 // Cache por 5 minutos
	);

	return json({
		otherUser,
		messages
	});
};
