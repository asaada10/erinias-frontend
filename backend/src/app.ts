// index.ts
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { login } from "./routes/auth/login";
import { register } from "./routes/auth/register";
import { refresh } from "./routes/auth/refresh";
import { otk } from "./routes/auth/otk";
import { chat } from "./routes/chat";
import { users } from "./routes/users";

new Elysia()
  .use(swagger())
  .group("/v1", (app) =>
    app
      .group("/auth", (app) =>
        app.use(login).use(register).use(refresh).use(otk)
      )
      .use(chat)
      .use(users)
  )
  .listen(8888);

console.log("🚀 Elysia app running at http://localhost:8888");
