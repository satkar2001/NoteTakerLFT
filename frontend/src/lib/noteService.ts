import axios from "axios";
import type { Note, LocalNote } from "../types";

const API_URL = "http://localhost:5000/api/notes";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getNotes = async (): Promise<Note[]> => {
  const res = await api.get('/');
  return res.data;
};

export const getNoteById = async (id: string): Promise<Note> => {
  const res = await api.get(`/${id}`);
  return res.data;
};

export const createNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Note> => {
  const res = await api.post('/', note);
  return res.data;
};

export const createLocalNote = async (note: Omit<LocalNote, 'id' | 'createdAt' | 'isLocal'>): Promise<{ id: string; title: string; content: string; tags: string[]; isLocal: boolean; message: string }> => {
  const res = await api.post('/local', { ...note, isLocal: true });
  return res.data;
};

export const updateNote = async (id: string, note: Partial<Note>): Promise<{ message: string }> => {
  const res = await api.put(`/${id}`, note);
  return res.data;
};

export const deleteNote = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete(`/${id}`);
  return res.data;
};

export const convertLocalNotes = async (localNotes: LocalNote[]): Promise<{ message: string; notes: Note[] }> => {
  const res = await api.post('/convert-local', { localNotes });
  return res.data;
};
