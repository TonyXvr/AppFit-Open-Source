import React from 'react';
import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { Button } from '~/components/ui/Button';
import { ideaChamberStore, isIdeaChamberLoading, hasGeneratedIdeas } from '~/lib/stores/ideaChamber';
import { classNames } from '~/utils/classNames';

interface IdeaChamberButtonProps {
  messageId: string;
  onGenerateIdeas: () => Promise<void>;
}

export const IdeaChamberButton: React.FC<IdeaChamberButtonProps> = ({ messageId, onGenerateIdeas }) => {
  const isLoading = useStore(isIdeaChamberLoading);
  const generatedState = useStore(hasGeneratedIdeas);
  const hasGenerated = generatedState.messageId === messageId && generatedState.generated;

  const handleClick = async () => {
    if (hasGenerated) {
      // If ideas already generated, just show the chamber
      ideaChamberStore.showIdeaChamber();
    } else {
      // Otherwise, generate ideas first
      await onGenerateIdeas();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="mt-4 w-full flex justify-center"
    >
      <Button
        onClick={handleClick}
        className={classNames(
          'text-sm flex items-center gap-2 px-6 py-3',
          hasGenerated
            ? 'bg-purple-500 hover:bg-purple-600 text-white'
            : 'bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary'
        )}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="i-ph:circle-notch animate-spin text-lg" />
            Generating ideas...
          </>
        ) : hasGenerated ? (
          <>
            <div className="i-ph:lightbulb-filament text-lg" />
            Open Idea Chamber
          </>
        ) : (
          <>
            <div className="i-ph:lightbulb text-lg" />
            Generate Ideas
          </>
        )}
      </Button>
    </motion.div>
  );
};
