import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles } from 'lucide-react';

interface TipProps {
  isLoggedIn: boolean;
  onSignInClick?: () => void;
}

const Tip: React.FC<TipProps> = ({ isLoggedIn, onSignInClick }) => {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0" />
        <span className="text-sm text-blue-700 font-medium">
          Your notes are safely synced! ✨
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 lg:p-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-700 mb-1">
              Sign in to save your notes permanently
            </p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Your notes are currently saved locally and will be lost if you clear your browser data
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onSignInClick}
          className="bg-amber-600 hover:bg-amber-700 text-white text-sm h-9 px-4 self-start sm:self-auto flex-shrink-0"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default Tip;