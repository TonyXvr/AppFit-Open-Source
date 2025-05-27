import { atom, map } from 'nanostores';

export interface PromptBetterMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

// Store for PromptBetter visibility
export const isPromptBetterVisible = atom<boolean>(false);

// Store for loading state
export const isPromptBetterLoading = atom<boolean>(false);

// Store for chat messages
export const promptBetterMessages = atom<PromptBetterMessage[]>([
  {
    id: 'system-1',
    role: 'system',
    content: 'I\'m PromptBetter, your AI communication coach. I\'ll help you understand your project and learn how to communicate effectively with AI. Ask me anything about your project, and I\'ll explain it in simple terms as if you have no coding experience.',
    timestamp: Date.now()
  },
  {
    id: 'assistant-1',
    role: 'assistant',
    content: 'Hi there! I\'m here to help you understand your project better and learn how to communicate effectively with AI. Ask me anything about your code or project, and I\'ll explain it in simple terms. What would you like to know?',
    timestamp: Date.now()
  }
]);

// Actions
export const promptBetterStore = {
  // Toggle visibility
  toggleVisibility: () => {
    isPromptBetterVisible.set(!isPromptBetterVisible.get());
  },

  // Show PromptBetter
  showPromptBetter: () => {
    isPromptBetterVisible.set(true);
  },

  // Hide PromptBetter
  hidePromptBetter: () => {
    isPromptBetterVisible.set(false);
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    isPromptBetterLoading.set(loading);
  },

  // Add a message
  addMessage: (message: Omit<PromptBetterMessage, 'id' | 'timestamp'>) => {
    const newMessage: PromptBetterMessage = {
      ...message,
      id: `${message.role}-${Date.now()}`,
      timestamp: Date.now()
    };
    
    promptBetterMessages.set([...promptBetterMessages.get(), newMessage]);
    return newMessage;
  },

  // Clear messages (except system message)
  clearMessages: () => {
    const systemMessages = promptBetterMessages.get().filter(msg => msg.role === 'system');
    promptBetterMessages.set(systemMessages);
  }
};
