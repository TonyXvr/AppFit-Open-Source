import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '~/components/ui/Button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bolt-elements-background-depth-0 p-6 rounded-lg max-w-md w-full"
      >
        <h3 className="text-xl font-bold text-bolt-elements-textPrimary mb-4">
          Set OpenAI API Key
        </h3>
        <p className="text-sm text-bolt-elements-textSecondary mb-6">
          Enter your OpenAI API key to enable UI preview generation with the gpt-image-1 model.
          Your key will be stored locally in your browser.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-bolt-elements-textSecondary mb-2">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 border border-bolt-elements-borderColor rounded-md bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!apiKey.trim()}
            >
              Save API Key
            </Button>
          </div>
        </form>
        <div className="mt-6 pt-6 border-t border-bolt-elements-borderColor">
          <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">
            How to get an OpenAI API key:
          </h4>
          <ol className="text-xs text-bolt-elements-textSecondary space-y-2 list-decimal pl-4">
            <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI API Keys</a></li>
            <li>Sign in or create an account</li>
            <li>Click on "Create new secret key"</li>
            <li>Copy the key and paste it here</li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
};
