import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import Token from '$lib/db/token';
import { json, redirect } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

import '$lib/server/ws';
const handleAuth: Handle = async ({ event, resolve }) => {
	const refreshToken = event.cookies.get('refresh_token') ?? "";

	// No hay token → usuario no autenticado
	const publicRoutes = ['/login', '/register'];
	const isApiRoute = event.url.pathname.startsWith('/api/');
	const isAuthRoute = ['/api/auth/login', '/api/auth/register'].includes(event.url.pathname);
	const checkRefreshToken = await Token.validate(refreshToken, 'refresh');
	console.log('checkRefreshToken', checkRefreshToken);
	if (!checkRefreshToken) {
		if (isApiRoute && !isAuthRoute) {
			return json({ message: 'Unauthorized' }, { status: 401 });
		}

		if (!isApiRoute && !publicRoutes.includes(event.url.pathname)) {
			return redirect(302, '/login');
		}
		console.log('No hay token');
		return resolve(event);
	} else {
		if (isAuthRoute) {
			return json({ message: 'The user is already logged in' }, { status: 401 });
		}
		if (!isApiRoute && publicRoutes.includes(event.url.pathname)) {
			return redirect(302, '/chat');
		}
	}

	// Intentar renovar el access token
	const accessToken = await Token.renewAccessToken(refreshToken, event.request);

	if (!accessToken) {
		// Si no se puede renovar, eliminar la cookie y redirigir
		event.cookies.delete('refresh_token', { path: '/' });
		return redirect(302, '/login');
	}

	// Obtener datos del usuario desde el access token
	const userData = await Token.validate(accessToken, 'access');
	if (!userData) {
		event.cookies.delete('refresh_token', { path: '/' });
		return redirect(302, '/login');
	}

	return resolve(event);
};

const paraglideHandle: Handle = ({ event, resolve }) => {
	const clonedRequest = event.request.clone();

	return paraglideMiddleware(clonedRequest, ({ locale }) => {
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		});
	});
};

export const handle: Handle = sequence(handleAuth, paraglideHandle);
