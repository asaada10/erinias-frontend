import type { LoginResponse, Room, UserSearchResponse, ProfileResponse, ApiResponse, ChatMessage } from '../../types';
import { goto } from '$app/navigation';

export const useApi = () => {
	const baseUrl = '/api/v1';

	const handleRequest = async <T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> => {
		try {
			const response = await fetch(`${baseUrl}${endpoint}`, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				},
				credentials: 'include' // Necesario para enviar cookies
			});

			if (response.status === 401) {
				// Redirigir a login en caso de autenticación fallida
				goto('/login');
			}

			return await response.json();
		} catch (error: unknown) {
			throw error instanceof Error ? error : new Error('Unknown error');
		}
	};

	return {
		// Auth
		login: (email: string, password: string) =>
			handleRequest<LoginResponse>('/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
				credentials: 'include'
			}),

		register: (name: string, email: string, password: string, date?: string) =>
			handleRequest<LoginResponse>('/auth/register', {
				method: 'POST',
				body: JSON.stringify({ name, email, password, date }),
				credentials: 'include'
			}),

		refreshToken: () =>
			handleRequest<LoginResponse>('/auth/refresh', {
				method: 'POST',
				credentials: 'include'
			}),

		logout: () => handleRequest<ApiResponse<void>>('/auth/logout', { method: 'POST', credentials: 'include' }),

		// Rooms
		createRoom: (name: string | null) =>
			handleRequest<{status: 'success'; data: { room: Room }}>('/room/create', {
				method: 'POST',
				body: JSON.stringify({ name }),
				credentials: 'include'
			}),

		getRoom: (roomId: string) =>
			handleRequest<{status: 'success'; data: { room: Room }}>(`/room/${roomId}`, {
				method: 'GET',
				credentials: 'include'
			}),

		searchRooms: (params: { name?: string; id?: string }) =>
			handleRequest<{ status: 'success'; data: { rooms: Room[] } }>(
				'/room/search',
				{
					method: 'POST',
					body: JSON.stringify(params),
					credentials: 'include'
				}
			),

		getUserSearch: async (params: { username?: string; id?: string }) => {
			const endpoint = '/user/search';
			const options = {
				method: 'POST',
				body: JSON.stringify(params)
			};
			return handleRequest<UserSearchResponse>(endpoint, options);
		},

		getChatMessages: (roomId: string) =>
			handleRequest<ApiResponse<Array<ChatMessage>>>(`/chat/${roomId}`, {
				credentials: 'include'
			}),

		// User
		getProfile: async (userId: string) => {
			const endpoint = `/user/profile`;
			const options = {
				method: 'GET',
				headers: {
					'x-user-id': userId,
				},
			};
			return handleRequest<ProfileResponse>(endpoint, options);
		},

		updateProfile: async (userId: string, updates: Partial<ProfileResponse>) => {
			const endpoint = `/user/update`;
			const options = {
				method: 'PUT',
				headers: {
					'x-user-id': userId,
				},
				body: JSON.stringify(updates),
			};
			return handleRequest<ProfileResponse>(endpoint, options);
		},
	};
};
