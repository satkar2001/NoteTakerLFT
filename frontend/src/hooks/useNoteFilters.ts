import { useMemo } from 'react';
import type { Note, LocalNote } from '@/types';
import type { FilterOptions } from '@/components/FilterMenu';

type AnyNote = Note | LocalNote;

export const useNoteFilters = (
  notes: AnyNote[],
  searchQuery: string,
  filterOptions: FilterOptions
) => {
  const filteredAndSortedNotes = useMemo(() => {
    let filteredNotes = [...notes];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredNotes = filteredNotes.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply time range filter
    if (filterOptions.timeRange !== 'all') {
      const now = new Date();
      const timeRanges = {
        today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      };

      const cutoffDate = timeRanges[filterOptions.timeRange];
      filteredNotes = filteredNotes.filter(note => {
        const noteDate = new Date(note.createdAt);
        return noteDate >= cutoffDate;
      });
    }

    // Apply favorites filter
    if (filterOptions.showFavorites) {
      // For now, we'll show notes with "favorite" tag
      // You can extend this to store favorites in localStorage or backend
      filteredNotes = filteredNotes.filter(note =>
        note.tags.some(tag => tag.toLowerCase().includes('favorite'))
      );
    }

    // Apply recent filter
    if (filterOptions.showRecent) {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredNotes = filteredNotes.filter(note => {
        const noteDate = new Date(note.createdAt);
        return noteDate >= oneWeekAgo;
      });
    }

    // Apply sorting
    filteredNotes.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (filterOptions.sortBy) {
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case 'updatedAt':
          // For local notes, use createdAt as updatedAt
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
        return filterOptions.sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return filterOptions.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filteredNotes;
  }, [notes, searchQuery, filterOptions]);

  const stats = useMemo(() => {
    const totalNotes = notes.length;
    const filteredCount = filteredAndSortedNotes.length;
    const localNotes = notes.filter(note => 'isLocal' in note && note.isLocal);
    const permanentNotes = totalNotes - localNotes.length;

    return {
      totalNotes,
      filteredCount,
      localNotes: localNotes.length,
      permanentNotes,
      hasFilters: 
        searchQuery.trim() || 
        filterOptions.showFavorites || 
        filterOptions.showRecent || 
        filterOptions.timeRange !== 'all'
    };
  }, [notes, filteredAndSortedNotes, searchQuery, filterOptions]);

  return {
    filteredNotes: filteredAndSortedNotes,
    stats
  };
};
