import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { uiPreviewsActions, uiPreviewsStore, isGeneratingUIPreviewsStore } from '~/lib/stores/uiPreviewFlow';
import { UIPreviewCard } from './UIPreviewCard';
import { ApiKeyModal } from './ApiKeyModal';

interface UIPreviewGalleryProps {
  onContinue?: () => void;
}

export const UIPreviewGallery: React.FC<UIPreviewGalleryProps> = ({ onContinue }) => {
  const [prompt, setPrompt] = useState('');
  const previews = useStore(uiPreviewsStore);
  const isGenerating = useStore(isGeneratingUIPreviewsStore);
  const previewsArray = Object.values(previews);
  const hasSelectedPreview = previewsArray.some(preview => preview.selected);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check for existing API key on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    setHasApiKey(!!storedApiKey);
  }, []);

  const handleGenerateClick = async () => {
    if (!prompt.trim()) return;

    try {
      uiPreviewsActions.setGenerating(true);
      setApiKeyError(null);

      // Get the API key from localStorage
      const apiKey = localStorage.getItem('openai_api_key');

      if (!apiKey) {
        setApiKeyError('OpenAI API key is required. Please set your API key in the settings.');
        throw new Error('OpenAI API key is required');
      }

      const response = await fetch('/api/generate-image-previews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          provider: 'OpenAI',
          model: 'gpt-image-1',
          apiKey
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setApiKeyError(errorData.error || 'Failed to generate previews');
        throw new Error(errorData.error || 'Failed to generate previews');
      }

      const data = await response.json();

      if (data.success && data.previews) {
        // Clear existing previews and add new ones
        uiPreviewsActions.clearPreviews();
        uiPreviewsActions.addPreviews(data.previews);
      }
    } catch (error) {
      console.error('Error generating previews:', error);
    } finally {
      uiPreviewsActions.setGenerating(false);
    }
  };

  const handleSelectPreview = (id: string) => {
    uiPreviewsActions.selectPreview(id);
  };

  const handleContinue = () => {
    if (onContinue && hasSelectedPreview) {
      onContinue();
    }
  };

  const handleSetApiKey = (apiKey: string) => {
    localStorage.setItem('openai_api_key', apiKey);
    setApiKeyError(null);
    setHasApiKey(true);
    setIsApiKeyModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-bolt-elements-borderColor">
        <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-4">
          Generate UI Previews
        </h2>
        <p className="text-bolt-elements-textSecondary mb-6">
          Describe what you want to build and we'll generate visual UI previews using AI.
        </p>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Describe what you want to build (e.g., 'A todo list app with a modern design')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full"
            disabled={isGenerating}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateClick}
              disabled={!prompt.trim() || isGenerating}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="i-ph:circle-notch animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <div className="i-ph:image mr-2" />
                  Generate UI Previews
                </>
              )}
            </Button>
            <Button
              onClick={() => setIsApiKeyModalOpen(true)}
              variant="outline"
              className={hasApiKey ? 'bg-green-500/10 text-green-500' : ''}
            >
              <div className="i-ph:key mr-2" />
              {hasApiKey ? 'API Key Set ✓' : 'Set API Key'}
            </Button>
          </div>
          {apiKeyError && (
            <div className="text-red-500 text-sm mt-2">
              {apiKeyError}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin i-ph:circle-notch w-12 h-12 text-blue-500 mb-4" />
            <p className="text-bolt-elements-textSecondary text-lg">Generating UI previews...</p>
            <p className="text-bolt-elements-textTertiary mt-2">This may take a moment</p>
          </div>
        ) : previewsArray.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewsArray.map((preview) => (
              <UIPreviewCard
                key={preview.id}
                preview={preview}
                onSelect={handleSelectPreview}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="i-ph:image-square w-16 h-16 text-bolt-elements-textSecondary mb-4" />
            <h3 className="text-xl font-medium text-bolt-elements-textPrimary mb-2">
              No UI previews generated yet
            </h3>
            <p className="text-bolt-elements-textSecondary max-w-md">
              Enter a description of what you want to build and click "Generate UI Previews" to create visual designs.
            </p>
          </div>
        )}
      </div>

      {previewsArray.length > 0 && (
        <div className="p-6 border-t border-bolt-elements-borderColor flex justify-between">
          <Button
            variant="secondary"
            onClick={() => uiPreviewsActions.clearPreviews()}
            disabled={isGenerating}
          >
            Clear All
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!hasSelectedPreview || isGenerating}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Continue with Selected Design
          </Button>
        </div>
      )}

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSetApiKey}
      />
    </div>
  );
};
