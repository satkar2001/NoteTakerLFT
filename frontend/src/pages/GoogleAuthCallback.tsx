import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [, setIsProcessing] = useState(true);
  
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    console.log('Google OAuth Callback - Code:', code);
    console.log('Google OAuth Callback - Error:', error);
    console.log('Google OAuth Callback - All params:', Object.fromEntries(searchParams.entries()));
    
    if (error) {
      setError(`Google OAuth error: ${error}`);
      setIsProcessing(false);
      return;
    }
    
    if (code) {
      // Send message to parent window (popup approach)
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_SUCCESS',
          code
        }, window.location.origin);
        
        // Close popup
        window.close();
      } else {
        // Fallback if not in popup - redirect to home with code
        window.location.href = `/?google_auth_code=${encodeURIComponent(code)}`;
      }
    } else {
      setError('No authorization code received from Google');
      setIsProcessing(false);
    }
  }, [searchParams]);
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Authentication Failed</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.close()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
