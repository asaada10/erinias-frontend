import {
	pgTable,
	text,
	timestamp,
	integer,
	date,
	boolean,
	index,
	serial,
	primaryKey
} from 'drizzle-orm/pg-core';
import Snowflake from '../utils/Snowflake';
import { PermissionFlags } from '../types/index.d';

export const user = pgTable('user', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	dateOfBirth: date('date_of_birth'),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	avatar: text('avatar'),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
	isActive: boolean('is_active').default(true),
	resetToken: text('reset_token'),
	emailVerified: boolean('email_verified').default(false),
	role: text('role').default('user'),
	twoFactorEnabled: boolean('two_factor_enabled').default(false)
});
export const friends = pgTable('friends', {
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  friendId: text('friend_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
	primaryKey({ columns: [table.userId, table.friendId] })
]);

export const domainMember = pgTable('domain_member', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	guildId: text('guild_id')
		.notNull()
		.references(() => domain.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	role: text('role').default('member'),
	joinedAt: timestamp('joined_at').defaultNow()
});

export const domain = pgTable('domain', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
	ownerId: text('owner_id')
		.notNull()
		.references(() => user.id)
});

export const room = pgTable('room', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
	guildId: text('guild_id')
		.notNull()
		.references(() => domain.id, { onDelete: 'cascade' })
});

export const refreshTokens = pgTable('refresh_tokens', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull(),
	token: text('token').notNull(),
	deviceId: text('device_id').notNull(),
	revoked: boolean('revoked').notNull().default(false),
	expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
});

export const message = pgTable(
	'message',
	{
		id: text('id').primaryKey().default(Snowflake.generate(new Date())),
		content: text('content').notNull(),
		authorId: text('author_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		channelId: text('channel_id')
			.notNull()
			.references(() => room.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
		edited: boolean('edited').default(false)
	},
	(message) => ({
		channelIndex: index('channel_index').on(message.channelId),
		authorIndex: index('author_index').on(message.authorId)
	})
);

export const messageRead = pgTable('message_read', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	messageId: text('message_id')
		.notNull()
		.references(() => message.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	readAt: timestamp('read_at').defaultNow()
});

export const permissions = pgTable('permissions', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	guildId: text('guild_id')
		.notNull()
		.references(() => domain.id, { onDelete: 'cascade' }),
	guildMemberId: text('guild_member_id')
		.notNull()
		.references(() => domainMember.id, { onDelete: 'cascade' }),
	permission: integer('permission').notNull().default(PermissionFlags.ViewChannels)
});

export type RefreshToken = typeof refreshTokens.$inferInsert;
export type User = typeof user.$inferSelect;
export type Guild = typeof domain.$inferInsert;
export type Channel = typeof room.$inferInsert;
export type Message = typeof message.$inferInsert;
export type MessageRead = typeof messageRead.$inferInsert;
export type GuildMember = typeof domainMember.$inferInsert;
export type Permission = typeof permissions.$inferInsert;
