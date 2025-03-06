interface User {
    name: string;
    email: string;
    avatar: string;
}

interface Team {
    name: string;
    plan: string;
}

interface Room {
    name: string;
    message: string;
    time: string;
    active: boolean;
    avatar: string;
}

interface Message {
    text: string;
    time: string;
    sent: boolean;
    date: string;
}

interface MessagesByDate {
    [key: string]: Message[];
}

interface TokenPayload {
	userId: string;
	deviceId?: string;
	iss?: string;
	iat?: number;
	exp?: number;
	[key: string]: unknown;
}

enum PermissionFlags {
	SendMessages = 1 << 0,
	ViewChannels = 1 << 1,
	ManageMessages = 1 << 2,
	ManageChannels = 1 << 3,
	ManageRoles = 1 << 4,
	KickMembers = 1 << 5,
	BanMembers = 1 << 6,
	ManageGuild = 1 << 7
}

export { User, Team, Room, Message, MessagesByDate, TokenPayload, PermissionFlags };