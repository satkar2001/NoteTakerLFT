import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, Clock, Type } from 'lucide-react';

export interface SortOptions {
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

interface SortButtonProps {
  sortOptions: SortOptions;
  onSortChange: (options: SortOptions) => void;
}

const SortButton: React.FC<SortButtonProps> = ({ sortOptions, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortByChange = (sortBy: SortOptions['sortBy']) => {
    onSortChange({ ...sortOptions, sortBy });
  };

  const handleSortOrderChange = (sortOrder: SortOptions['sortOrder']) => {
    onSortChange({ ...sortOptions, sortOrder });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 sm:h-10 w-auto px-2 sm:px-3 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
        >
          <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Sort</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 p-2 bg-white border border-gray-200 shadow-lg">
        {/* Sort By Options */}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Sort By</p>
          <DropdownMenuItem
            onClick={() => handleSortByChange('createdAt')}
            className={`flex items-center cursor-pointer ${
              sortOptions.sortBy === 'createdAt' ? 'bg-gray-100' : ''
            }`}
          >
            <Calendar className="h-3 w-3 mr-2" />
            Date Created
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => handleSortByChange('updatedAt')}
            className={`flex items-center cursor-pointer ${
              sortOptions.sortBy === 'updatedAt' ? 'bg-gray-100' : ''
            }`}
          >
            <Clock className="h-3 w-3 mr-2" />
            Last Modified
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => handleSortByChange('title')}
            className={`flex items-center cursor-pointer ${
              sortOptions.sortBy === 'title' ? 'bg-gray-100' : ''
            }`}
          >
            <Type className="h-3 w-3 mr-2" />
            Title
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* Sort Order Options */}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Order</p>
          <DropdownMenuItem
            onClick={() => handleSortOrderChange('asc')}
            className={`flex items-center cursor-pointer ${
              sortOptions.sortOrder === 'asc' ? 'bg-gray-100' : ''
            }`}
          >
            <ArrowUp className="h-3 w-3 mr-2" />
            Ascending
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => handleSortOrderChange('desc')}
            className={`flex items-center cursor-pointer ${
              sortOptions.sortOrder === 'desc' ? 'bg-gray-100' : ''
            }`}
          >
            <ArrowDown className="h-3 w-3 mr-2" />
            Descending
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortButton;
