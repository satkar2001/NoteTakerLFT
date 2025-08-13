import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://notetaker-backend-jpgb.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteData {
  title: string;
  content: string;
  tags?: string[];
}

export interface PaginationResponse {
  notes: Note[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const getNotes = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
  favorites?: boolean;
  sortBy?: string;
  sortOrder?: string;
}): Promise<PaginationResponse> => {
  const response = await api.get('/notes', { params });
  return response.data;
};

export const getNoteById = async (id: string): Promise<Note> => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await api.post('/notes', data);
  return response.data;
};

export const updateNote = async (id: string, data: UpdateNoteData): Promise<Note> => {
  const response = await api.put(`/notes/${id}`, data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export const createLocalNote = async (data: CreateNoteData & { isLocal: boolean }) => {
  const response = await api.post('/notes/local', data);
  return response.data;
};

export const convertLocalNotes = async (notes: CreateNoteData[]): Promise<{ message: string; notes: Note[] }> => {
  const response = await api.post('/notes/convert-local', { notes });
  return response.data;
};
