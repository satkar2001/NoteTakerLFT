import React from 'react';
import { Trash2, Heart } from 'lucide-react';
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
  onToggleFavorite: () => void;
  onClick: () => void;
  isFavorite?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  viewMode,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onDelete,
  onToggleFavorite,
  onClick,
  isFavorite = note.isFavorite || false,
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

  if (viewMode === 'list') {
    return (
      <Card
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 border-0 shadow-md bg-white hover:bg-gray-50"
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <h3 className="font-semibold text-base sm:text-lg lg:text-xl line-clamp-1 flex-1 mr-3 sm:mr-4">
                  {note.title || 'Untitled'}
                </h3>
                
                {/* Action buttons - show on hover */}
                <div
                  className={`flex items-center space-x-1 transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 sm:h-8 sm:w-8 p-0 transition-colors ${
                      isFavorite 
                        ? 'text-red-500 hover:bg-red-50' 
                        : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite();
                    }}
                  >
                    <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                {note.content || 'Start writing...'}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 sm:gap-3 ml-0 sm:ml-auto">
                  {/* Local indicator */}
                  {'isLocal' in note && note.isLocal && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      Local
                    </span>
                  )}
                  
                  <span className="text-xs sm:text-sm text-gray-400">{formatDate(note.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 border-0 shadow-md bg-white hover:bg-gray-50"
    >
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div>
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg line-clamp-1 flex-1">
              {note.title || 'Untitled'}
            </h3>

            {/* Action buttons - show on hover */}
            <div
              className={`flex items-center space-x-1 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 sm:h-8 sm:w-8 p-0 transition-colors ${
                  isFavorite 
                    ? 'text-red-500 hover:bg-red-50' 
                    : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
            {note.content || 'Start writing...'}
          </p>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <span className="text-xs text-gray-400">{formatDate(note.createdAt)}</span>
            {'isLocal' in note && note.isLocal && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full self-start sm:self-auto">
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
