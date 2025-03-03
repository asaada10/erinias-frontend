import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import Token from '$lib/db/token';
import { redirect } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleAuth: Handle = async ({ event, resolve }) => {
	const refreshToken = event.cookies.get('refresh_token');

	// No hay token → usuario no autenticado
	if (!refreshToken) {
		// Redirigir si intenta acceder a rutas protegidas
		if (
			!['/login', '/register'].includes(event.url.pathname) &&
			!event.url.pathname.startsWith('/api')
		) {
			return redirect(302, '/login');
		}

		return resolve(event);
	}

	// Intentar renovar el access token
	const accessToken = await Token.renewAccessToken(refreshToken, event.request);

	if (!accessToken) {
		// Si no se puede renovar, eliminar la cookie y redirigir
		event.cookies.delete('refresh_token', { path: '/' });
		return redirect(302, '/login');
	}

	// Obtener datos del usuario desde el access token
	const userData = await Token.validateAccessToken(accessToken);
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
