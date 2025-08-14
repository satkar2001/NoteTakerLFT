// import { Grid, List, User } from "lucide-react";

// export function Header() {
//   return (
//     <header className="flex justify-between items-center px-6 py-4 border-b">
//       <h1 className="text-2xl font-bold">Notes</h1>
//       <div className="flex items-center gap-3">
//         <button className="p-2 rounded-lg bg-black text-white">
//           <Grid className="w-5 h-5" />
//         </button>
//         <button className="p-2 rounded-lg border">
//           <List className="w-5 h-5" />
//         </button>
//         <button className="p-2 rounded-lg border">
//           <User className="w-5 h-5" />
//         </button>
//       </div>
//     </header>
//   );
// }


// components/Header.tsx
import React from 'react';
import { Search, User, LogOut, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  isLoggedIn: boolean;
  user?: { name: string; email: string } | null;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setShowAuthDialog: (show: boolean) => void;
  setIsAuthMode: (mode: 'login' | 'register' | 'forgot-password' | 'reset-password') => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  isLoggedIn,
  user,
  setShowAuthDialog,
  setIsAuthMode,
  onLogout,
}) => {
  return (
    <nav className="flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 border-b border-gray-100">
      <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-8">
        <h1 className="text-base sm:text-lg lg:text-2xl font-semibold tracking-tight text-gray-900">Note Taker LFT</h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
        {/* Search - Desktop */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-48 lg:w-64 border-0 bg-gray-50 focus:bg-gray-100 transition-colors"
          />
        </div>
        
        {/* Search - Mobile */}
        <div className="relative md:hidden">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-28 sm:w-32 border-0 bg-gray-50 focus:bg-gray-100 transition-colors text-sm"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white shadow-sm">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <List className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-105">
              <User className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
            {isLoggedIn && user ? (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => { setShowAuthDialog(true); setIsAuthMode('login'); }}>
                  Sign in
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setShowAuthDialog(true); setIsAuthMode('register'); }}>
                  Create account
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Header;