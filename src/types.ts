// Tipos para las respuestas de la API
export interface User {
	id: string;
	username: string;
	avatar?: string;
	createdAt: string;
	isActive: boolean;
	role?: string;
}

export interface ProfileResponse {
	username: string;
	id: string;
	avatar: string | null;
	createdAt: Date;
	isActive: boolean;
	role: string;
}

export interface Room {
	id: string;
	name: string;
	image?: string;
	createdAt: string;
}

export type UserSearchResponse = ApiResponse<{ users: User[] }>;

export type ApiResponse<T> = {
	status: 'success' | 'error';
	data?: T;
	message?: any;
};

export type LoginResponse = ApiResponse<{ accessToken: string; refreshToken: string; user: User }>;

export interface ChatMessage {
	messages: Message[];
}

export interface Message {
	id: string;
	roomId: string;
	userId: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}