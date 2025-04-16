import { Context, CookieOptions, Static, t } from "elysia";
import { UserRepository } from "../../user/infrastructure/user.repository";
import Token from "../../shared/infrastructure/db/token";

export const LoginUserRequestSchema = t.Object({
  email: t.String(),
  password: t.String(),
});

export const LoginUserResponseSchema = t.Object({
  user: t.Object({
    id: t.String(),
    username: t.String(),
  }),
});

export type LoginUserRequest = Static<typeof LoginUserRequestSchema>;
export type LoginUserResponse = Static<typeof LoginUserResponseSchema>;

export const loginUseCase = async (
  loginData: LoginUserRequest,
  headers: Context["headers"],
  cookie: Context["cookie"]
): Promise<LoginUserResponse> => {
  const user = await UserRepository.getByEmail(loginData.email);
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await Bun.password.verify(
    loginData.password,
    user.passwordHash!
  );

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const { id, username } = user;
  const token = await Token.generate(id, headers);
  const secure = Bun.env.NODE_ENV === "production";

  const commonCookieOptions: CookieOptions = {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure,
  };

  cookie["refresh_token"].set({
    value: token.refreshToken,
    ...commonCookieOptions,
    maxAge: Token.getExpiryInMs(Token.REFRESH_EXPIRY),
  });

  cookie["access_token"].set({
    value: token.accessToken,
    ...commonCookieOptions,
  });
  cookie["user"].set({
    value: user.id,
    path: "/",
    sameSite: "strict",
    secure,
  });
  return {
    user: {
      id,
      username,
    },
  };
};
