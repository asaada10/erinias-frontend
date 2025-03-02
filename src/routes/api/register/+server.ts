import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';




export const POST: RequestHandler = async ({ request, cookies }) => {
    const { email, username, password } = await request.json();
  console.log('register', { email, username, password });
  const results = await db.select().from(table.user).where(eq(table.user.email, email));
  const existingUser = results.at(0);
  if (existingUser) {
    console.log('Existing user', existingUser);
    return new Response(
        JSON.stringify({ message: 'User already exists' }), 
        {status: 400}
    )
  }

  if(!validateEmail(email)) {
    console.log('Invalid email', email);
    return new Response(
        JSON.stringify({ message: 'Invalid email' }), 
        {status: 400}
    )
  }

  if(!validateUsername(username)) {
    console.log('Invalid username', username);
    return new Response(
        JSON.stringify({ message: 'Invalid username' }), 
        {status: 400}
    )
  }

  if(!validatePassword(password)) {
    console.log('Invalid password', password);
    return new Response(
        JSON.stringify({ message: 'Invalid password' }), 
        {status: 400}
    )
  } 

  // if(password !== passwordConfirm) {
  //   return new Response(
  //       JSON.stringify({ message: 'Passwords do not match' }), 
  //       {status: 400}
  //   )
  // }

  const passwordHash = await Bun.password.hash(password, 
    {
        algorithm: "bcrypt",
        cost: 4, 
      }
  );

  const newUser = await db.insert(table.user)
  .values({ username, email, passwordHash })
  .returning({ id: table.user.id });

  console.log('New user', newUser);

  // Crear la sesión
  const sessionToken = auth.generateSessionToken();
  const session = await auth.createSession(sessionToken, newUser[0]?.id);
  cookies.set(auth.sessionCookieName, sessionToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: Bun.env.NODE_ENV === 'production',
        expires: session.expiresAt
  })
    return new Response(JSON.stringify({ message: 'Registration successful' }), 
    {status: 200});
};



function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validateEmail(email: unknown): email is string {
	return (
		typeof email === 'string' &&
        email.length >= 3 &&
        email.length <= 255 &&
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

