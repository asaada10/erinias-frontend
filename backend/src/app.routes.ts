import Elysia from "elysia";

import { AuthController } from "./auth/infrastructure/auth.controller";

const routes = new Elysia({ prefix: "v1" }).use(AuthController);

export { routes as AppRoutes };
