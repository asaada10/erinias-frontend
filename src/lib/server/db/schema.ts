import { pgTable, text, timestamp, integer, date, boolean, index } from 'drizzle-orm/pg-core';
import Snowflake from './Snowflake';
enum PermissionFlags {
	SendMessages = 1 << 0,
	ViewChannels = 1 << 1,  
	ManageMessages = 1 << 2, 
	ManageChannels = 1 << 3, 
	ManageRoles = 1 << 4,
	KickMembers = 1 << 5,
	BanMembers = 1 << 6,
	ManageGuild = 1 << 7,
  }
  
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

export const guildMember = pgTable('guild_member', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	guildId: text('guild_id')
		.notNull()
		.references(() => guild.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	role: text('role').default('member'),
	joinedAt: timestamp('joined_at').defaultNow(),
})


export const guild = pgTable('guild', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
	ownerId: text('owner_id')
		.notNull()
		.references(() => user.id),
})

export const channel = pgTable('channel', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
	guildId: text('guild_id')
		.notNull()
		.references(() => guild.id, { onDelete: 'cascade' }),
})

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const message = pgTable('message', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	content: text('content').notNull(),
	authorId: text('author_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	channelId: text('channel_id')
		.notNull()
		.references(() => channel.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
	edited: boolean('edited').default(false)
}, (message) => ({
	channelIndex: index('channel_index').on(message.channelId),
	authorIndex: index('author_index').on(message.authorId)
}))

export const messageRead = pgTable('message_read', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	messageId: text('message_id')
		.notNull()
		.references(() => message.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	readAt: timestamp('read_at').defaultNow(),
})

export const permissions = pgTable('permissions', {
	id: text('id').primaryKey().default(Snowflake.generate(new Date())),
	guildId: text('guild_id')
		.notNull()
		.references(() => guild.id, { onDelete: 'cascade' }),
		guildMemberId: text('guild_member_id')
		.notNull()
		.references(() => guildMember.id, { onDelete: 'cascade' }),
	permission: integer('permission').notNull().default(PermissionFlags.ViewChannels),
})

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Guild = typeof guild.$inferInsert;
export type Channel = typeof channel.$inferInsert;
export type Message = typeof message.$inferInsert;
export type MessageRead = typeof messageRead.$inferInsert;
export type GuildMember = typeof guildMember.$inferInsert;
export type Permission = typeof permissions.$inferInsert;
