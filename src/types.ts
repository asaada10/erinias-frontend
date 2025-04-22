export type ApiResponse<T = any> = {
  status: 'success' | 'error';
  data: T | null;
  error: string | null;
};

// Tipos para las respuestas de la API
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface Room {
  id: string;
  name: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}
