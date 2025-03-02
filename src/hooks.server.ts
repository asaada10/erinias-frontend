import { sequence } from '@sveltejs/kit/hooks'
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleAuth: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get(auth.sessionCookieName);

    // Si no tiene sesión, asignamos valores nulos
    if (!sessionToken) {
        event.locals.user = null;
        event.locals.session = null;

        if (!['/login', '/register'].includes(event.url.pathname) && !event.locals.user) {
            return redirect(302, '/login');
        }

        return resolve(event);
    }

    // Si tiene token de sesión, validamos la sesión
    const { session, user } = await auth.validateSessionToken(sessionToken);
    if (session) {
        auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } else {
        auth.deleteSessionTokenCookie(event);
		return redirect(302, '/login');
    }

    // Asignar los valores de sesión y usuario a locals
    event.locals.user = user;
    event.locals.session = session;

    return resolve(event);
};

const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ locale }) => {
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		});
	});


export const handle: Handle = sequence(paraglideHandle, handleAuth);
