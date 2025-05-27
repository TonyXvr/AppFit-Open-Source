import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { Button } from '~/components/ui/Button';
import {
  isPromptBetterVisible,
  isPromptBetterLoading,
  promptBetterMessages,
  promptBetterStore,
  type PromptBetterMessage
} from '~/lib/stores/promptBetter';
import { projectContextStore } from '~/lib/stores/projectContext';
import { workbenchStore } from '~/lib/stores/workbench';
import { createScopedLogger } from '~/utils/logger';
import ReactMarkdown from 'react-markdown';

const logger = createScopedLogger('PromptBetter');

export const PromptBetterPanel: React.FC = () => {
  const isVisible = useStore(isPromptBetterVisible);
  const isLoading = useStore(isPromptBetterLoading);
  const messages = useStore(promptBetterMessages);
  const projectContext = useStore(projectContextStore);
  const files = useStore(workbenchStore.files);

  const [input, setInput] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isVisible]);

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      promptBetterStore.hidePromptBetter();
      setIsClosing(false);
    }, 300);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    promptBetterStore.addMessage({
      role: 'user',
      content: input
    });

    // Clear input
    setInput('');

    // Set loading state
    promptBetterStore.setLoading(true);

    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem('openai_api_key') || '';
      if (!apiKey) {
        throw new Error('OpenAI API key is required');
      }

      // Prepare project context for the AI
      const projectSummary = projectContext.summary;
      const filesList = Object.entries(files)
        .filter(([_, dirent]) => dirent?.type === 'file' && !dirent.isBinary)
        .slice(0, 5) // Limit to 5 files to avoid token limits
        .map(([path, dirent]) => {
          // Truncate content to avoid token limits
          const content = dirent?.content || '';
          const truncatedContent = content.length > 500
            ? content.substring(0, 500) + '...'
            : content;

          return {
            path,
            content: truncatedContent
          };
        });

      // Prepare the system message
      const systemMessage = `
You are PromptBetter, an AI communication coach designed to help users understand their project and learn how to communicate effectively with AI.

Your primary goals are:
1. Explain technical concepts in simple terms as if the user has no coding experience
2. Help users understand their own project better
3. Teach users how to formulate better prompts when talking to AI

Project Context:
- Name: ${projectSummary.name}
- Description: ${projectSummary.description}
- Type: ${projectSummary.type}
- Technologies: ${projectSummary.technologies.join(', ')}
- Main Features: ${projectSummary.mainFeatures.join(', ')}

When responding:
- Use simple, non-technical language
- Explain concepts as if talking to someone with no coding experience
- Use analogies and real-world examples
- Break down complex ideas into simple steps
- Suggest better ways to ask questions about their code
- Be encouraging and supportive

Remember, your goal is to help the user understand their project better so they can communicate more effectively with AI.
`;

      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add the latest user message
      conversationHistory.push({
        role: 'user',
        content: input
      });

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemMessage
            },
            ...conversationHistory
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.error('OpenAI API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

      // Add assistant message
      promptBetterStore.addMessage({
        role: 'assistant',
        content: assistantMessage
      });
    } catch (error) {
      logger.error('Error sending message:', error);

      // Add error message
      promptBetterStore.addMessage({
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure you have set your OpenAI API key in the settings.`
      });
    } finally {
      // Clear loading state
      promptBetterStore.setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible && !isClosing) return null;

  return (
    <AnimatePresence>
      {(isVisible || isClosing) && (
        <motion.div
          className="fixed right-4 bottom-4 w-96 h-[70vh] bg-bolt-elements-background-depth-1 rounded-lg shadow-lg border border-bolt-elements-borderColor z-50 flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-bolt-elements-borderColor bg-bolt-elements-background-depth-2">
            <h3 className="text-sm font-medium text-bolt-elements-textPrimary flex items-center">
              <div className="i-ph:chats-circle text-purple-500 mr-2" />
              PromptBetter
              <span className="ml-2 text-xs text-bolt-elements-textTertiary">Learn to communicate with AI</span>
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              title="Close"
            >
              <div className="i-ph:x" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-bolt-elements-borderColor">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                className="flex-1 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-lg p-2 resize-none text-bolt-elements-textPrimary focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Ask about your project..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {isLoading ? (
                  <div className="i-ph:spinner animate-spin" />
                ) : (
                  <div className="i-ph:paper-plane-right" />
                )}
              </Button>
            </div>
            <p className="text-xs text-bolt-elements-textTertiary mt-2">
              Ask anything about your project in simple terms
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
