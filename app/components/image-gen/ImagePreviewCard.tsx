import React from 'react';
import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';
import type { ImagePreview } from '~/lib/stores/imageGenPreviews';

interface ImagePreviewCardProps {
  preview: ImagePreview;
  onSelect: (id: string) => void;
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({ preview, onSelect }) => {
  const handleSelect = () => {
    onSelect(preview.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={classNames(
        'relative rounded-lg overflow-hidden border-2 transition-all duration-200',
        preview.selected
          ? 'border-purple-500 shadow-lg shadow-purple-500/20'
          : 'border-bolt-elements-borderColor hover:border-purple-500/50'
      )}
    >
      <div className="aspect-video bg-bolt-elements-background-depth-3 relative">
        <img
          src={preview.imageUrl}
          alt={`UI preview for ${preview.prompt}`}
          className="w-full h-full object-cover"
        />

        {/* Selection overlay */}
        {preview.selected && (
          <div className="absolute inset-0 bg-purple-500/10 flex items-center justify-center">
            <div className="bg-purple-500 text-white rounded-full p-2">
              <div className="i-ph:check-bold w-6 h-6" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-bolt-elements-background-depth-1">
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleSelect}
            className={classNames(
              'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
              preview.selected
                ? 'bg-purple-500 text-white'
                : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary hover:bg-purple-500/10 hover:text-purple-500'
            )}
          >
            {preview.selected ? 'Selected' : 'Select This Design'}
          </button>
          <button
            onClick={() => {
              // Copy image URL to clipboard
              navigator.clipboard.writeText(preview.imageUrl);

              // Show a temporary tooltip or notification
              const tooltip = document.createElement('div');
              tooltip.textContent = 'Image URL copied!';
              tooltip.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50';
              document.body.appendChild(tooltip);

              // Remove the tooltip after 2 seconds
              setTimeout(() => {
                document.body.removeChild(tooltip);
              }, 2000);
            }}
            className="p-2 rounded-md bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary hover:bg-purple-500/10 hover:text-purple-500 transition-colors"
            title="Copy Image URL"
          >
            <div className="i-ph:copy w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
