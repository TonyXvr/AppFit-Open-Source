import React from 'react';
import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { imagePreviewsActions, imagePreviewsStore, isGeneratingPreviewsStore } from '~/lib/stores/imageGenPreviews';
import { ImagePreviewCard } from './ImagePreviewCard';

interface ImagePreviewGalleryProps {
  onContinue?: () => void;
}

export const ImagePreviewGallery: React.FC<ImagePreviewGalleryProps> = ({ onContinue }) => {
  // Check if there's a stored design prompt from Flow Map
  const storedPrompt = typeof window !== 'undefined' ? localStorage.getItem('designPromptForImages') : null;
  const [prompt, setPrompt] = React.useState(storedPrompt || '');
  const previews = useStore(imagePreviewsStore);
  const isGenerating = useStore(isGeneratingPreviewsStore);
  const previewsArray = Object.values(previews);
  const hasSelectedPreview = previewsArray.some(preview => preview.selected);

  const handleGenerateClick = async () => {
    if (!prompt.trim()) return;

    try {
      imagePreviewsActions.setGenerating(true);

      // Get the API key from localStorage
      const apiKey = localStorage.getItem('openai_api_key');

      if (!apiKey) {
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
        throw new Error(errorData.error || 'Failed to generate previews');
      }

      const data = await response.json();

      if (data.success && data.previews) {
        // Clear existing previews and add new ones
        imagePreviewsActions.clearPreviews();
        imagePreviewsActions.addPreviews(data.previews);
      }
    } catch (error) {
      console.error('Error generating previews:', error);
      // TODO: Add error handling UI
    } finally {
      imagePreviewsActions.setGenerating(false);
    }
  };

  // Auto-generate previews if we have a stored prompt
  React.useEffect(() => {
    const autoGenerate = async () => {
      if (storedPrompt && !isGenerating && Object.keys(previews).length === 0) {
        // Clear the stored prompt to avoid regenerating on refresh
        if (typeof window !== 'undefined') {
          localStorage.removeItem('designPromptForImages');
        }

        // Generate previews automatically
        if (prompt.trim()) {
          await handleGenerateClick();
        }
      }
    };

    autoGenerate();
  }, [isGenerating, previews, prompt]);

  const handleSelectPreview = (id: string) => {
    imagePreviewsActions.selectPreview(id);
  };

  const handleContinue = () => {
    if (onContinue && hasSelectedPreview) {
      onContinue();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-bolt-elements-borderColor">
        <h2 className="text-lg font-medium text-bolt-elements-textPrimary mb-4">
          Generate Design Previews
        </h2>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Describe what you want to build (e.g., 'A todo list app with a modern design')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerateClick}
            disabled={!prompt.trim() || isGenerating}
            variant="default"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin i-ph:circle-notch w-8 h-8 text-purple-500 mb-4" />
            <p className="text-bolt-elements-textSecondary">Generating design previews...</p>
          </div>
        ) : previewsArray.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {previewsArray.map((preview) => (
              <ImagePreviewCard
                key={preview.id}
                preview={preview}
                onSelect={handleSelectPreview}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="i-ph:image-square w-12 h-12 text-bolt-elements-textSecondary mb-4" />
            <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">
              No previews generated yet
            </h3>
            <p className="text-bolt-elements-textSecondary max-w-md">
              Enter a description of what you want to build and click "Generate" to create design previews.
            </p>
          </div>
        )}
      </div>

      {previewsArray.length > 0 && (
        <div className="p-4 border-t border-bolt-elements-borderColor flex justify-between">
          <Button
            variant="secondary"
            onClick={() => imagePreviewsActions.clearPreviews()}
            disabled={isGenerating}
          >
            Clear All
          </Button>
          <Button
            variant="default"
            onClick={handleContinue}
            disabled={!hasSelectedPreview || isGenerating}
          >
            Continue with Selected Design
          </Button>
        </div>
      )}
    </div>
  );
};
