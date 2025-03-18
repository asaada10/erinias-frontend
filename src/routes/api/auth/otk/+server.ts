// src/routes/api/auth/refresh.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { redis } from '$lib/db/redis';
import Token from '$lib/db/token';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const refreshToken = cookies.get('refresh_token');
	const accessToken = cookies.get('access_token');
	if (!accessToken || !(await Token.validate(accessToken, 'access'))) {
		console.log('¿Culpa del access?', accessToken);
		return json({ message: 'Invalid or expired accesss token' }, { status: 401 });
	}
	if (!refreshToken) {
		return json({ message: 'No refresh token provided' }, { status: 400 });
	}

	// Validar la estructura del token
	const token = await Token.validate(refreshToken, 'refresh');
	if (!token) {
		return json({ message: 'Invalid or expired refresh token' }, { status: 401 });
	}

	const tokenKey = `refresh_token:${token.userId}`;
	const storedRefreshToken = await redis.get(tokenKey);
	const previousRefreshToken = await redis.get(`old_${tokenKey}`);
	if (!storedRefreshToken) {
		return json({ message: 'Invalid or expired refresh token' }, { status: 401 });
	}
	// Permitir solo si el refreshToken coincide con el actual o el anterior
	if (refreshToken !== storedRefreshToken && refreshToken !== previousRefreshToken) {
		return json({ message: 'Invalid or expired refresh token' }, { status: 401 });
	}

	const otk = await Token.generate(token.userId, request);

	await redis.set(otk.accessToken, accessToken, 'EX', Token.getExpiryInMs('1m'));

	return json({ message: 'Token refreshed', otk: otk.accessToken }, { status: 200 });
};
