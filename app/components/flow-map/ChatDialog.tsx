import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { flowMapData, flowMapStore } from '~/lib/stores/flowMap';
import { Button } from '~/components/ui/Button';
import { classNames } from '~/utils/classNames';
import { useNavigate } from '@remix-run/react';

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  designPrompt: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({ isOpen, onClose, designPrompt }) => {
  const navigate = useNavigate();
  const data = useStore(flowMapData);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `I've analyzed your project "${data.projectInfo.name}". What questions do you have about it before we proceed to generating code?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            // Include context about the project from the design prompt
            { role: 'system', content: `The user is designing a project with the following specifications:\n\n${designPrompt}\n\nAnswer their questions about the project without generating code. Focus on explaining concepts, clarifying requirements, and providing guidance.` },
            ...messages,
            userMessage
          ],
          files: [],
          contextOptimization: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Process the streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let assistantResponse = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        // Simple parsing of the event stream - in a real implementation you'd want more robust parsing
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(5);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices && parsed.choices[0]?.delta?.content) {
                assistantResponse += parsed.choices[0].delta.content;
                // Update the UI with the partial response
                setMessages(prev => {
                  const newMessages = [...prev];
                  // Check if we already have an assistant message we're building
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = assistantResponse;
                  } else {
                    newMessages.push({ role: 'assistant', content: assistantResponse });
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      // If we didn't get any response, add a fallback message
      if (!assistantResponse) {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm here to help with your project. What would you like to know?" }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, there was an error processing your request. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProceedToOpenChat = () => {
    // Reset the flow map and navigate back to the home page with the prompt
    flowMapStore.reset();
    
    // Store the prompt in localStorage to be picked up by the chat component
    localStorage.setItem('flowMapPrompt', designPrompt);
    
    // Navigate back to the home page
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bolt-elements-background-depth-1 rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-bolt-elements-borderColor">
          <h2 className="text-xl font-medium text-bolt-elements-textPrimary">Chat about your project</h2>
          <button 
            onClick={onClose}
            className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
          >
            <div className="i-ph:x text-xl" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={classNames(
                "p-3 rounded-lg max-w-[85%]",
                message.role === 'user' 
                  ? "bg-purple-500/10 ml-auto" 
                  : "bg-bolt-elements-background-depth-2 mr-auto"
              )}
            >
              <p className="text-bolt-elements-textPrimary whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="bg-bolt-elements-background-depth-2 p-3 rounded-lg max-w-[85%] mr-auto">
              <div className="text-bolt-elements-textSecondary i-svg-spinners:3-dots-fade text-2xl"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-bolt-elements-borderColor">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your project..."
                className="w-full p-3 pr-10 rounded-md bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor text-bolt-elements-textPrimary resize-none"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-3 bottom-3 text-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={isLoading ? "i-ph:circle-notch animate-spin" : "i-ph:paper-plane-right"} />
              </button>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white"
              onClick={handleProceedToOpenChat}
            >
              <div className="i-ph:arrow-square-out text-lg" />
              Proceed to Open Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDialog;
