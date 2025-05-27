import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';

// Define persona type
interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarColor: string;
}

// Define message type for chat
interface PersonaMessage {
  id: string;
  personaId: string;
  content: string;
  isUser: boolean;
  timestamp: number;
}

interface AiPersonasProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

// Avatar component with customizable color
const PersonaAvatar = ({ name, color }: { name: string; color: string }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div
      className="flex items-center justify-center rounded-full w-10 h-10 text-white font-medium"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

// Create a new persona component
const PersonaCreator = ({
  onCreatePersona
}: {
  onCreatePersona: (persona: Persona) => void
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');

  // Generate a random color for the avatar
  const getRandomColor = () => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    const newPersona: Persona = {
      id: `persona-${Date.now()}`,
      name,
      role,
      description,
      avatarColor: getRandomColor(),
    };

    onCreatePersona(newPersona);
    setName('');
    setRole('');
    setDescription('');
  };

  const applyTemplate = (template: {name: string, role: string, description: string}) => {
    setName(template.name);
    setRole(template.role);
    setDescription(template.description);
  };

  const personaTemplates = [
    {
      name: "Alex Johnson",
      role: "Ideal Customer - Enterprise CTO",
      description: "A tech-savvy CTO at a mid-sized enterprise (500+ employees) who needs to improve team collaboration and productivity. Budget-conscious but willing to invest in solutions with clear ROI."
    },
    {
      name: "Sarah Williams",
      role: "Potential User - Marketing Manager",
      description: "Marketing manager at a growing startup who needs tools that integrate well with existing marketing stack. Prioritizes ease of use and visual reporting capabilities."
    },
    {
      name: "Michael Chen",
      role: "Skeptical Stakeholder - CFO",
      description: "Financial decision-maker who needs to be convinced of the value proposition. Concerned about implementation costs, training time, and measurable outcomes."
    }
  ];

  return (
    <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor">
      <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4">Create New Persona</h3>

      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-bolt-elements-textSecondary">
          <span className="font-medium">As the Product Owner</span>, create personas representing your ideal customers, stakeholders, or users to simulate conversations and gather insights.
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-bolt-elements-textSecondary mb-2">Quick Templates:</p>
        <div className="grid grid-cols-1 gap-2">
          {personaTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => applyTemplate(template)}
              className="text-left p-2 text-sm rounded border border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-2 transition-colors"
            >
              <div className="font-medium text-bolt-elements-textPrimary">{template.name}</div>
              <div className="text-xs text-bolt-elements-textSecondary">{template.role}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-bolt-elements-textSecondary">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Sarah Johnson"
            className="w-full p-2 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-bolt-elements-textSecondary">
            Role/Persona Type
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Ideal Customer, Enterprise User, Skeptical Stakeholder"
            className="w-full p-2 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-bolt-elements-textSecondary">
            Persona Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe their needs, pain points, decision-making factors, and background."
            className="w-full p-2 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
        >
          Create Persona
        </button>
      </form>
    </div>
  );
};

// Persona chat component
const PersonaChat = ({
  persona,
  messages,
  onSendMessage
}: {
  persona: Persona;
  messages: PersonaMessage[];
  onSendMessage: (personaId: string, content: string) => void;
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(persona.id, message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-3 p-3 border-b border-bolt-elements-borderColor bg-bolt-elements-background-depth-1">
        <PersonaAvatar name={persona.name} color={persona.avatarColor} />
        <div>
          <h3 className="font-medium text-bolt-elements-textPrimary">{persona.name}</h3>
          <p className="text-sm text-bolt-elements-textSecondary">{persona.role}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-4">👋</div>
            <p className="text-bolt-elements-textSecondary">As a Product Owner, start a conversation with {persona.name}</p>
            <p className="text-sm text-bolt-elements-textTertiary mt-2 max-w-md">
              You are speaking as the Founder/Product Manager/Owner of their software product. They want to understand your perspective as ${persona.role}.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.isUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor text-bolt-elements-textPrimary'
                }`}
              >
                {!msg.isUser && (
                  <div className="flex items-center mb-1 space-x-2">
                    <PersonaAvatar name={persona.name} color={persona.avatarColor} />
                    <span className="text-sm font-medium">{persona.name}</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-bolt-elements-borderColor p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message ${persona.name} as a Product Owner...`}
            className="flex-1 p-3 rounded-lg bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="ml-2 p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="i-ph:paper-plane-right" />
          </button>
        </div>
      </form>
    </div>
  );
};

// Persona card for listing
const PersonaCard = ({
  persona,
  isActive,
  onClick,
  onDelete
}: {
  persona: Persona;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}) => {
  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          : 'bg-bolt-elements-background-depth-1 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-2'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <PersonaAvatar name={persona.name} color={persona.avatarColor} />
          <div>
            <h3 className="font-medium text-bolt-elements-textPrimary">{persona.name}</h3>
            <p className="text-sm text-bolt-elements-textSecondary">{persona.role}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded-full hover:bg-bolt-elements-background-depth-2 text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary"
        >
          <div className="i-ph:trash" />
        </button>
      </div>
      {persona.description && (
        <p className="mt-3 text-sm text-bolt-elements-textSecondary line-clamp-2">{persona.description}</p>
      )}
    </div>
  );
};

// Add API Key Modal component
const ApiKeyModal = ({
  isOpen,
  onClose,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(apiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-bolt-elements-background-depth-0 p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-4">Set OpenAI API Key</h3>
        <p className="text-sm text-bolt-elements-textSecondary mb-4">
          Enter your OpenAI API key to enable the GPT-4o model for persona conversations.
          Your key will be stored locally in your browser.
        </p>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-1">How to get an API key:</h4>
          <ol className="text-xs text-bolt-elements-textSecondary list-decimal pl-4 space-y-1">
            <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI API Keys</a></li>
            <li>Sign in or create an account</li>
            <li>Click "Create new secret key"</li>
            <li>Copy the key and paste it below</li>
          </ol>
          <p className="text-xs text-bolt-elements-textTertiary mt-2">
            Note: Using the API requires an OpenAI account with billing enabled.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-bolt-elements-textSecondary">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full p-2 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!apiKey.trim().startsWith('sk-')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main component
export const AiPersonas = ({ chatStarted, isStreaming }: AiPersonasProps) => {
  const [activeTab, setActiveTab] = useState('manage');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [messages, setMessages] = useState<PersonaMessage[]>([]);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(!!localStorage.getItem('openai_api_key'));

  // Handle creating a new persona
  const handleCreatePersona = useCallback((persona: Persona) => {
    setPersonas(prev => [...prev, persona]);
  }, []);

  // Handle selecting a persona for chat
  const handleSelectPersona = useCallback((personaId: string) => {
    setSelectedPersona(personaId);
    setActiveTab('chat');
  }, []);

  // Handle deleting a persona
  const handleDeletePersona = useCallback((personaId: string) => {
    setPersonas(prev => prev.filter(p => p.id !== personaId));
    if (selectedPersona === personaId) {
      setSelectedPersona(null);
    }
    // Also remove associated messages
    setMessages(prev => prev.filter(m => m.personaId !== personaId));
  }, [selectedPersona]);

  // Handle sending a message
  const handleSendMessage = useCallback(async (personaId: string, content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: PersonaMessage = {
      id: `msg-${Date.now()}-user`,
      personaId,
      content,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Get the persona details
    const persona = personas.find(p => p.id === personaId);
    if (!persona) return;

    // Check if API key is set - use environment variable or user-provided key
    // Set OPENAI_API_KEY environment variable with your OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY || localStorage.getItem('openai_api_key');
    if (!apiKey) {
      // Add error message about missing API key
      const errorMessage: PersonaMessage = {
        id: `msg-${Date.now()}-error`,
        personaId,
        content: "Please set your OpenAI API key by clicking the 'Set API Key' button in the header to enable GPT-4o responses.",
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsApiKeyModalOpen(true); // Open the API key modal
      return;
    }

    try {
      // Custom prompt for OpenAI
      const systemPrompt = `You are roleplaying as ${persona.name}, who is ${persona.role}.
${persona.description ? `Additional context about you: ${persona.description}` : ''}

You are speaking with a Product Manager/Founder about their software product.
Respond naturally as this persona would, with their specific perspective, concerns, and communication style.
Keep responses concise (2-3 paragraphs maximum) and focused on the specific question or topic.`;

      // Call OpenAI's API directly using fetch
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
              content: systemPrompt
            },
            {
              role: 'user',
              content: content
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json() as {
        choices?: Array<{
          message?: {
            content?: string
          }
        }>
      };
      const responseContent = result.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process that request as this persona.";

      // Add AI response as the persona
      const aiMessage: PersonaMessage = {
        id: `msg-${Date.now()}-ai`,
        personaId,
        content: responseContent,
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in persona chat:', error);
      // Add error message
      const errorMessage: PersonaMessage = {
        id: `msg-${Date.now()}-error`,
        personaId,
        content: "I couldn't connect to OpenAI. Please check your API key by clicking the 'Set API Key' button.",
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [personas, setMessages, setIsApiKeyModalOpen]);

  // Handle API key save
  const handleSaveApiKey = useCallback((apiKey: string) => {
    localStorage.setItem('openai_api_key', apiKey);
    setHasApiKey(true);
  }, []);

  // Filter messages for the selected persona
  const filteredMessages = selectedPersona
    ? messages.filter(msg => msg.personaId === selectedPersona)
    : [];

  // Get the selected persona object
  const activePersona = selectedPersona
    ? personas.find(p => p.id === selectedPersona)
    : null;

  return (
    <motion.div
      className="flex flex-col h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="bg-bolt-elements-background-depth-1 border-b border-bolt-elements-borderColor p-2 flex justify-between items-center">
          <TabsList className="bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor">
            <TabsTrigger
              value="manage"
              className="text-bolt-elements-textPrimary data-[state=active]:bg-bolt-elements-background-depth-2 data-[state=active]:text-bolt-elements-textPrimary data-[state=inactive]:text-bolt-elements-textSecondary"
            >
              Manage Personas
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="text-bolt-elements-textPrimary data-[state=active]:bg-bolt-elements-background-depth-2 data-[state=active]:text-bolt-elements-textPrimary data-[state=inactive]:text-bolt-elements-textSecondary"
              disabled={!selectedPersona}
            >
              Persona Chat
            </TabsTrigger>
          </TabsList>

          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
              hasApiKey
                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
            }`}
          >
            <div className={hasApiKey ? "i-ph:key-duotone" : "i-ph:key-duotone"} />
            {hasApiKey ? 'API Key Set' : 'Set API Key'}
          </button>
        </div>

        <TabsContent value="manage" className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-bolt-elements-textPrimary mb-4">Your Customer Personas</h2>

              {personas.length === 0 ? (
                <div className="bg-bolt-elements-background-depth-1 rounded-lg p-6 border border-bolt-elements-borderColor text-center">
                  <div className="text-4xl mb-3">👥</div>
                  <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">No Personas Yet</h3>
                  <p className="text-bolt-elements-textSecondary mb-2">
                    Create customer personas to simulate conversations from their perspective.
                  </p>
                  <p className="text-sm text-bolt-elements-textTertiary">
                    As the Product Owner, this helps you understand how different users perceive your product.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {personas.map(persona => (
                    <PersonaCard
                      key={persona.id}
                      persona={persona}
                      isActive={persona.id === selectedPersona}
                      onClick={() => handleSelectPersona(persona.id)}
                      onDelete={() => handleDeletePersona(persona.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <PersonaCreator onCreatePersona={handleCreatePersona} />
          </div>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 overflow-hidden">
          {activePersona ? (
            <PersonaChat
              persona={activePersona}
              messages={filteredMessages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-bolt-elements-textSecondary">Select a persona to start chatting</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};