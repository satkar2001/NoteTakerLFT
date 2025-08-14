import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  createNewNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ createNewNote }) => {
  return (
    <aside className="w-full lg:w-16 lg:mt-4 lg:border-r lg:border-gray-100 bg-gray-50/30 p-4 lg:p-4 flex lg:flex-col items-center justify-center lg:justify-start space-y-0 lg:space-y-4 space-x-4 lg:space-x-0">
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