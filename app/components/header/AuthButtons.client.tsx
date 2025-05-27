import React from 'react';
import { useStore } from '@nanostores/react';
import { Form, useNavigate } from '@remix-run/react';
import { authStore, authActions } from '~/lib/stores/auth';
import { Button } from '~/components/ui/Button';
import { toast } from 'react-toastify';

export function AuthButtons() {
  const { user, isLoading, messageCount, maxMessagesPerDay } = useStore(authStore);
  const navigate = useNavigate();
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      const { success } = await authActions.signOut();
      
      if (success) {
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };
  
  if (isLoading) {
    return null;
  }
  
  if (user) {
    return (
      <div className="flex items-center gap-4">
        {/* Message counter */}
        <div className="text-sm text-bolt-elements-textSecondary">
          <span className="font-medium">{maxMessagesPerDay - messageCount}</span> messages left today
        </div>
        
        {/* User email/name */}
        <div className="text-sm text-bolt-elements-textPrimary hidden md:block">
          {user.email}
        </div>
        
        {/* Logout button */}
        <Form action="/logout" method="post">
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="text-sm"
          >
            Log out
          </Button>
        </Form>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate('/login')}
        className="text-sm"
      >
        Log in
      </Button>
      
      <Button
        variant="default"
        size="sm"
        onClick={() => navigate('/signup')}
        className="text-sm"
      >
        Sign up
      </Button>
    </div>
  );
}
