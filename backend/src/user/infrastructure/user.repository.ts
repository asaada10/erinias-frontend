import { db } from "../../shared/infrastructure/db";
import { eq } from "drizzle-orm";
import * as table from "../../shared/infrastructure/db/schema";
import Snowflake from "../../shared/infrastructure/utils/Snowflake";

export interface CreateUserParms {
  username: string;
  email: string;
  password: string;
  date: string;
}

export class UserRepository {
  static async create(user: CreateUserParms): Promise<Partial<table.User>> {
    const newUser = await db
      .insert(table.user)
      .values({
        id: Snowflake.generate(new Date()),
        username: user.username,
        email: user.email,
        passwordHash: user.password,
        dateOfBirth: user.date,
      })
      .returning({ id: table.user.id, username: table.user.username });
    return newUser[0];
  }

  static async getByEmail(email: string): Promise<table.User | undefined> {
    const user = await db
      .select()
      .from(table.user)
      .where(eq(table.user.email, email));
    return user[0];
  }

  static async getByUsername(username: string): Promise<table.User[]> {
    const user = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));
    return user;
  }
  static async getById(id: string): Promise<table.User | undefined> {
    const user = await db
      .select()
      .from(table.user)
      .where(eq(table.user.id, id));
    return user[0];
  }
}
