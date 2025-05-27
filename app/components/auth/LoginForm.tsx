import React, { useState } from 'react';
import { useNavigate, useSearchParams } from '@remix-run/react';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { authActions } from '~/lib/stores/auth';
import { toast } from 'react-toastify';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await authActions.signIn(email, password);
      
      if (success) {
        toast.success('Logged in successfully');
        navigate(returnTo);
      } else {
        toast.error(error?.message || 'Failed to log in');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-bolt-elements-background-depth-1 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-6 text-center">
        Log in to your account
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
            placeholder="Enter your password"
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
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-bolt-elements-textSecondary">
          Don't have an account?{' '}
          <a href="/signup" className="text-purple-500 hover:text-purple-600">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};
