// src/routes/api/auth/refresh.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import Token from '$lib/db/token';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const refreshToken = cookies.get('refresh_token');

	if (!refreshToken) {
		return json({ message: 'No refresh token provided' }, { status: 400 });
	}

	// Validar la estructura y firma del token (ya manejado internamente)
	const token = await Token.validate(refreshToken, 'refresh');
	if (!token) {
		return json({ message: 'Invalid or expired refresh token' }, { status: 401 });
	}

	// Generar nuevos tokens desde el refreshToken
	const tokens = await Token.renewTokens(refreshToken, request);
	if (!tokens) {
		return json({ message: 'Invalid or expired refresh token' }, { status: 401 });
	}

	const { accessToken, refreshToken: newRefreshToken } = tokens;

	// Guardar nuevos tokens en cookies
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
		sameSite: 'strict'
	});

	return json({ message: 'Token refreshed' }, { status: 200 });
};
