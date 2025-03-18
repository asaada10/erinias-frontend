export interface User {
	id: string;
	name: string;
	image?: string;
	online?: boolean;
}

export interface Message {
	id: string;
	content: string;
	authorId: string;
	roomId: string;
	createdAt: string;
}

export interface Room {
	id: string;
	name: string;
	message?: string;
	createdAt?: string;
	image?: string;
	participants?: User[];
	unreadCount?: number;
}

export interface TokenPayload {
	userId: string;
	deviceId?: string;
	iss?: string;
	iat?: number;
	exp?: number;
	[key: string]: unknown;
}

export enum PermissionFlags {
	SendMessages = 1 << 0,
	ViewChannels = 1 << 1,
	ManageMessages = 1 << 2,
	ManageChannels = 1 << 3,
	ManageRoles = 1 << 4,
	KickMembers = 1 << 5,
	BanMembers = 1 << 6,
	ManageGuild = 1 << 7
}

export interface WSData {
	type: string;
	content: string;
	domain: string;
	room: string;
	user: string;
}
