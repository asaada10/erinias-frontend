import { db } from "../../shared/infrastructure/db";
import { eq } from "drizzle-orm";
import * as table from "../../shared/infrastructure/db/schema";
import Snowflake from "../../shared/infrastructure/utils/Snowflake";

export interface CreateRoomParms {
  name: string | null;
}

export class RoomRepository {
  static async create(room: CreateRoomParms): Promise<Partial<table.Room>> {
    const newRoom = await db
      .insert(table.room)
      .values({
        id: Snowflake.generate(new Date()),
        name: room.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: table.room.id, username: table.room.name });
    return newRoom[0];
  }

  static async getByName(name: string): Promise<table.Room[]> {
    const room = await db
      .select()
      .from(table.room)
      .where(eq(table.room.name, name));
    return room;
  }
  static async getById(id: string): Promise<table.Room | undefined> {
    const room = await db
      .select()
      .from(table.room)
      .where(eq(table.room.id, id));
    return room[0];
  }
}
