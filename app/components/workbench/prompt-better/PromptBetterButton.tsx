import React from 'react';
import { Button } from '~/components/ui/Button';
import { promptBetterStore } from '~/lib/stores/promptBetter';

interface PromptBetterButtonProps {
  title?: string;
}

export const PromptBetterButton: React.FC<PromptBetterButtonProps> = ({ 
  title = 'PromptBetter' 
}) => {
  const handleClick = () => {
    promptBetterStore.toggleVisibility();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      title={title}
      className="bg-bolt-elements-background-depth-1 shadow-sm border border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-2"
    >
      <div className="i-ph:chats-circle text-purple-500" />
    </Button>
  );
};
