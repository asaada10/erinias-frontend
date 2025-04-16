import { WS } from "../../shared/infrastructure/utils/types";

export async function handleConnection(ws: WS) {
  if (ws.body.type === "join") {
    await joinPrivateChat(ws);
  }

  if (ws.body.type === "message") {
    await sendPrivateMessage(ws);
  }
}

async function joinPrivateChat(ws: WS) {
  console.log(ws.body.room);
}

async function sendPrivateMessage(ws: WS) {
  ws.send(
    JSON.stringify({
      type: "message",
      content: ws.body.content,
      domain: ws.body.domain,
      room: ws.body.room,
    })
  );
}
