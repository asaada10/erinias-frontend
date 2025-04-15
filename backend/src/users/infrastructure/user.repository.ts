import { db } from "../../shared/infrastructure/db";
import { eq } from "drizzle-orm";
import * as table from "../../shared/infrastructure/db/schema";
export interface UserRecord {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
  created_at: Date;
  updated_at: Date;
}

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
}
