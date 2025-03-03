import { verify } from '@node-rs/argon2';
import { db } from '$lib/db';
import * as table from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import Token from '$lib/db/token';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { username, password } = await request.json();
	const results = await db.select().from(table.user).where(eq(table.user.username, username));
	const existingUser = results.at(0);

	if (!existingUser) {
		return new Response(
			JSON.stringify({ message: 'Incorrect username or password' }),
			{ status: 400 }
		);
	}

	// Verificar la contraseña
	const validPassword = await verify(existingUser.passwordHash, password);
	if (!validPassword) {
		return new Response(
			JSON.stringify({ message: 'Incorrect username or password' }),
			{ status: 400 }
		);
	}

	// Generar tokens
	const { accessToken, refreshToken } = await Token.generate(existingUser.id, request);

	// Guardar refresh token en una cookie segura
	cookies.set('refresh_token', refreshToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: Bun.env.NODE_ENV === 'production',
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 días
	});

	// Enviar access token al cliente
	return new Response(
		JSON.stringify({ message: 'Login successful', accessToken }),
		{ status: 200 }
	);
};
