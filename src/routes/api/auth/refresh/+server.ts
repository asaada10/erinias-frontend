// src/routes/api/auth/refresh.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { redis } from '$lib/db/redis';
import Token from '$lib/db/token';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const refreshToken = cookies.get('refresh_token');

	if (!refreshToken) {
		return json({ message: 'No refresh token provided' }, { status: 400 });
	}

	// Validar la estructura del token
    console.log('refreshToken', refreshToken);
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

	// Generar nuevos tokens
	const tokens = await Token.renewTokens(refreshToken, request);
	if (!tokens) {
		return json({ message: 'Invalid or expired refresh token' }, { status: 401 });
	}

	const { accessToken, refreshToken: newRefreshToken } = tokens;

	// Guardar el nuevo refreshToken y mantener el anterior por un tiempo
	await redis.set(tokenKey, newRefreshToken, 'EX', Token.getExpiryInMs(Token.REFRESH_EXPIRY));
	await redis.set(
		`old_${tokenKey}`,
		storedRefreshToken,
		'EX',
		Token.getExpiryInMs(Token.REFRESH_EXPIRY) / 2
	);

	// Configurar la cookie del nuevo refreshToken
	cookies.set('refresh_token', newRefreshToken, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: Token.getExpiryInMs(Token.REFRESH_EXPIRY)
	});
    cookies.set('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    })

	return json({ message: 'Token refreshed' }, { status: 200 });
};
