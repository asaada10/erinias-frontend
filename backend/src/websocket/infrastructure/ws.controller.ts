import Elysia, { t } from "elysia";
import { authenticateUser } from "../application/auth";
import { handleConnection } from "../application/rooms";
import { WS } from "../../shared/infrastructure/utils/types";
import Token from "../../shared/infrastructure/db/token";

// Creamos el controlador de WebSocket para el chat
export const WsController = new Elysia().group("/ws", (app) =>
  app.ws("/", {
    body: t.Object({
      type: t.String(),
      room: t.String(),
      content: t.String(),
      domain: t.String(),
    }),
    open(ws) {
      console.log("Usuario conectado");
    },

    async message(ws: WS, data) {
      try {
        await authenticateUser(ws);

        // Manejo de salas y mensajes
        if (data.type === "join" || data.type === "message") {
          await handleConnection(ws);
        }
      } catch (error) {
        console.log("Error al procesar el mensaje:", error);
        ws.send(
          JSON.stringify({
            status: "error",
            message: "Error al procesar el mensaje",
          })
        );
      }
    },
    close(ws) {
      console.log("Usuario desconectado");
      // Clear session perhaps?
    },
  })
);
