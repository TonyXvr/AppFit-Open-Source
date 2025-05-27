import type { Message } from 'ai';
import { Fragment, useState } from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';
import { useLocation } from '@remix-run/react';
import { db, chatId } from '~/lib/persistence/useChatHistory';
import { forkChat } from '~/lib/persistence/db';
import { toast } from 'react-toastify';
import WithTooltip from '~/components/ui/Tooltip';
import { useStore } from '@nanostores/react';
import { profileStore } from '~/lib/stores/profile';
import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import { IdeaChamberButton } from './IdeaChamberButton';
import { IdeaChamber } from './IdeaChamber';
import { ideaChamberStore } from '~/lib/stores/ideaChamber';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = forwardRef<HTMLDivElement, MessagesProps>(
  (props: MessagesProps, ref: ForwardedRef<HTMLDivElement> | undefined) => {
    const { id, isStreaming = false, messages = [] } = props;
    const location = useLocation();
    const profile = useStore(profileStore);
    const [lastCompletedMessageId, setLastCompletedMessageId] = useState<string | null>(null);

    const handleRewind = (messageId: string) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('rewindTo', messageId);
      window.location.search = searchParams.toString();
    };

    const handleFork = async (messageId: string) => {
      try {
        if (!db || !chatId.get()) {
          toast.error('Chat persistence is not available');
          return;
        }

        const urlId = await forkChat(db, chatId.get()!, messageId);
        window.location.href = `/chat/${urlId}`;
      } catch (error) {
        toast.error('Failed to fork chat: ' + (error as Error).message);
      }
    };

    // Function to generate ideas for the Idea Chamber
    const generateIdeas = async (messageId: string) => {
      try {
        ideaChamberStore.setLoading(true);

        // Get all messages up to this point
        const relevantMessages = messages.slice(0, messages.findIndex(m => m.id === messageId) + 1);

        const response = await fetch('/api/generate-ideas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: relevantMessages,
          }),
        });

        const data = await response.json() as { ideas?: any[], error?: string };

        if (data.error) {
          throw new Error(data.error);
        }

        // Add selected: false to each idea
        const ideasWithSelection = (data.ideas || []).map((idea: any) => ({
          ...idea,
          selected: false,
        }));

        // Set the ideas in the store
        ideaChamberStore.setSuggestions(ideasWithSelection);
        ideaChamberStore.setGenerated(messageId);
        ideaChamberStore.showIdeaChamber();
      } catch (error) {
        console.error('Error generating ideas:', error);
        toast.error('Failed to generate ideas');
      } finally {
        ideaChamberStore.setLoading(false);
      }
    };

    // Function to handle selected ideas
    const handleSelectIdeas = (ideasText: string) => {
      if (ideasText) {
        // Add the selected ideas to the chat input
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = `I'd like to implement these ideas:\n\n${ideasText}`;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.focus();
        }
      }
    };

    return (
      <div id={id} className={props.className} ref={ref}>
        {messages.length > 0
          ? messages.map((message, index) => {
              const { role, content, id: messageId, annotations } = message;
              const isUserMessage = role === 'user';
              const isFirst = index === 0;
              const isLast = index === messages.length - 1;
              const isHidden = annotations?.includes('hidden');

              // If this is the last assistant message and streaming just finished,
              // set it as the last completed message
              if (!isUserMessage && !isStreaming && isLast && messageId && messageId !== lastCompletedMessageId) {
                setLastCompletedMessageId(messageId);
              }

              if (isHidden) {
                return <Fragment key={index} />;
              }

              return (
                <div
                  key={index}
                  className={classNames('flex gap-4 p-6 w-full rounded-[calc(0.75rem-1px)]', {
                    'bg-bolt-elements-messages-background': isUserMessage || !isStreaming || (isStreaming && !isLast),
                    'bg-gradient-to-b from-bolt-elements-messages-background from-30% to-transparent':
                      isStreaming && isLast,
                    'mt-4': !isFirst,
                  })}
                >
                  {isUserMessage && (
                    <div className="flex items-center justify-center w-[40px] h-[40px] overflow-hidden bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-500 rounded-full shrink-0 self-start">
                      {profile?.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile?.username || 'User'}
                          className="w-full h-full object-cover"
                          loading="eager"
                          decoding="sync"
                        />
                      ) : (
                        <div className="i-ph:user-fill text-2xl" />
                      )}
                    </div>
                  )}
                  <div className="grid grid-col-1 w-full">
                    {isUserMessage ? (
                      <UserMessage content={content} />
                    ) : (
                      <AssistantMessage content={content} annotations={message.annotations} />
                    )}
                  </div>
                  {!isUserMessage && (
                    <div className="flex gap-2 flex-col lg:flex-row">
                      {messageId && (
                        <WithTooltip tooltip="Revert to this message">
                          <button
                            onClick={() => handleRewind(messageId)}
                            key="i-ph:arrow-u-up-left"
                            className={classNames(
                              'i-ph:arrow-u-up-left',
                              'text-xl text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors',
                            )}
                          />
                        </WithTooltip>
                      )}

                      <WithTooltip tooltip="Fork chat from this message">
                        <button
                          onClick={() => handleFork(messageId)}
                          key="i-ph:git-fork"
                          className={classNames(
                            'i-ph:git-fork',
                            'text-xl text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors',
                          )}
                        />
                      </WithTooltip>
                    </div>
                  )}

                  {/* Removed Idea Chamber button from here */}
                </div>
              );
            })
          : null}
        {isStreaming && (
          <div className="text-center w-full text-bolt-elements-textSecondary i-svg-spinners:3-dots-fade text-4xl mt-4"></div>
        )}

        {/* Idea Chamber and button positioned below the chat messages */}
        {!isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
          <>
            <IdeaChamberButton
              messageId={messages[messages.length - 1].id || ''}
              onGenerateIdeas={() => generateIdeas(messages[messages.length - 1].id || '')}
            />
            <IdeaChamber onSelectIdeas={handleSelectIdeas} />
          </>
        )}
      </div>
    );
  },
);
