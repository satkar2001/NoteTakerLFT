import { useMemo } from 'react';
import type { Note, LocalNote } from '@/types';
import type { FilterOptions } from '@/components/FilterMenu';
import type { SortOptions } from '@/components/SortButton';

type AnyNote = Note | LocalNote;

export const useNoteFilters = (
  notes: AnyNote[],
  searchQuery: string,
  filterOptions: FilterOptions,
  sortOptions: SortOptions
) => {
  const filteredAndSortedNotes = useMemo(() => {
    let filteredNotes = [...notes];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredNotes = filteredNotes.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filterOptions.showFavorites) {
      filteredNotes = filteredNotes.filter(note => note.isFavorite);
    }

    if (filterOptions.selectedTags.length > 0) {
      filteredNotes = filteredNotes.filter(note =>
        note.tags.some(tag => filterOptions.selectedTags.includes(tag))
      );
    }

    filteredNotes.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortOptions.sortBy) {
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case 'updatedAt':
          aValue = 'updatedAt' in a ? new Date(a.updatedAt) : new Date(a.createdAt);
          bValue = 'updatedAt' in b ? new Date(b.updatedAt) : new Date(b.createdAt);
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (aValue < bValue) {
        return sortOptions.sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOptions.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filteredNotes;
  }, [notes, searchQuery, filterOptions, sortOptions]);

  const stats = useMemo(() => {
    const totalNotes = notes.length;
    const filteredCount = filteredAndSortedNotes.length;
    const localNotes = notes.filter(note => 'isLocal' in note && note.isLocal);
    const permanentNotes = totalNotes - localNotes.length;

    const allTags = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => allTags.add(tag));
    });

    return {
      totalNotes,
      filteredCount,
      localNotes: localNotes.length,
      permanentNotes,
      availableTags: Array.from(allTags).sort(),
      hasFilters: 
        searchQuery.trim() || 
        filterOptions.showFavorites || 
        filterOptions.selectedTags.length > 0
    };
  }, [notes, filteredAndSortedNotes, searchQuery, filterOptions]);

  return {
    filteredNotes: filteredAndSortedNotes,
    stats
  };
};
