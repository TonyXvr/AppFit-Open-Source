import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '~/components/ui/Button';
import { ideaChamberStore, ideaSuggestions, isIdeaChamberVisible } from '~/lib/stores/ideaChamber';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';

interface IdeaChamberProps {
  onSelectIdeas: (ideas: string) => void;
}

export const IdeaChamber: React.FC<IdeaChamberProps> = ({ onSelectIdeas }) => {
  const suggestions = useStore(ideaSuggestions);
  const isVisible = useStore(isIdeaChamberVisible);
  const [isClosing, setIsClosing] = useState(false);

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      ideaChamberStore.hideIdeaChamber();
      setIsClosing(false);
    }, 300);
  };

  // Handle idea selection
  const handleDoThis = () => {
    const selectedIdeas = ideaChamberStore.getSelectedSuggestions();
    if (selectedIdeas.length > 0) {
      const ideasText = selectedIdeas
        .map((idea) => `${idea.title}: ${idea.description}`)
        .join('\n\n');

      onSelectIdeas(ideasText);
      handleClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="w-full max-w-chat mx-auto mb-6 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background shadow-lg"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: cubicEasingFn }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Idea Chamber</h3>
              <button
                onClick={handleClose}
                className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
              >
                <div className="i-ph:x text-xl" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={classNames(
                    'p-3 rounded-md border transition-all',
                    suggestion.selected
                      ? 'bg-purple-500/10 border-purple-500/20'
                      : 'bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 pt-0.5">
                      <input
                        type="checkbox"
                        id={suggestion.id}
                        checked={suggestion.selected}
                        onChange={() => ideaChamberStore.toggleSuggestion(suggestion.id)}
                        className="w-4 h-4 rounded border-gray-400 cursor-pointer focus:ring-purple-500 text-purple-600 bg-bolt-elements-background"
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor={suggestion.id}
                        className="block font-medium text-bolt-elements-textPrimary leading-snug cursor-pointer"
                      >
                        {suggestion.title}
                      </label>
                      <p className="text-sm text-bolt-elements-textSecondary mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleDoThis}
                className="bg-purple-500 hover:bg-purple-600 text-white"
                disabled={!ideaChamberStore.getSelectedSuggestions().length}
              >
                Do This
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
