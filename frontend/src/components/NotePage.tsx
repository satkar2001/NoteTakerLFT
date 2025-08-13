import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { getNoteById, createNote, updateNote, deleteNote } from '@/lib/noteService';
import { saveLocalNote, updateLocalNote, deleteLocalNote, getLocalNoteById } from '@/lib/localStorageService';
import { isAuthenticated } from '@/lib/authService';
import type { Note, LocalNote } from '@/types';

interface NotePageProps {
  isNewNote?: boolean;
}

const NotePage: React.FC<NotePageProps> = ({ isNewNote = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [note, setNote] = useState<Partial<Note | LocalNote>>({
    title: '',
    content: '',
    tags: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [isLocalNote, setIsLocalNote] = useState(false);

  useEffect(() => {
    if (!isNewNote && id) {
      loadNote();
    }
  }, [id, isNewNote]);

  const loadNote = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      if (id.startsWith('local_')) {
        const localNote = getLocalNoteById(id);
        if (localNote) {
          setNote(localNote);
          setTagsInput(localNote.tags.join(', '));
          setIsLocalNote(true);
          setIsLoading(false);
          return;
        }
      }

      if (isAuthenticated()) {
        const loadedNote = await getNoteById(id);
        setNote(loadedNote);
        setTagsInput(loadedNote.tags.join(', '));
        setIsLocalNote(false);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to load note:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note.title?.trim() && !note.content?.trim()) {
      return; 
    }

    setIsSaving(true);
    try {
      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      if (isNewNote) {
        if (isAuthenticated()) {
          await createNote({
            title: note.title || 'Untitled',
            content: note.content || '',
            tags
          });
        } else {
          saveLocalNote({
            title: note.title || 'Untitled',
            content: note.content || '',
            tags
          });
        }
      } else if (id) {
        if (isLocalNote) {
          updateLocalNote(id, {
            title: note.title || 'Untitled',
            content: note.content || '',
            tags
          });
        } else if (isAuthenticated()) {
          await updateNote(id, {
            title: note.title || 'Untitled',
            content: note.content || '',
            tags
          });
        }
      }
      
      navigate('/');
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNewNote) return;
    
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        if (isLocalNote) {
          deleteLocalNote(id);
        } else if (isAuthenticated()) {
          await deleteNote(id);
        }
        navigate('/');
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
          
          <div className="flex items-center gap-2">
            {!isNewNote && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Note title..."
              value={note.title || ''}
              onChange={(e) => setNote(prev => ({ ...prev, title: e.target.value }))}
              className="text-3xl font-semibold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2"
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Tags (comma separated)..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="border-gray-200"
            />
          </div>

          <div className="flex-1">
            <Textarea
              placeholder="Start writing your note..."
              value={note.content || ''}
              onChange={(e) => setNote(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[500px] text-lg leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2 resize-none"
            />
          </div>

          {!isAuthenticated() && (
            <div className="text-center py-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 text-sm">
                💡 This note is saved locally. <button onClick={() => navigate('/')} className="underline font-medium">Sign in</button> to save it permanently!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotePage;
