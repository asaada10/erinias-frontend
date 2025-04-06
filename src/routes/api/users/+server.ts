import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import * as table from '$lib/db/schema';
import { like, eq, and } from 'drizzle-orm';
import Token from '$lib/db/token';
export const POST: RequestHandler = async ({ request, cookies }) => {
	const { search, id } = await request.json();
	const accessToken = cookies.get('access_token') || "";
	const checkAccessToken = await Token.validate(accessToken, 'access');
	console.log('checkAccessToken', checkAccessToken);
	if (!checkAccessToken) {
		return json({ message: 'Invalid or expired accesss token' }, { status: 401 });
	}

	type User = Omit<
		table.User,
		'passwordHash' | 'resetToken' | 'emailVerified' | 'role' | 'twoFactorEnabled'
	>;
	const conditions = [];

	if (search) {
		conditions.push(like(table.user.username, `%${search}%`));
	}
	
	if (id) {
		conditions.push(eq(table.user.id, id));
	}
	const results: User[] = await db
		.select()
		.from(table.user)
		.where(and(...conditions));
	const users = results.map((user) => ({
		id: user.id,
		name: user.username,
		image: user.avatar
	}));
	return json(
		{ message: 'Success', rooms: users }, // Enviar el access token en la respuesta
		{
			status: 200
		}
	);
};
