import { db } from "$lib/db";
import * as table from '$lib/db/schema';
import type { ServerWebSocket } from "bun";
import { eq, and } from 'drizzle-orm';
import type { WSData } from "$lib/types";

const rooms = new Map<string, Map<string, Set<ServerWebSocket<WSData>>>>();

export async function handleConnection(ws: ServerWebSocket<WSData> , data: WSData) {
  if (data.type === "join") {
    await joinRoom(ws, data);
  }

  if (data.type === "message") {
    await sendMessage(ws, data);
  }
}

async function joinRoom(ws: ServerWebSocket<WSData>, data: WSData) {
  if (data.domain === "chat") {
    await joinPrivateChat(ws, data);
  } else {
    await joinGuildRoom(ws, data);
  }
}

async function joinPrivateChat(ws: ServerWebSocket<WSData>, data: WSData) {
  if (typeof data.room !== "string") return;

  const [user1, user2] = data.room.split('-').map(id => id.trim());

  if (!user1 || !user2) return;

  const isMember = await db
    .select()
    .from(table.friends)
    .where(and(
      eq(table.friends.userId, ws.data.user),
      eq(table.friends.friendId, user1)
    ));

  if (!isMember.length) {
    ws.send(JSON.stringify({ type: "error", message: "No eres miembro de este chat privado" }));
    return;
  }

  if (!rooms.has("chat")) rooms.set("chat", new Map());
  const chatRooms = rooms.get("chat")!;
  
  if (!chatRooms.has(data.room)) {
    chatRooms.set(data.room, new Set());
  }
  
  const roomSet = chatRooms.get(data.room)!;
  roomSet.add(ws);
  console.log(`Usuario ${ws.data.user} se unió al chat privado ${data.room}`);
}

async function joinGuildRoom(ws: ServerWebSocket<WSData>, data: WSData) {
  if (typeof data.domain !== "string" || typeof data.room !== "string") return;

  const isMember = await db
    .select()
    .from(table.domainMember)
    .where(and(
      eq(table.domainMember.guildId, data.domain),
      eq(table.domainMember.userId, ws.data.user)
    ));

  if (!isMember.length) {
    ws.send(JSON.stringify({ type: "error", message: "No eres miembro de este dominio" }));
    return;
  }

  if (!rooms.has(data.domain)) rooms.set(data.domain, new Map());
  const domainRooms = rooms.get(data.domain)!;
  
  if (!domainRooms.has(data.room)) {
    domainRooms.set(data.room, new Set());
  }

  const roomSet = domainRooms.get(data.room)!;
  roomSet.add(ws);
  console.log(`Usuario ${ws.data.user} se unió a la sala ${data.room} en el dominio ${data.domain}`);
}

async function sendMessage(ws: ServerWebSocket<WSData>, data: WSData) {
  if (data.domain === "chat") {
    await sendPrivateMessage(ws, data);
  } else {
    await sendGuildMessage(ws, data);
  }
}

async function sendPrivateMessage(ws: ServerWebSocket<WSData>, data: WSData) {
  const chatRooms = rooms.get("chat");
  if (!chatRooms) return;

  const roomSet = chatRooms.get(data.room);
  if (!roomSet) return;

  for (const client of roomSet) {
    if (client !== ws) {
      client.send(JSON.stringify({ type: "message", content: data.content }));
    }
  }
}

async function sendGuildMessage(ws: ServerWebSocket<WSData>, data: WSData) {
  const domainRooms = rooms.get(data.domain);
  if (!domainRooms) return;

  const roomSet = domainRooms.get(data.room);
  if (!roomSet) return;

  for (const client of roomSet) {
    if (client !== ws) {
      client.send(JSON.stringify({ type: "message", content: data.content }));
    }
  }
}
