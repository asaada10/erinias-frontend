import { serve } from "bun";

const server = serve({
  port: 3001,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("WebSocket server", { status: 426 });
  },
  websocket: {
    message(ws, message) {
      console.log("Mensaje recibido:", message);
      ws.send(`Echo: ${message}`);
    },
    open(/*ws*/) {
      console.log("Cliente conectado");
    },
    close(/*ws*/) {
      console.log("Cliente desconectado");
    }
  }
});

console.log(`WebSocket corriendo en ws://localhost:${server.port}`);

export default server;
