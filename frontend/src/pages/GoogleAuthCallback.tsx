import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { googleAuth } from '@/lib/authService';

const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
      handleGoogleAuth(code);
    } else {
      setError('No authorization code received from Google');
      setIsProcessing(false);
    }
  }, [searchParams]);
  
  const handleGoogleAuth = async (code: string) => {
    try {
      const response = await googleAuth(code);
      
      // Store the token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        name: response.user.name || '',
        email: response.user.email
      }));
      
      // Redirect to home page
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Google authentication failed:', error);
      setError(error.response?.data?.error || 'Google authentication failed');
      setIsProcessing(false);
    }
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Authentication Failed</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/', { replace: true })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
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
