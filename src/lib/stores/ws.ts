import { writable } from "svelte/store";

export const ws = writable<WebSocket | null>(null);

export function connectWebSocket(token: string) {
  const socket = new WebSocket("ws://localhost:4343");

  socket.addEventListener("open", () => {
    console.log("WebSocket conectado");
    socket.send(JSON.stringify({ type: "authenticate", token }));
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    console.log("Mensaje recibido:", data);
  });

  socket.addEventListener("close", () => {
    console.log("WebSocket desconectado");
    ws.set(null);
  });

  ws.set(socket);
}

export function sendMessage(content: string, domain: string, room: string) {
  ws.update((socket) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Enviando mensaje:", content);
      socket.send(JSON.stringify({ type: "message", content, domain, room }));
    }
    return socket;
  });
}
