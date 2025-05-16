import type {
	LoginResponse,
	Room,
	UserSearchResponse,
	ProfileResponse,
	ApiResponse,
	ChatMessage,
	CreateRoomResponse
} from '../../types';
import { goto } from '$app/navigation';

export const useApi = () => {
	const baseUrl = import.meta.env.DEV ? '/api/v1' : 'https://' + import.meta.env.VITE_API_URL + '/v1';

	/**
	 * Realiza una petición HTTP genérica a la API.
	 * @template T Tipo de la respuesta esperada
	 * @param endpoint Endpoint relativo a la API
	 * @param options Opciones de la petición fetch
	 * @returns Una promesa con la respuesta parseada
	 */
	const handleRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
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
		/**
		 * Inicia sesión con email y contraseña.
		 * @param email Email del usuario
		 * @param password Contraseña del usuario
		 * @returns LoginResponse
		 */
		login: (email: string, password: string) =>
			handleRequest<LoginResponse>('/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
				credentials: 'include'
			}),

		/**
		 * Registra un nuevo usuario.
		 * @param username Nombre del usuario
		 * @param email Email del usuario
		 * @param password Contraseña
		 * @param date Fecha de nacimiento (opcional)
		 * @returns LoginResponse
		 */
		register: (username: string, email: string, password: string, date?: string) =>
			handleRequest<LoginResponse>('/auth/register', {
				method: 'POST',
				body: JSON.stringify({ username, email, password, date }),
				credentials: 'include'
			}),

		/**
		 * Refresca el token de autenticación.
		 * @returns LoginResponse
		 */
		refreshToken: () =>
			handleRequest<LoginResponse>('/auth/refresh', {
				method: 'POST',
				credentials: 'include'
			}),

		otk: () =>
			handleRequest<{ data: { otk: string } }>('/auth/otk', {
				method: 'POST',
				credentials: 'include'
			}),

		/**
		 * Cierra la sesión del usuario.
		 * @returns ApiResponse<void>
		 */
		logout: () =>
			handleRequest<ApiResponse<void>>('/auth/logout', { method: 'POST', credentials: 'include' }),

		// Rooms
		/**
		 * Crea una nueva sala.
		 * @param name Nombre de la sala o null para privada
		 * @returns CreateRoomResponse
		 */
		createRoom: (userIds: string[], name: string | null) =>
			handleRequest<CreateRoomResponse>('/room/create', {
				method: 'POST',
				body: JSON.stringify({ name, userIds }),
				credentials: 'include'
			}),

		/**
		 * Obtiene todas las salas del usuario autenticado.
		 * @returns ApiResponse<{ rooms: Room[] }>
		 */
		getAllRooms: () =>
			handleRequest<ApiResponse<{ rooms: Room[] }>>('/room/all', {
				method: 'GET',
				credentials: 'include'
			}),

		/**
		 * Obtiene los detalles de una sala por ID.
		 * @param roomId ID de la sala
		 * @returns { status: 'success'; data: { room: Room } }
		 */
		getRoom: (roomId: string) =>
			handleRequest<ApiResponse<{ room: Room }>>(`/room/${roomId}`, {
				method: 'GET',
				credentials: 'include'
			}),

		/**
		 * Busca salas por nombre o ID.
		 * @param params Parámetros de búsqueda (name, id)
		 * @returns { status: 'success'; data: { rooms: Room[] } }
		 */
		searchRooms: (params: { name?: string; id?: string }) =>
			handleRequest<{ status: 'success'; data: { rooms: Room[] } }>('/room/search', {
				method: 'POST',
				body: JSON.stringify(params),
				credentials: 'include'
			}),

		/**
		 * Busca usuarios por username o id.
		 * @param params username o id
		 * @returns UserSearchResponse
		 */
		getUserSearch: async (params: { username?: string; id?: string }) => {
			const endpoint = '/user/search';
			const options = {
				method: 'POST',
				body: JSON.stringify(params)
			};
			return handleRequest<UserSearchResponse>(endpoint, options);
		},

		/**
		 * Obtiene los mensajes de un chat por ID de sala.
		 * @param roomId ID de la sala
		 * @returns ApiResponse<Array<ChatMessage>>
		 */
		getChatMessages: (roomId: string) =>
			handleRequest<ApiResponse<ChatMessage>>(`/room/${roomId}/message`, {
				credentials: 'include'
			}),

		// User
		/**
		 * Obtiene el perfil de un usuario por ID.
		 * @param userId ID del usuario
		 * @returns ProfileResponse
		 */
		getProfile: async () => {
			const endpoint = `/user/profile`;
			const options = {
				method: 'GET'
			};
			return handleRequest<ApiResponse<ProfileResponse>>(endpoint, options);
		},

		/**
		 * Actualiza el perfil de un usuario.
		 * @param userId ID del usuario
		 * @param updates Campos a actualizar
		 * @returns ProfileResponse
		 */
		updateProfile: async (userId: string, updates: Partial<ProfileResponse>) => {
			const endpoint = `/user/update`;
			const options = {
				method: 'PUT',
				headers: {
					'x-user-id': userId
				},
				body: JSON.stringify(updates)
			};
			return handleRequest<ProfileResponse>(endpoint, options);
		}
	};
};
