import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import * as table from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import Token from '$lib/db/token';
import { redis } from '$lib/db/redis';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { email, password } = await request.json();

	const results = await db.select().from(table.user).where(eq(table.user.email, email));
	const existingUser = results.at(0);

	if (!existingUser) {
		return json(
			{ message: 'Incorrect username or password' },
			{
				status: 400
			}
		);
	}

	const validPassword = await Bun.password.verify(password, existingUser.passwordHash);

	if (!validPassword) {
		return json(
			{ message: 'Incorrect username or password' },
			{
				status: 400
			}
		);
	}

	// Generar tokens
	const { accessToken, refreshToken } = await Token.generate(existingUser.id, request);

	// Guardar refresh token en Redis con un tiempo de expiración (30 días)
	await redis.set(
		`refresh_token:${existingUser.id}`,
		refreshToken,
		'EX',
		Token.getExpiryInMs(Token.REFRESH_EXPIRY)
	); // 30 días

	// Guardar refresh token en una cookie segura
	cookies.set('refresh_token', refreshToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: Bun.env.NODE_ENV === 'production',
		maxAge: Token.getExpiryInMs(Token.REFRESH_EXPIRY)
	});

	cookies.set('access_token', accessToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: Bun.env.NODE_ENV === 'production',
	});

	// Enviar access token al cliente
	return json(
		{  message: 'Login successful' }, // Enviar el access token en la respuesta
		{
			status: 200
		}
	);
};
