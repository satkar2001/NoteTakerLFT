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
import ForgotPasswordDialog from './ForgotPasswordDialog';
import ResetPasswordDialog from './ResetPasswordDialog';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthMode: 'login' | 'register' | 'forgot-password' | 'reset-password';
  setIsAuthMode: (mode: 'login' | 'register' | 'forgot-password' | 'reset-password') => void;
  onSubmit: (data: { email: string; password: string; name?: string }) => Promise<void>;
  onForgotPasswordSuccess?: (email: string) => void;
  onResetPasswordSuccess?: () => void;
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
  onForgotPasswordSuccess,
  onResetPasswordSuccess,
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

  const clearErrors = () => {
    setValidationErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-black">
            {isAuthMode === 'login' ? 'Welcome back' : 'Create your account'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {isAuthMode === 'login' 
              ? 'Sign in to access your notes' 
              : 'Get started with your note-taking journey'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          
          {}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          {/* Conditional Content */}
          {isAuthMode === 'forgot-password' ? (
            <ForgotPasswordDialog
              onBack={() => setIsAuthMode('login')}
              onSuccess={(email) => {
                if (onForgotPasswordSuccess) {
                  onForgotPasswordSuccess(email);
                }
              }}
            />
          ) : isAuthMode === 'reset-password' ? (
            <ResetPasswordDialog
              email={formData.email}
              onBack={() => setIsAuthMode('forgot-password')}
              onSuccess={() => {
                if (onResetPasswordSuccess) {
                  onResetPasswordSuccess();
                }
              }}
            />
          ) : (
            <>
              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                   disabled={isLoading}
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
                 disabled={isLoading}
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
                 disabled={isLoading}
               />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>
            
            {/* Forgot Password Link */}
            {isAuthMode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsAuthMode('forgot-password')}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
            )}
            
            {/* Forgot Password Link */}
            {isAuthMode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsAuthMode('forgot-password')}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
            )}
            
            {}
                         <Button
               type="submit"
               disabled={isLoading}
               className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
             >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isAuthMode === 'login' ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isAuthMode === 'login' ? 'Sign in' : 'Create account'
              )}
            </Button>
          </form>
          
          {}
          <div className="text-center text-sm">
            <span className="text-gray-500">
              {isAuthMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
                         <button
               type="button"
               onClick={() => {
                 setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login');
                 setFormData({ email: '', password: '', name: '' });
                 setValidationErrors({});
               }}
               className="font-semibold text-black hover:underline transition-colors"
               disabled={isLoading}
             >
              {isAuthMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
