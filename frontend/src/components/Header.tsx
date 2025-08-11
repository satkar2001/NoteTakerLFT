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
import { Search, User, Settings, LogOut, Grid3X3, List } from 'lucide-react';
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
  setIsLoggedIn: (loggedIn: boolean) => void;
  setShowAuthDialog: (show: boolean) => void;
  setIsAuthMode: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  isLoggedIn,
  setIsLoggedIn,
  setShowAuthDialog,
  setIsAuthMode,
  onLogout,
}) => {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
      <div className="flex items-center space-x-8">
        <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64 border-0 bg-gray-50 focus:bg-gray-100 transition-colors"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white shadow-sm">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-105">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {isLoggedIn ? (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
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