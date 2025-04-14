import { CookieOptions, Elysia, t } from "elysia";
import { db } from "../../lib/db";
import * as table from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import Token from "../../lib/db/token";
import { redis } from "../../lib/db/redis";

export const login = new Elysia().post(
  "/login",
  async ({ body, cookie, error, request }) => {
    const { email, password } = body;

    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.email, email));
    const existingUser = results.at(0);

    if (!existingUser) {
      return error(400, "Incorrect username or password");
    }

    const validPassword = await Bun.password.verify(
      password,
      existingUser.passwordHash
    );

    if (!validPassword) {
      return error(400, "Incorrect username or password");
    }

    const { accessToken, refreshToken } = await Token.generate(
      existingUser.id,
      request
    );

    await redis.set(
      `refresh_token:${existingUser.id}`,
      refreshToken,
      "EX",
      Token.getExpiryInMs(Token.REFRESH_EXPIRY)
    );

    // Cookies
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
      value: existingUser.id,
      path: "/",
      sameSite: "strict",
      secure,
    });

    return {
      message: "Login successful",
    };
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String(),
    }),
  }
);
