import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [, setIsProcessing] = useState(true);
  
  useEffect(() => {
    const success = searchParams.get('success');
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const error = searchParams.get('error');
    
    console.log('Google OAuth Callback - Success:', success);
    console.log('Google OAuth Callback - Token:', token ? 'Present' : 'Missing');
    console.log('Google OAuth Callback - User:', user ? 'Present' : 'Missing');
    console.log('Google OAuth Callback - Error:', error);
    console.log('Google OAuth Callback - All params:', Object.fromEntries(searchParams.entries()));
    
    if (error) {
      setError(`Google OAuth error: ${error}`);
      setIsProcessing(false);
      return;
    }
    
    if (success === 'true' && token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        
        // Store the token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          name: userData.name || '',
          email: userData.email
        }));
        
        // Send success message to parent window (popup approach)
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_SUCCESS',
            token,
            user: userData
          }, window.location.origin);
          
          // Close popup
          window.close();
        } else {
          // Fallback if not in popup - redirect to home
          window.location.href = '/';
        }
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
        setError('Failed to process authentication data');
        setIsProcessing(false);
      }
    } else {
      setError('Invalid authentication response from server');
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
