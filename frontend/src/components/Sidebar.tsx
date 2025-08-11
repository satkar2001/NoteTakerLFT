import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  createNewNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ createNewNote }) => {
  return (
    <aside className="w-16 mt-4 border-r border-gray-100 bg-gray-50/30 p-4 flex flex-col items-center space-y-4">
      <Button
        onClick={createNewNote}
        size="sm"
        className="h-10 w-10 rounded-full bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus className="h-5 w-5" />
      </Button>
      
      {/* <div className="w-px h-8 bg-gray-200"></div> */}
      
    </aside>
  );
};

export default Sidebar;