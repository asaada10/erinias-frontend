import type { ApiResponse, LoginResponse, Room } from '../../types';

export const useApi = () => {
	const baseUrl = '/api/v1';

	const handleRequest = async <T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<ApiResponse<T>> => {
		try {
			const response = await fetch(`${baseUrl}${endpoint}`, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				},
				credentials: 'include'
			});

			if (response.status === 401) {
				// Clear cookies and redirect to login on unauthorized
				document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
				document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
				window.location.href = '/login';
				return { status: 'error', data: null, error: 'Unauthorized' };
			}

			if (!response.ok) {
				const error = await response.json();
				return { status: 'error', data: null, error: error.message || 'Request failed' };
			}

			const data = await response.json();
			return { status: 'success', data, error: null };
		} catch (error: unknown) {
			return {
				status: 'error',
				data: null,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	};

	return {
		// Auth
		login: (email: string, password: string) =>
			handleRequest<LoginResponse>('/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password })
			}),

		register: (name: string, email: string, password: string, date?: string) =>
			handleRequest<LoginResponse>('/auth/register', {
				method: 'POST',
				body: JSON.stringify({ name, email, password, date })
			}),

		refreshToken: () =>
			handleRequest<{ accessToken: string }>('/auth/refresh', {
				method: 'POST',
				credentials: 'include'
			}),

		logout: () => handleRequest('/auth/logout', { method: 'POST' }),

		// Rooms
		createRoom: (name: string) =>
			handleRequest<Room>('/room/create', {
				method: 'POST',
				body: JSON.stringify({ name })
			}),

		getUserSearch: (params: { username?: string; id?: string }) =>
			handleRequest<{ users: Array<{ id: string; username: string; avatar?: string }> }>(
				'/user/search',
				{
					method: 'POST',
					body: JSON.stringify(params),
					credentials: 'include'
				}
			),

		getChatMessages: (roomId: string) =>
			handleRequest<{
				messages: Array<{ id: string; content: string; sender: string; timestamp: string }>;
			}>(`/chat/${roomId}`, {
				credentials: 'include'
			})
	};
};
