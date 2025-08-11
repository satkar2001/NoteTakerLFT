import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Tip from '@/components/Tip';
import NotesList from '@/components/NotesList';
import AuthDialog from '@/components/AuthDialog';
import FilterMenu from '@/components/FilterMenu';
import type { Note, LocalNote } from '@/types';
import type { FilterOptions } from '@/components/FilterMenu';
import { getNotes, deleteNote, convertLocalNotes } from '@/lib/noteService';
import { login, register, isAuthenticated, setToken, logout } from '@/lib/authService';
import { getLocalNotes, deleteLocalNote, clearLocalNotes } from '@/lib/localStorageService';
import { useNoteFilters } from '@/hooks/useNoteFilters';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<(Note | LocalNote)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register'>('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    showFavorites: false,
    showRecent: false,
    timeRange: 'all'
  });
  
  // Auth form state
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      if (authenticated) {
        fetchNotes();
      } else {
        loadLocalNotes();
      }
    };
    
    checkAuth();
  }, []);

  const loadLocalNotes = () => {
    const localNotes = getLocalNotes();
    setNotes(localNotes);
  };

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (error: unknown) {
      console.error('Failed to fetch notes:', error);
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 401) {
        // Token expired or invalid
        logout();
        setIsLoggedIn(false);
        loadLocalNotes();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      if (isLoggedIn) {
        await deleteNote(noteId);
        setNotes(prev => prev.filter(note => note.id !== noteId));
      } else {
        // Delete from local storage
        deleteLocalNote(noteId);
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }
    } catch (error: unknown) {
      console.error('Failed to delete note:', error);
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 401) {
        logout();
        setIsLoggedIn(false);
        loadLocalNotes();
      }
    }
  };

  const handleCreateNewNote = () => {
    navigate('/note/new');
  };

  const handleNoteClick = (noteId: string) => {
    navigate(`/note/${noteId}`);
  };

  const handleAuthSubmit = async (data: { email: string; password: string; name?: string }) => {
    setIsAuthLoading(true);
    setAuthError('');
    
    try {
      let response;
      if (isAuthMode === 'login') {
        response = await login({ email: data.email, password: data.password });
      } else {
        response = await register({ email: data.email, password: data.password, name: data.name || '' });
      }
      
      setToken(response.token);
      setIsLoggedIn(true);
      setShowAuthDialog(false);
      
      // Convert local notes to permanent notes
      const localNotes = getLocalNotes();
      if (localNotes.length > 0) {
        try {
          await convertLocalNotes(localNotes);
          clearLocalNotes();
        } catch (error) {
          console.error('Failed to convert local notes:', error);
        }
      }
      
      // Fetch permanent notes
      fetchNotes();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data) {
        setAuthError(String(error.response.data.error));
      } else {
        setAuthError('Authentication failed');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setNotes([]);
    loadLocalNotes();
  };

  const handleSignInClick = () => {
    setShowAuthDialog(true);
    setIsAuthMode('login');
  };

  // Use the custom hook for filtering and searching
  const { filteredNotes, stats } = useNoteFilters(notes, searchQuery, filterOptions);

  return (
    <div className="min-h-screen bg-white text-black font-inter">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowAuthDialog={setShowAuthDialog}
        setIsAuthMode={setIsAuthMode}
        onLogout={handleLogout}
      />

      <div className="flex">
        <Sidebar createNewNote={handleCreateNewNote} />

        <main className="flex-1 p-8">
          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold mb-2">Your Notes</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  {isLoading ? 'Loading...' : `${stats.filteredCount} of ${stats.totalNotes} notes`}
                </span>
                {!isLoggedIn && stats.localNotes > 0 && (
                  <span className="text-amber-600">({stats.localNotes} saved locally)</span>
                )}
                {stats.hasFilters && (
                  <span className="text-blue-600">(filtered)</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FilterMenu 
                filterOptions={filterOptions}
                onFilterChange={setFilterOptions}
              />
              <Tip isLoggedIn={isLoggedIn} onSignInClick={handleSignInClick} />
            </div>
          </div>

          <NotesList
            notes={filteredNotes}
            viewMode={viewMode}
            searchQuery={searchQuery}
            onDeleteNote={handleDeleteNote}
            onNoteClick={handleNoteClick}
            isLoading={isLoading}
          />
        </main>
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        isAuthMode={isAuthMode}
        setIsAuthMode={setIsAuthMode}
        onSubmit={handleAuthSubmit}
        isLoading={isAuthLoading}
        error={authError}
      />
    </div>
  );
};

export default Home;