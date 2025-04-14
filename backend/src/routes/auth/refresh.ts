import { CookieOptions, Elysia } from "elysia";
import Token from "../../lib/db/token";
import { authHook } from "../../hooks/auth";

export const refresh = new Elysia().post(
  "/refresh",
  async ({ cookie, request, error }) => {
    const refreshToken = cookie["refresh_token"].value;

    if (!refreshToken) {
      return error(400, "No refresh token provided");
    }

    // Validar la estructura y firma del token (ya manejado internamente)
    const token = await Token.validate(refreshToken, "refresh");
    if (!token) {
      return error(401, "Invalid or expired refresh token");
    }

    // Generar nuevos tokens desde el refreshToken
    const tokens = await Token.renewTokens(refreshToken, request);
    if (!tokens) {
      return error(401, "Invalid or expired refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = tokens;
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
      value: token.userId,
      path: "/",
      sameSite: "strict",
      secure,
    });

    return { message: "Token refreshed" };
  },
  {
    beforeHandle: authHook,
  }
);
