import { verify } from '@node-rs/argon2';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';



export const POST: RequestHandler = async ({ request, cookies }) => {
	const { username, password } = await request.json();
  const results = await db.select().from(table.user).where(eq(table.user.username, username));
  const existingUser = results.at(0);
  if (!existingUser) {
	return new Response(
		JSON.stringify({ message: 'Incorrect username or password' }), 
		{status: 400}
	)
  }

  // Verificar la contraseña
  const validPassword = await verify(existingUser.passwordHash, password);
  if (!validPassword) {
	return new Response(
		JSON.stringify({ message: 'Incorrect username or password' }), 
		{status: 400}
	)
  }

  // Crear la sesión
  const sessionToken = auth.generateSessionToken();
  const session = await auth.createSession(sessionToken, existingUser.id);
  cookies.set(auth.sessionCookieName, sessionToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: Bun.env.NODE_ENV === 'production',
		expires: session.expiresAt
  })
	return new Response(JSON.stringify({ message: 'Login successful' }), 
	{status: 200});
};

/*
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
*/


