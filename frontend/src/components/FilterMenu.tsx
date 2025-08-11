import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, Clock, Star, ArrowUpDown } from 'lucide-react';

export interface FilterOptions {
  sortBy: 'createdAt' | 'title' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  showFavorites: boolean;
  showRecent: boolean;
  timeRange: 'all' | 'today' | 'week' | 'month';
}

interface FilterMenuProps {
  filterOptions: FilterOptions;
  onFilterChange: (options: FilterOptions) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ filterOptions, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFilterChange({ ...filterOptions, sortBy });
  };

  const handleSortOrderChange = (sortOrder: 'asc' | 'desc') => {
    onFilterChange({ ...filterOptions, sortOrder });
  };

  const handleTimeRangeChange = (timeRange: FilterOptions['timeRange']) => {
    onFilterChange({ ...filterOptions, timeRange });
  };

  const toggleFavorites = () => {
    onFilterChange({ ...filterOptions, showFavorites: !filterOptions.showFavorites });
  };

  const toggleRecent = () => {
    onFilterChange({ ...filterOptions, showRecent: !filterOptions.showRecent });
  };

  const resetFilters = () => {
    onFilterChange({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      showFavorites: false,
      showRecent: false,
      timeRange: 'all'
    });
  };

  const getSortLabel = () => {
    const sortLabels = {
      createdAt: 'Date',
      title: 'Title',
      updatedAt: 'Last Modified'
    };
    return sortLabels[filterOptions.sortBy];
  };

  const getTimeRangeLabel = () => {
    const timeLabels = {
      all: 'All Time',
      today: 'Today',
      week: 'This Week',
      month: 'This Month'
    };
    return timeLabels[filterOptions.timeRange];
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-auto px-3 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {filterOptions.showFavorites || filterOptions.showRecent || filterOptions.timeRange !== 'all' ? (
            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 p-2">
        {/* Sort Options */}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Sort By</p>
          <div className="space-y-1">
            {(['createdAt', 'title', 'updatedAt'] as const).map((sortBy) => (
              <DropdownMenuItem
                key={sortBy}
                onClick={() => handleSortChange(sortBy)}
                className={`flex items-center justify-between cursor-pointer ${
                  filterOptions.sortBy === sortBy ? 'bg-gray-100' : ''
                }`}
              >
                <span>{sortLabels[sortBy]}</span>
                {filterOptions.sortBy === sortBy && (
                  <ArrowUpDown className="h-3 w-3 text-blue-600" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Sort Order */}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Order</p>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={filterOptions.sortOrder === 'asc' ? 'default' : 'outline'}
              onClick={() => handleSortOrderChange('asc')}
              className="flex-1 h-8 text-xs"
            >
              Ascending
            </Button>
            <Button
              size="sm"
              variant={filterOptions.sortOrder === 'desc' ? 'default' : 'outline'}
              onClick={() => handleSortOrderChange('desc')}
              className="flex-1 h-8 text-xs"
            >
              Descending
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Time Range */}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Time Range</p>
          <div className="space-y-1">
            {(['all', 'today', 'week', 'month'] as const).map((timeRange) => (
              <DropdownMenuItem
                key={timeRange}
                onClick={() => handleTimeRangeChange(timeRange)}
                className={`flex items-center cursor-pointer ${
                  filterOptions.timeRange === timeRange ? 'bg-gray-100' : ''
                }`}
              >
                <Clock className="h-3 w-3 mr-2 text-gray-400" />
                {timeLabels[timeRange]}
              </DropdownMenuItem>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Quick Filters */}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Quick Filters</p>
          <div className="space-y-1">
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
            
            <DropdownMenuItem
              onClick={toggleRecent}
              className={`flex items-center cursor-pointer ${
                filterOptions.showRecent ? 'bg-gray-100' : ''
              }`}
            >
              <Clock className="h-3 w-3 mr-2 text-gray-400" />
              Recent
            </DropdownMenuItem>
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

const sortLabels = {
  createdAt: 'Date',
  title: 'Title',
  updatedAt: 'Last Modified'
};

const timeLabels = {
  all: 'All Time',
  today: 'Today',
  week: 'This Week',
  month: 'This Month'
};

export default FilterMenu;
