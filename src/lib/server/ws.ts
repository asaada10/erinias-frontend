import { serve, type ServerWebSocket } from "bun";
import Token from "$lib/db/token"; // Clase que ya usas para gestionar tokens
import { db } from "$lib/db";
import * as table from '$lib/db/schema';
import { eq } from 'drizzle-orm';

const rooms = new Map<string, Map<string, Set<ServerWebSocket<{ userId: string; domain: string; room: string }>>>>();

const server = serve({
  port: 4343,
  fetch(req, server) {
    // La verificación de la autenticación se realiza a través de un mensaje inicial
    if (server.upgrade(req)) return;
    return new Response("WebSocket server", { status: 426 });
  },
  websocket: {
    open(ws: ServerWebSocket<{ userId: string; domain: string; room: string }>) {
      console.log("Cliente conectado");
      ws.data = { userId: "", domain: "", room: "" }; // Estado inicial vacío
    },
    async message(ws, message) {
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch (error) {
        console.error("Error al parsear mensaje:", error);
        return;
      }

      // Primero, verifica que el tipo de mensaje sea "authenticate" y que contenga el token
      if (data.type === "authenticate" && typeof data.token === "string") {
        const token = await Token.validate(data.token); // Verifica el token y devuelve el userId

        if (!token || !token.userId) {
          console.warn("Token no válido");
          ws.send(JSON.stringify({ type: "error", message: "Token no válido" }));
          ws.close();
          return;
        }
        const user = await db.select().from(table.user).where(eq(table.user.id, token.userId));

        if (!user) {
          console.warn("Usuario no encontrado");
          ws.send(JSON.stringify({ type: "error", message: "Usuario no encontrado" }));
          ws.close();
          return;
        }

        ws.data.userId = token.userId;
        console.log(`Usuario ${ws.data.userId} autenticado`);
      }

      // Luego, maneja los mensajes de "join" o "message" solo después de que el usuario esté autenticado
      if (!ws.data.userId) {
        console.warn("Usuario no autenticado intenta unirse a una zona o sala.");
        return;
      }

      if (data.type === "join") {
        if (typeof data.domain !== "string" || typeof data.room !== "string") return;

        ws.data.domain = data.domain;
        ws.data.room = data.room;

        if (!rooms.has(data.domain)) rooms.set(data.domain, new Map());
        const domainMap = rooms.get(data.domain)!;

        if (!domainMap.has(data.room)) domainMap.set(data.room, new Set());
        const roomSet = domainMap.get(data.room)!;

        roomSet.add(ws);
        console.log(`Usuario ${ws.data.userId} unido a dominio: ${data.domain}, sala: ${data.room}`);
      } 

      else if (data.type === "message") {
        if (typeof data.domain !== "string" || typeof data.room !== "string" || typeof data.content !== "string") return;

        if (ws.data.domain !== data.domain || ws.data.room !== data.room) {
          console.warn(`Intento de mensaje no autorizado en ${data.domain}/${data.room}`);
          return;
        }

        const domainMap = rooms.get(data.domain);
        if (!domainMap) return;

        const roomSet = domainMap.get(data.room);
        if (!roomSet) return;

        for (const client of roomSet) {
          if (client !== ws) {
            client.send(JSON.stringify({ type: "message", content: data.content }));
          }
        }
      }
    },
    close(ws) {
      const { domain, room } = ws.data;

      if (!domain || !room) return;
      const domainMap = rooms.get(domain);
      if (!domainMap) return;

      const roomSet = domainMap.get(room);
      if (!roomSet) return;

      roomSet.delete(ws);
      if (roomSet.size === 0) domainMap.delete(room);
      if (domainMap.size === 0) rooms.delete(domain);

      console.log(`Cliente ${ws.data.userId} desconectado`);
    },
  },
});

console.log(`WebSocket corriendo en ws://localhost:${server.port}`);

export default server;
