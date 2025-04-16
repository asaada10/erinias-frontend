import Elysia from "elysia";

import { AuthController } from "./auth/infrastructure/auth.controller";
import { UserController } from "./user/infrastructure/user.controller";
import { WsController } from "./websocket/infrastructure/ws.controller";

const routes = new Elysia({ prefix: Bun.env.APP_VERSION })
  .use(AuthController)
  .use(UserController)
  .use(WsController);

export { routes as AppRoutes };
