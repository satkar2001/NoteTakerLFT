import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, Star, Tag } from 'lucide-react';

export interface FilterOptions {
  showFavorites: boolean;
  selectedTags: string[];
}

interface FilterMenuProps {
  filterOptions: FilterOptions;
  onFilterChange: (options: FilterOptions) => void;
  availableTags: string[];
}

const FilterMenu: React.FC<FilterMenuProps> = ({ filterOptions, onFilterChange, availableTags }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFavorites = () => {
    onFilterChange({ ...filterOptions, showFavorites: !filterOptions.showFavorites });
  };

  const toggleTag = (tag: string) => {
    const newSelectedTags = filterOptions.selectedTags.includes(tag)
      ? filterOptions.selectedTags.filter(t => t !== tag)
      : [...filterOptions.selectedTags, tag];

    onFilterChange({ ...filterOptions, selectedTags: newSelectedTags });
  };

  const resetFilters = () => {
    onFilterChange({
      showFavorites: false,
      selectedTags: []
    });
  };

  const hasActiveFilters = filterOptions.showFavorites || filterOptions.selectedTags.length > 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 sm:h-10 w-auto px-3 sm:px-3 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 text-sm"
        >
          <Filter className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 sm:ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 bg-white border border-gray-200 shadow-lg">
        {/* Favorites Filter */}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Quick Filters</p>
          <DropdownMenuItem
            onClick={toggleFavorites}
            className={`flex items-center cursor-pointer ${
              filterOptions.showFavorites ? 'bg-gray-100' : ''
            }`}
          >
            <Star className={`h-3 w-3 mr-2 ${
              filterOptions.showFavorites ? 'text-yellow-500 fill-current' : 'text-gray-400'
            }`} />
            Favorites
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* Tags Filter */}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tags</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {availableTags.length === 0 ? (
              <p className="text-xs text-gray-400 px-2">No tags available</p>
            ) : (
              availableTags.map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`flex items-center cursor-pointer ${
                    filterOptions.selectedTags.includes(tag) ? 'bg-gray-100' : ''
                  }`}
                >
                  <Tag className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="flex-1">{tag}</span>
                  <input
                    type="checkbox"
                    checked={filterOptions.selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="ml-2"
                  />
                </DropdownMenuItem>
              ))
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Reset Button */}
        <div className="px-2 py-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="w-full h-8 text-xs text-gray-600 hover:text-gray-800"
          >
            Reset Filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterMenu;
