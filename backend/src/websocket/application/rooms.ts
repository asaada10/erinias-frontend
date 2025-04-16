import { WS } from "../../shared/infrastructure/utils/types";

export async function joinRoom(ws: WS, room: string) {
  if (!ws.isSubscribed(room)) {
    ws.subscribe(room);
    console.log(`El usuario ${ws.body.user} se ha unido a la sala ${room}`);
  }
}

// Función para enviar un mensaje a todos los miembros de una sala
export async function sendMessage(
  ws: WS,
  room: string,
  content: string,
  domain: string
) {
  if (!ws.isSubscribed(room)) {
    console.log(`La sala ${room} no existe o no tiene suscriptores`);
    return;
  }
  ws.publish(room, {
    type: "message",
    content: content,
    domain: domain,
    room: room,
  });
}
