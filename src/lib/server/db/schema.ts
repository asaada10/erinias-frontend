import { pgTable, text, timestamp, date, boolean } from 'drizzle-orm/pg-core';
import Snowflake from './Snowflake';

export const user = pgTable('user', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	dateOfBirth: date('date_of_birth'),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	avatar: text('avatar'),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
	isActive: boolean('is_active').default(true),
	resetToken: text('reset_token'),
	emailVerified: boolean('email_verified').default(false),
	role: text('role').default('user'),
	twoFactorEnabled: boolean('two_factor_enabled').default(false),



});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
