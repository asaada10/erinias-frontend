import Token from '$lib/db/token';
import { db } from '$lib/db';
import { redis } from '$lib/db/redis'; // Importamos Redis
import * as table from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { json, type RequestHandler } from '@sveltejs/kit';
export const POST: RequestHandler = async ({ request, cookies }) => {
	const { email, username, password, date } = await request.json();

	// Verificar si el usuario ya existe
	const results = await db.select().from(table.user).where(eq(table.user.email, email));
	if (results.length > 0) {
		return json({ message: 'User already exists' }, { status: 400 });
	}

	// Validaciones
	if (!validateEmail(email)) return json({ message: 'Invalid email' }, { status: 400 });
	if (!validateUsername(username)) return json({ message: 'Invalid username' }, { status: 400 });
	if (!validatePassword(password)) return json({ message: 'Invalid password' }, { status: 400 });
	if (!validateDateOfBirth(date)) return json({ message: 'Invalid date' }, { status: 400 });

	// Hashear la contraseña
	const passwordHash = await Bun.password.hash(password);

	// Crear el usuario en la base de datos
	const newUser = await db
		.insert(table.user)
		.values({ username, email, passwordHash, dateOfBirth: date })
		.returning({ id: table.user.id });

	const userId = newUser[0]?.id;
	if (!userId) return json({ message: 'Error creating user' }, { status: 500 });

	console.log('New user', newUser);

	// Generar tokens
	const { accessToken, refreshToken } = await Token.generate(userId, request);

	// Guardar el refresh token en Redis con expiración de 1 día
	await redis.set(
		`refresh_token:${userId}`,
		refreshToken,
		'EX',
		Token.getExpiryInMs(Token.REFRESH_EXPIRY)
	); // 24 horas

	// Establecer la cookie con el accessToken
	cookies.set('accessToken', accessToken, {
		httpOnly: true, // Protege contra ataques XSS
		secure: process.env.NODE_ENV === 'production', // Solo en HTTPS
		sameSite: 'strict', // Previene ataques CSRF
		maxAge: Token.getExpiryInMs(Token.REFRESH_EXPIRY),
		path: '/'
	});

	cookies.set('access_token', accessToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: Bun.env.NODE_ENV === 'production'
	});

	// Devolver un mensaje de éxito sin incluir el accessToken
	return json({ message: 'Registration successful' }, { status: 200 });
};

// Validaciones
function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/gi.test(username)
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

function validateDateOfBirth(date: unknown): date is string {
	console.log('date', date);
	return typeof date === 'string' && date.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(date);
}
