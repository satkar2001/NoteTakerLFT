import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    googleId?: string;
    avatar?: string;
    createdAt: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getGoogleAuthUrl = async (): Promise<{ url: string }> => {
  const response = await api.get('/auth/google/url');
  return response.data;
};

export const googleAuth = async (code: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/google', { code });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};
