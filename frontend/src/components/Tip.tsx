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
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-600" />
        <div className="flex-1">
          <p className="text-sm text-amber-700 font-medium">
            Sign in to save your notes permanently
          </p>
          <p className="text-xs text-amber-600">
            Your notes are currently saved locally
          </p>
        </div>
      </div>
      <Button
        size="sm"
        onClick={onSignInClick}
        className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 px-3 self-start sm:self-auto"
      >
        Sign In
      </Button>
    </div>
  );
};

export default Tip;