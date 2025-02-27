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
export const actions: Actions = {
	post: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		const results = await db.select().from(table.user).where(eq(table.user.username, username));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/demo/lucia');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.user).values({ id: userId, username, passwordHash });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/demo/lucia');
	}
};
*/


