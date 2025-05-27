import React from 'react';
import BackgroundRays from '~/components/ui/BackgroundRays';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundRays />
      
      <header className="py-6 px-4 flex justify-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-bolt-elements-textPrimary">AppFit</span>
          </a>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {title && (
            <h1 className="text-3xl font-bold text-bolt-elements-textPrimary mb-8 text-center">
              {title}
            </h1>
          )}
          
          {children}
        </div>
      </main>
      
      <footer className="py-6 px-4 text-center">
        <p className="text-sm text-bolt-elements-textSecondary">
          &copy; {new Date().getFullYear()} AppFit. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
