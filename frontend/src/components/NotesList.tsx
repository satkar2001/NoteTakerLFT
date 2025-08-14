import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NoteCard from './NoteCard';
import type { Note, LocalNote, ViewMode } from '@/types';

type AnyNote = Note | LocalNote;

interface NotesListProps {
  notes: AnyNote[];
  viewMode: ViewMode;
  searchQuery: string;
  onDeleteNote: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onNoteClick: (noteId: string) => void;
  isLoading: boolean;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  viewMode,
  searchQuery,
  onDeleteNote,
  onToggleFavorite,
  onNoteClick,
  isLoading,
}) => {
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="text-lg">Loading notes...</div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No notes found</h3>
        <p className="text-gray-500 mb-4">
          {searchQuery
            ? 'Try adjusting your search.'
            : 'Create your first note to get started.'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1 max-w-4xl'
      }`}
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          viewMode={viewMode}
          isHovered={hoveredNote === note.id}
          onMouseEnter={() => setHoveredNote(note.id)}
          onMouseLeave={() => setHoveredNote(null)}
          onDelete={() => onDeleteNote(note.id)}
          onToggleFavorite={() => onToggleFavorite(note.id)}
          onClick={() => onNoteClick(note.id)}
                      isFavorite={note.isFavorite || false}
        />
      ))}
    </div>
  );
};

export default NotesList;
