import type { LocalNote } from '@/types';

const LOCAL_NOTES_KEY = 'localNotes';

export const getLocalNotes = (): LocalNote[] => {
  try {
    const notes = localStorage.getItem(LOCAL_NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Failed to get local notes:', error);
    return [];
  }
};

export const saveLocalNote = (note: Omit<LocalNote, 'id' | 'createdAt' | 'isLocal'> & { isFavorite?: boolean }): LocalNote => {
  const localNotes = getLocalNotes();
  const newNote: LocalNote = {
    ...note,
    id: `local_${Date.now()}`,
    createdAt: new Date().toISOString(),
    isLocal: true,
    isFavorite: note.isFavorite || false,
  };
  
  localNotes.unshift(newNote);
  localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(localNotes));
  return newNote;
};

export const updateLocalNote = (id: string, updates: Partial<LocalNote> & { isFavorite?: boolean }): LocalNote | null => {
  const localNotes = getLocalNotes();
  const noteIndex = localNotes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) return null;
  
  const updatedNote = { ...localNotes[noteIndex], ...updates };
  localNotes[noteIndex] = updatedNote as LocalNote;
  localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(localNotes));
  
  return updatedNote as LocalNote;
};

export const deleteLocalNote = (id: string): boolean => {
  const localNotes = getLocalNotes();
  const filteredNotes = localNotes.filter(note => note.id !== id);
  
  if (filteredNotes.length === localNotes.length) {
    return false; 
  }
  
  localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(filteredNotes));
  return true;
};

export const clearLocalNotes = (): void => {
  localStorage.removeItem(LOCAL_NOTES_KEY);
};

export const getLocalNoteById = (id: string): LocalNote | null => {
  const localNotes = getLocalNotes();
  return localNotes.find(note => note.id === id) || null;
};
