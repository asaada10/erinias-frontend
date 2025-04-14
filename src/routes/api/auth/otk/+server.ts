// src/routes/api/auth/refresh.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { redis } from '$lib/db/redis';
import Token from '$lib/db/token';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const refreshToken = cookies.get('refresh_token');
	const accessToken = cookies.get('access_token');
	if (!accessToken || !(await Token.validate(accessToken, 'access'))) {
		return json({ message: 'Invalid or expired access token' }, { status: 401 });
	}
	if (!refreshToken) {
		return json({ message: 'No refresh token provided' }, { status: 400 });
	}

	// Validar la estructura del token
	const token = await Token.validate(refreshToken, 'refresh');
	if (!token) {
		return json({ message: 'Invalid or expired refresh token' }, { status: 401 });
	}

	const otk = await Token.generate(token.userId, request);

	await redis.set(otk.accessToken, accessToken, 'EX', Token.getExpiryInMs('1m'));

	return json({ otk: otk.accessToken }, { status: 200 });
};
