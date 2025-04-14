// src/routes/api/auth/otk.ts
import { Elysia } from "elysia";
import { redis } from "../../lib/db/redis";
import Token from "../../lib/db/token";
import { authHook } from "../../hooks/auth";

export const otk = new Elysia().post(
  "/otk",
  async ({ request, cookie, error }) => {
    const refreshToken = cookie["refresh_token"].value;
    const accessToken = cookie["access_token"].value;

    if (!accessToken || !(await Token.validate(accessToken, "access"))) {
      return error(401, "Invalid or expired access token");
    }
    if (!refreshToken) {
      return error(401, "No refresh token provided");
    }

    // Validar la estructura del token
    const token = await Token.validate(refreshToken, "refresh");
    if (!token) {
      return error(401, "Invalid or expired refresh token");
    }

    // Generar nuevo token de acceso (OTK - One-Time Key)
    const otk = await Token.generate(token.userId, request);

    // Guardar el OTK en Redis con expiración
    await redis.set(
      otk.accessToken,
      accessToken,
      "EX",
      Token.getExpiryInMs("1m")
    );

    return { otk: otk.accessToken };
  },
  {
    beforeHandle: authHook,
  }
);
