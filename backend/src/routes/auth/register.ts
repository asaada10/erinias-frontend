import { CookieOptions, Elysia } from "elysia";
import Token from "../../lib/db/token";
import { db } from "../../lib/db";
import { redis } from "../../lib/db/redis"; // Importamos Redis
import * as table from "../../lib/db/schema";
import { eq } from "drizzle-orm";

// Definir el plugin de Elysia para el endpoint
export const register = new Elysia().post(
  "/register",
  async ({ request, cookie, error }) => {
    const { email, username, password, date } = await request.json();

    // Verificar si el usuario ya existe
    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.email, email));
    if (results.length > 0) {
      return error(400, "User already exists");
    }

    // Validaciones
    if (!validateEmail(email)) return error(400, "Invalid email");
    if (!validateUsername(username)) return error(400, "Invalid username");
    if (!validatePassword(password)) return error(400, "Invalid password");
    if (!validateDateOfBirth(date)) return error(400, "Invalid date");

    // Hashear la contraseña
    const passwordHash = await Bun.password.hash(password);

    // Crear el usuario en la base de datos
    const newUser = await db
      .insert(table.user)
      .values({ username, email, passwordHash, dateOfBirth: date })
      .returning({ id: table.user.id });

    const userId = newUser[0]?.id;
    if (!userId) return error(500, "Error creating user");

    // Generar tokens
    const { accessToken, refreshToken } = await Token.generate(userId, request);

    // Guardar el refresh token en Redis con expiración de 1 día
    await redis.set(
      `refresh_token:${userId}`,
      refreshToken,
      "EX",
      Token.getExpiryInMs(Token.REFRESH_EXPIRY)
    ); // 24 horas
    const secure = Bun.env.NODE_ENV === "production";

    const commonCookieOptions: CookieOptions = {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure,
    };

    cookie["refresh_token"].set({
      value: refreshToken,
      ...commonCookieOptions,
      maxAge: Token.getExpiryInMs(Token.REFRESH_EXPIRY),
    });

    cookie["access_token"].set({ value: accessToken, ...commonCookieOptions });
    cookie["user"].set({
      value: userId,
      path: "/",
      sameSite: "strict",
      secure,
    });

    return { message: "Registration successful" };
  }
);

// Validaciones
function validateUsername(username: unknown): username is string {
  return (
    typeof username === "string" &&
    username.length >= 3 &&
    username.length <= 31 &&
    /^[a-z0-9_-]+$/gi.test(username)
  );
}

function validateEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length >= 3 &&
    email.length <= 255 &&
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  );
}

function validatePassword(password: unknown): password is string {
  return (
    typeof password === "string" &&
    password.length >= 6 &&
    password.length <= 255
  );
}

function validateDateOfBirth(date: unknown): date is string {
  return (
    typeof date === "string" &&
    date.length === 10 &&
    /^\d{4}-\d{2}-\d{2}$/.test(date)
  );
}
