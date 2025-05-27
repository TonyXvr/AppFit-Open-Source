import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { messageLimitStore, messagesTrimmedStore, updateMessageLimit } from '~/lib/stores/messageLimit';
import WithTooltip from '~/components/ui/Tooltip';
import { classNames } from '~/utils/classNames';

interface MessageLimitConfigProps {
  messages?: any[];
}

export function MessageLimitConfig({ messages = [] }: MessageLimitConfigProps) {
  const currentLimit = useStore(messageLimitStore);
  const messagesTrimmed = useStore(messagesTrimmedStore);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(currentLimit.toString());
  const [messageCount, setMessageCount] = useState(0);

  // Update message count whenever messages change
  useEffect(() => {
    setMessageCount(messages.length);
  }, [messages]);

  const handleSave = () => {
    const newLimit = parseInt(inputValue, 10);
    if (!isNaN(newLimit) && newLimit > 0) {
      updateMessageLimit(newLimit);
      setIsOpen(false);
    }
  };

  // Calculate percentage of limit used
  const percentUsed = Math.min(100, Math.round((messageCount / currentLimit) * 100));

  // Determine color based on percentage used
  const getStatusColor = () => {
    if (percentUsed >= 90) return 'text-red-500';
    if (percentUsed >= 70) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <div className="relative">
      <WithTooltip tooltip={`${messageCount}/${currentLimit} messages used${messagesTrimmed ? ' - Some messages are hidden' : ''}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors text-sm"
        >
          <span className={classNames('i-ph:chat-circle-text-fill', getStatusColor())} />
          <span>
            <span className={getStatusColor()}>{messageCount}</span>/{currentLimit}
          </span>
        </button>
      </WithTooltip>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-bolt-elements-background border border-bolt-elements-border rounded-md shadow-lg p-4 z-50 w-64">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-bolt-elements-textSecondary">Message Limit</label>
              <span className="text-xs text-bolt-elements-textSecondary">{messageCount}/{currentLimit} used</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={classNames(
                  'h-full',
                  percentUsed >= 90 ? 'bg-red-500' :
                  percentUsed >= 70 ? 'bg-amber-500' :
                  'bg-green-500'
                )}
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>

            <input
              type="number"
              min="1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border border-bolt-elements-border rounded-md p-2 bg-bolt-elements-input text-bolt-elements-textPrimary"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-bolt-elements-accent text-white rounded-md hover:bg-bolt-elements-accent-hover"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
