import React, { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { authActions } from '~/lib/stores/auth';
import { toast } from 'react-toastify';

export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error, user } = await authActions.signUp(email, password);
      
      if (success) {
        if (user?.identities?.length === 0) {
          // User already exists
          toast.error('An account with this email already exists');
        } else {
          toast.success('Account created! Please check your email to confirm your registration.');
          navigate('/login');
        }
      } else {
        toast.error(error?.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-bolt-elements-background-depth-1 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-6 text-center">
        Create an account
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            className="w-full"
          />
        </div>
        
        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-bolt-elements-textSecondary">
          Already have an account?{' '}
          <a href="/login" className="text-purple-500 hover:text-purple-600">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};
