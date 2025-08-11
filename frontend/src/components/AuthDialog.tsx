import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthMode: 'login' | 'register';
  setIsAuthMode: (mode: 'login' | 'register') => void;
  onSubmit: (data: { email: string; password: string; name?: string }) => Promise<void>;
  isLoading: boolean;
  error: string;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = isAuthMode === 'register' 
      ? { email: formData.email, password: formData.password, name: formData.name }
      : { email: formData.email, password: formData.password };
    
    await onSubmit(submitData);
  };

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth
    console.log('Google auth clicked');
  };

  const switchMode = () => {
    const newMode = isAuthMode === 'login' ? 'register' : 'login';
    setIsAuthMode(newMode);
    setFormData({ email: '', password: '', name: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-black">
            {isAuthMode === 'login' ? 'Welcome back' : 'Create your account'}
          </DialogTitle>
          <p className="text-gray-500 mt-2">
            {isAuthMode === 'login' 
              ? 'Sign in to access your notes' 
              : 'Get started with your note-taking journey'
            }
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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
          <div className="space-y-3">
            {isAuthMode === 'register' && (
              <Input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-12 border-gray-200 focus:border-black focus:ring-black transition-colors"
                required={isAuthMode === 'register'}
              />
            )}
            
            <Input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="h-12 border-gray-200 focus:border-black focus:ring-black transition-colors"
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="h-12 border-gray-200 focus:border-black focus:ring-black transition-colors"
              required
            />
          </div>
          
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isAuthMode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isAuthMode === 'login' ? 'Sign in' : 'Create account'
            )}
          </Button>
          
          {/* Switch Mode */}
          <p className="text-center text-sm text-gray-500">
            {isAuthMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-black hover:underline transition-colors"
            >
              {isAuthMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
