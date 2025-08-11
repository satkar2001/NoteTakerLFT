import React from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Note, LocalNote } from '@/types';

type AnyNote = Note | LocalNote;

interface NoteCardProps {
  note: AnyNote;
  viewMode: 'grid' | 'list';
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  viewMode,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onDelete,
  onClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 border-0 shadow-md bg-white ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <CardContent
        className={`p-6 ${
          viewMode === 'list' ? 'flex-1 flex items-center space-x-4' : ''
        }`}
      >
        <div className={viewMode === 'list' ? 'flex-1' : ''}>
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg line-clamp-1 flex-1">
              {note.title || 'Untitled'}
            </h3>

            {/* Delete button - show on hover */}
            <div
              className={`flex items-center space-x-1 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p
            className={`text-gray-600 text-sm leading-relaxed mb-4 ${
              viewMode === 'list' ? 'line-clamp-1' : 'line-clamp-3'
            }`}
          >
            {note.content || 'Start writing...'}
          </p>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{formatDate(note.createdAt)}</span>
            {'isLocal' in note && note.isLocal && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                Local
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
