import { Context, Static, t } from "elysia";
import Token from "../../shared/infrastructure/db/token";
import { redis } from "../../shared/infrastructure/db/redis";

export const OtkUserResponseSchema = t.Object({
  otk: t.String(),
});

export type OtkUserResponse = Static<typeof OtkUserResponseSchema>;

export const otkUseCase = async (
  headers: Context["headers"],
  cookie: Context["cookie"]
): Promise<OtkUserResponse> => {
  const otk = await Token.generate(cookie["refreshToken"].value!, headers);
  await redis.set(
    otk.accessToken,
    cookie["accessToken"].value!,
    "EX",
    Token.getExpiryInMs("1m")
  );

  return { otk: otk.accessToken };
};
