import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  createNewNote: () => void;
  isLoggedIn?: boolean;
  onSignInClick?: () => void;
  onCreateNewNote?: () => void;
  stats?: any;
}

const Sidebar: React.FC<SidebarProps> = ({ createNewNote }) => {
  return (
    <aside className="w-full lg:w-16 lg:mt-4 lg:border-r lg:border-gray-100 bg-gray-50/30 p-4 lg:p-4 flex lg:flex-col items-center justify-center lg:justify-start space-y-0 lg:space-y-4 space-x-4 lg:space-x-0">
      <Button
        onClick={createNewNote}
        size="sm"
        className="w-full lg:w-10 h-12 lg:h-10 rounded-lg lg:rounded-full bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 font-medium lg:font-normal"
      >
        <Plus className="h-5 w-5 mr-2 lg:mr-0" />
        <span className="lg:hidden">Create New Note</span>
      </Button>
    </aside>
  );
};

export default Sidebar;