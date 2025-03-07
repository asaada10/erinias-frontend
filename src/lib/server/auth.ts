import Token from "$lib/db/token"; // Clase que ya usas para gestionar tokens
import { db } from "$lib/db";
import * as table from '$lib/db/schema';
import type { WSData } from "$lib/types";
import type { ServerWebSocket } from "bun";
import { eq } from 'drizzle-orm';

export async function authenticateUser(ws: ServerWebSocket<WSData>, token: string) {
  const validatedToken = await Token.validate(token);

  if (!validatedToken || !validatedToken.userId) {
    ws.send(JSON.stringify({ type: "error", message: "Token no válido" }));
    ws.close();
    return;
  }

  const user = await db.select().from(table.user).where(eq(table.user.id, validatedToken.userId));

  if (!user) {
    ws.send(JSON.stringify({ type: "error", message: "Usuario no encontrado" }));
    ws.close();
    return;
  }

  ws.data.user = validatedToken.userId;
  console.log(`Usuario ${ws.data.user} autenticado`);
}
