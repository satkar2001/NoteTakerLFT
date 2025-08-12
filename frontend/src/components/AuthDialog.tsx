import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { getGoogleAuthUrl } from '@/lib/authService';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthMode: 'login' | 'register';
  setIsAuthMode: (mode: 'login' | 'register') => void;
  onSubmit: (data: { email: string; password: string; name?: string }) => Promise<void>;
  isLoading: boolean;
  error: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onOpenChange,
  isAuthMode,
  setIsAuthMode,
  onSubmit,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Name validation for register mode
    if (isAuthMode === 'register' && !formData.name.trim()) {
      errors.name = 'Name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = isAuthMode === 'register' 
      ? { email: formData.email, password: formData.password, name: formData.name }
      : { email: formData.email, password: formData.password };
    
    await onSubmit(submitData);
  };

  const handleGoogleAuth = async () => {
    try {
      // Get Google auth URL
      const { url } = await getGoogleAuthUrl();
      
      // Open Google auth popup
      const popup = window.open(
        url,
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );
      
      if (!popup) {
        alert('Popup blocked! Please allow popups for this site.');
        return;
      }
      
      // Listen for auth completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Handle popup closed without auth
        }
      }, 1000);
      
      // Listen for message from popup
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          popup?.close();
          
          // Handle successful Google auth
          // You can implement this based on your needs
        }
      };
      
      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const clearErrors = () => {
    setValidationErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isAuthMode === 'login' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {isAuthMode === 'login' 
              ? 'Welcome back! Sign in to your account to continue.'
              : 'Create a new account to get started with your notes.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
          
          {/* Divider */}
          <div className="relative">
            <Separator className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </Separator>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-medium">Or continue with email</span>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isAuthMode === 'register' && (
              <div>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    if (validationErrors.name) clearErrors();
                  }}
                  className={`h-12 border-gray-200 focus:border-black focus:ring-black transition-colors ${
                    validationErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  required={isAuthMode === 'register'}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  if (validationErrors.email) clearErrors();
                }}
                className={`h-12 border-gray-200 focus:border-black focus:ring-black transition-colors ${
                  validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                  if (validationErrors.password) clearErrors();
                }}
                className={`h-12 border-gray-200 focus:border-black focus:ring-black transition-colors ${
                  validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isAuthMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isAuthMode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>
          
          {/* Toggle Mode */}
          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isAuthMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login');
                setFormData({ email: '', password: '', name: '' });
                setValidationErrors({});
              }}
              className="text-black font-medium hover:underline"
            >
              {isAuthMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
