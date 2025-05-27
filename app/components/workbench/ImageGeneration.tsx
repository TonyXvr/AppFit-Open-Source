import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { ImagePreviewGallery } from '~/components/image-gen/ImagePreviewGallery';
import { imagePreviewsActions, imagePreviewsStore } from '~/lib/stores/imageGenPreviews';
import { workbenchStore } from '~/lib/stores/workbench';

interface ImageGenerationProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

export const ImageGeneration: React.FC<ImageGenerationProps> = ({ chatStarted, isStreaming }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const previews = useStore(imagePreviewsStore);
  const previewsArray = Object.values(previews);
  const hasSelectedPreview = previewsArray.some(preview => preview.selected);

  // Check for OpenAI API key on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    setApiKey(storedApiKey);
  }, []);

  const handleContinue = () => {
    if (hasSelectedPreview) {
      // Get the selected preview
      const selectedPreview = imagePreviewsActions.getSelectedPreview();

      if (selectedPreview) {
        // Store the selected preview in localStorage to be used by the chat
        localStorage.setItem('selectedImagePreview', JSON.stringify(selectedPreview));

        // Add the image to the chat input area
        if (typeof window !== 'undefined') {
          // Create a file from the base64 image
          const fetchImage = async () => {
            try {
              // Convert base64 to blob
              const response = await fetch(selectedPreview.imageUrl);
              const blob = await response.blob();

              // Create a File object
              const file = new File([blob], `design-preview-${Date.now()}.png`, { type: 'image/png' });

              // Store the file and image data in localStorage for the chat component to use
              localStorage.setItem('pendingImageFile', JSON.stringify({
                dataUrl: selectedPreview.imageUrl,
                name: file.name,
                type: file.type,
                size: file.size
              }));

              // Set a flag to indicate there's a pending image to be added to the chat
              localStorage.setItem('addPendingImageToChat', 'true');
            } catch (error) {
              console.error('Error preparing image for chat:', error);
            }
          };

          fetchImage();
        }

        // Navigate back to the chat view
        workbenchStore.setShowWorkbench(false);
      }
    }
  };

  const handleSetApiKey = (key: string) => {
    localStorage.setItem('openai_api_key', key);
    setApiKey(key);
    setIsApiKeyModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-4 bg-bolt-elements-background-depth-2 border-b border-bolt-elements-borderColor flex justify-between items-center">
        <h2 className="text-lg font-medium text-bolt-elements-textPrimary">
          Design Preview Generator
        </h2>
        {!apiKey && (
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="text-sm text-purple-500 hover:text-purple-600 transition-colors"
          >
            Set OpenAI API Key
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {!apiKey ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="i-ph:key w-12 h-12 text-bolt-elements-textSecondary mb-4" />
            <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">
              OpenAI API Key Required
            </h3>
            <p className="text-bolt-elements-textSecondary max-w-md mb-6">
              To generate design previews using OpenAI's gpt-image-1 model, you need to provide your OpenAI API key.
              Your key will be stored locally in your browser.
            </p>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              Set API Key
            </button>
          </div>
        ) : (
          <ImagePreviewGallery onContinue={handleContinue} />
        )}
      </div>

      {isApiKeyModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bolt-elements-background-depth-0 p-6 rounded-lg max-w-md w-full"
          >
            <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-4">
              Set OpenAI API Key
            </h3>
            <p className="text-sm text-bolt-elements-textSecondary mb-4">
              Enter your OpenAI API key to enable gpt-image-1 model image generation.
              Your key will be stored locally in your browser.
            </p>
            <input
              type="password"
              placeholder="sk-..."
              className="w-full p-2 border border-bolt-elements-borderColor rounded-md mb-4 bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary"
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="px-4 py-2 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-1 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSetApiKey(apiKey || '')}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                disabled={!apiKey || apiKey.trim().length < 10}
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
