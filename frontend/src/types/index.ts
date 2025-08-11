// types/index.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface LocalNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  isLocal: true;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type ViewMode = 'grid' | 'list';
export type AuthMode = 'login' | 'register';