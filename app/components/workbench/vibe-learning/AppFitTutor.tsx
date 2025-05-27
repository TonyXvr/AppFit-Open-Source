import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatCompletion, APPFIT_TUTOR_SYSTEM_PROMPT, generateProjectAwarePrompt, type ChatMessage } from '~/lib/openai';
import ReactMarkdown from 'react-markdown';
import { useStore } from '@nanostores/react';
import { projectContextStore } from '~/lib/stores/projectContext';

interface AppFitTutorProps {
  // Add any props needed for this component
}

export const AppFitTutor: React.FC<AppFitTutorProps> = () => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const projectContext = useStore(projectContextStore);

  // Initialize chat with system message
  useEffect(() => {
    // Use project-aware prompt if project has been analyzed
    const systemPrompt = projectContext.summary.technologies.length > 0
      ? generateProjectAwarePrompt(projectContext)
      : APPFIT_TUTOR_SYSTEM_PROMPT;

    setChatHistory([{ role: 'system', content: systemPrompt }]);
  }, [projectContext]);

  // Scroll to bottom when chat history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setError(null);

    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content: question };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setIsTyping(true);

    try {
      // Call OpenAI API
      const response = await chatCompletion(updatedHistory);

      // Add assistant response to chat
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setChatHistory([...updatedHistory, assistantMessage]);
    } catch (err) {
      console.error('Error getting response from AI:', err);
      setError('Sorry, I had trouble connecting. Please try again.');

      // Fallback responses in case the API call fails
      const fallbackResponses = [
        "Great question! In web development, components are reusable pieces of code that return HTML elements. They help you split the UI into independent, reusable pieces.",
        "Let me explain that: CSS flexbox is a layout model that allows elements to align and distribute space within a container. It's particularly useful for responsive designs.",
        "That's a common issue! When you see 'undefined is not an object', it usually means you're trying to access a property of an undefined variable. Check your variable initialization.",
        "The difference is that 'let' allows you to reassign values while 'const' creates a read-only reference. Both are block-scoped unlike 'var'."
      ];

      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      const fallbackMessage: ChatMessage = {
        role: 'assistant',
        content: fallbackResponse + "\n\n(Note: This is a fallback response. The AI service is currently unavailable.)"
      };
      setChatHistory([...updatedHistory, fallbackMessage]);
    } finally {
      setIsTyping(false);
      setQuestion('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-lg p-4 shadow-sm border border-purple-500/10">
      <div className="flex items-center mb-4">
        <div className="bg-purple-500 text-white p-2 rounded-lg mr-3">
          <div className="i-ph:chalkboard-teacher text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">
            AppFit Tutor
          </h3>
          <p className="text-sm text-bolt-elements-textSecondary">
            Your personal coding assistant and teacher
          </p>
        </div>
      </div>

      <div ref={chatContainerRef} className="bg-bolt-elements-background-depth-1 rounded-lg p-4 mb-4 h-64 overflow-y-auto flex flex-col space-y-3">
        {/* Filter out system messages for display */}
        {chatHistory.filter(msg => msg.role !== 'system').length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="i-ph:chat-centered-text text-4xl text-purple-500/30 mb-3" />
            <p className="text-bolt-elements-textSecondary mb-1">Ask me anything about your code!</p>
            <p className="text-xs text-bolt-elements-textTertiary">I can explain concepts, help debug issues, or teach you new skills</p>
          </div>
        ) : (
          <AnimatePresence>
            {chatHistory
              .filter(msg => msg.role !== 'system')
              .map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg px-3 py-2 ${message.role === 'user'
                      ? 'bg-purple-500 text-white rounded-tr-none'
                      : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary rounded-tl-none'}`}
                  >
                    {message.role === 'user' ? (
                      message.content
                    ) : (
                      <ReactMarkdown
                        className="prose prose-sm max-w-none prose-pre:bg-bolt-elements-background-depth-3 prose-pre:text-xs prose-pre:p-2 prose-pre:rounded prose-code:text-purple-500 prose-code:bg-purple-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-p:my-1 prose-headings:my-2"
                        components={{
                          // Override the default code block rendering
                          code: ({node, inline, className, children, ...props}) => {
                            if (inline) {
                              return <code className="text-xs" {...props}>{children}</code>
                            }
                            return (
                              <div className="bg-bolt-elements-background-depth-3 rounded p-1 my-2">
                                <pre className="overflow-auto text-xs p-2">
                                  <code {...props}>{children}</code>
                                </pre>
                              </div>
                            )
                          }
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </motion.div>
              ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary rounded-lg rounded-tl-none px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <div className="bg-red-500/10 text-red-500 rounded-lg px-3 py-2 text-sm">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your code..."
          className="flex-1 px-3 py-2 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          disabled={isTyping}
        />
        <button
          type="submit"
          className={`px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isTyping || !question.trim()}
        >
          <div className="i-ph:paper-plane-right mr-1" />
          Send
        </button>
      </form>

      <div className="mt-4">
        <h4 className="text-xs font-medium text-bolt-elements-textTertiary mb-2">SUGGESTED QUESTIONS</h4>
        <div className="grid grid-cols-2 gap-2">
          {/* Project-specific questions */}
          {projectContext.summary.technologies.includes('React') && (
            <button
              className="text-xs px-3 py-2 bg-bolt-elements-background-depth-1 hover:bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary rounded-md transition-colors text-left flex items-center"
              onClick={() => setQuestion("Explain how React components work in our project")}
              disabled={isTyping}
            >
              <div className="i-ph:code text-purple-500 mr-1.5 flex-shrink-0" />
              <span className="truncate">Explain React components in our project</span>
            </button>
          )}

          {projectContext.keyFiles.length > 0 && (
            <button
              className="text-xs px-3 py-2 bg-bolt-elements-background-depth-1 hover:bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary rounded-md transition-colors text-left flex items-center"
              onClick={() => setQuestion(`Explain the purpose of ${projectContext.keyFiles[0].split('/').pop()}`)}
              disabled={isTyping}
            >
              <div className="i-ph:file-code text-purple-500 mr-1.5 flex-shrink-0" />
              <span className="truncate">Explain {projectContext.keyFiles[0].split('/').pop()}</span>
            </button>
          )}

          {projectContext.suggestedTopics.length > 0 && (
            <button
              className="text-xs px-3 py-2 bg-bolt-elements-background-depth-1 hover:bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary rounded-md transition-colors text-left flex items-center"
              onClick={() => setQuestion(`Teach me about ${projectContext.suggestedTopics[0]}`)}
              disabled={isTyping}
            >
              <div className="i-ph:graduation-cap text-purple-500 mr-1.5 flex-shrink-0" />
              <span className="truncate">Learn about {projectContext.suggestedTopics[0]}</span>
            </button>
          )}

          {/* General questions as fallbacks */}
          <button
            className="text-xs px-3 py-2 bg-bolt-elements-background-depth-1 hover:bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary rounded-md transition-colors text-left flex items-center"
            onClick={() => setQuestion("What are the main features of this project?")}
            disabled={isTyping}
          >
            <div className="i-ph:info text-purple-500 mr-1.5 flex-shrink-0" />
            <span className="truncate">What are the main features of this project?</span>
          </button>

          <button
            className="text-xs px-3 py-2 bg-bolt-elements-background-depth-1 hover:bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary rounded-md transition-colors text-left flex items-center"
            onClick={() => setQuestion("How do I debug issues in this project?")}
            disabled={isTyping}
          >
            <div className="i-ph:bug text-purple-500 mr-1.5 flex-shrink-0" />
            <span className="truncate">How do I debug issues in this project?</span>
          </button>
        </div>
      </div>
    </div>
  );
};
