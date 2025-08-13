// export function Tip() {
//   return (
//     <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg">
//       <strong>Tip:</strong> Sign in to save your notes permanently
//     </div>
//   );
// }


// components/Tip.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface TipProps {
  isLoggedIn: boolean;
  onSignInClick?: () => void;
}

const Tip: React.FC<TipProps> = ({ isLoggedIn, onSignInClick }) => {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <span className="text-sm text-blue-700 font-medium">
          Your notes are safely synced! 
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
      <div className="flex-1">
        <p className="text-sm text-amber-700 font-medium">
          Sign in to save your notes permanently
        </p>
        <p className="text-xs text-amber-600">
          Your notes are currently saved locally
        </p>
      </div>
      <Button
        size="sm"
        onClick={onSignInClick}
        className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 px-3"
      >
        Sign In
      </Button>
    </div>
  );
};

export default Tip;