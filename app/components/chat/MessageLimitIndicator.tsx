import { useStore } from '@nanostores/react';
import { userMessageCountStore, getRemainingMessages } from '~/lib/stores/messageLimit';
import { classNames } from '~/utils/classNames';

export function MessageLimitIndicator() {
  // We need to subscribe to the store to make the component reactive
  useStore(userMessageCountStore);
  const remainingMessages = getRemainingMessages();

  // Determine color based on remaining messages
  const getStatusColor = () => {
    if (remainingMessages <= 1) return 'text-red-500';
    if (remainingMessages <= 2) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={classNames('flex items-center gap-1', getStatusColor())}>
        <span className="i-ph:chat-circle-text-fill" />
        <span className="text-sm font-medium">
          {remainingMessages} message{remainingMessages !== 1 ? 's' : ''} remaining today
        </span>
      </div>
    </div>
  );
}
