import { useStore } from '@nanostores/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import type { SimplifiedProductInsight } from '~/types/perplexity';
import { perplexityStore } from '~/lib/stores/perplexity';
import { MarketTab } from '~/components/workbench/MarketTab';
import { RecommendationsTab } from '~/components/workbench/RecommendationsTab';
import { CompetitorTab } from '~/components/workbench/CompetitorTab';
import { RevenueTab } from '~/components/workbench/RevenueTab';
import { RoadmapTab } from '~/components/workbench/RoadmapTab';
import { ProductMarketFitScore } from '~/components/workbench/ProductMarketFitScore';
import type { CompetitorAnalysis, PricingModelRecommendation, PrioritizedFeature, RoadmapSuggestion } from '~/types/product-coach';

interface ProductCoachPanelProps {
  insight: SimplifiedProductInsight | undefined;
  isLoading: boolean;
  error: string | null;
  onAnalyzeProject: () => void;
}

// Update the stripMarkdown function to better handle sonar's formatted text
export const stripMarkdown = (text: string): string => {
  if (!text) return '';

  // Remove bold/italic markers and other markdown formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1')     // Italic
    .replace(/__(.*?)__/g, '$1')     // Underline
    .replace(/~~(.*?)~~/g, '$1')     // Strikethrough
    .replace(/```(.*?)```/s, '$1')   // Code blocks
    .replace(/^#+\s+(.*)$/gm, '$1')  // Headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/\[\d+\](?:\[\d+\])?/g, '') // Remove references like [1] or [1][7]
    .trim();
};

// Helper function to format text with bullet points
const formatWithBullets = (text: string): string => {
  if (!text) return '';

  // If the text already has bullet points or line items, return as is
  if (text.includes('• ') || text.includes('- ') || text.includes('* ')) {
    return text;
  }

  // Otherwise add bullet points to each line
  return text.split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => `• ${line.trim()}`)
    .join('\n');
};

// Simple Message interface for the chat
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ProductCoach Chat component
const ProductCoachChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Product Coach. I can help you with product strategy, market insights, and growth opportunities. How can I assist you today?",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Scroll to bottom after sending message
    setTimeout(scrollToBottom, 100);

    try {
      // Call Perplexity API
      const response = await fetch('/api/perplexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatMode: true,
          message: inputValue
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const result = await response.json() as { response?: string };
      let assistantResponse = result.response || "I'm sorry, I couldn't process that request.";

      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: stripMarkdown(assistantResponse),
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Scroll to bottom after receiving response
      setTimeout(scrollToBottom, 100);
    }
  }, [inputValue, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor text-bolt-elements-textPrimary'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-bolt-elements-borderColor p-4">
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your Product Coach..."
              disabled={isLoading}
              className="w-full p-3 pr-10 rounded-lg bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 text-blue-500 animate-spin">
                  <div className="i-ph:circle-notch" />
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="ml-2 p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="i-ph:paper-plane-right" />
          </button>
        </div>
      </form>
    </div>
  );
};

// Add a simple custom bar chart component
const PriorityBarChart = ({ data }: { data: {name: string; count: number; color: string}[] }) => {
  const maxCount = Math.max(...data.map(item => item.count), 1); // Ensure we don't divide by zero

  return (
    <div className="w-full mt-3">
      {data.map((item, index) => (
        <div key={index} className="mb-3">
          <div className="flex items-center mb-1">
            <span className="text-sm font-medium text-bolt-elements-textSecondary">{item.name}</span>
            <span className="ml-auto text-sm font-medium text-bolt-elements-textSecondary">{item.count}</span>
          </div>
          <div className="w-full bg-bolt-elements-background-depth-2 rounded-full h-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(item.count / maxCount) * 100}%`,
                backgroundColor: item.color,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProductCoachPanel = ({ insight, isLoading, error, onAnalyzeProject }: ProductCoachPanelProps) => {
  // State to manage recommendation statuses
  const [recommendationStatuses, setRecommendationStatuses] = useState<Record<number, 'todo' | 'done'>>({});
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('overview');

  // --- Get detailed data from the store ---
  const $detailedCompetitors = useStore(perplexityStore.detailedCompetitors);
  const $pricingRecommendations = useStore(perplexityStore.pricingRecommendations);
  const $prioritizedFeatures = useStore(perplexityStore.prioritizedFeatures);
  const $roadmapSuggestions = useStore(perplexityStore.roadmapSuggestions);
  // --- End store connection ---

  // Effect to initialize/update statuses when insight changes
  useEffect(() => {
    if (insight?.recommendations) {
      const initialStatuses: Record<number, 'todo' | 'done'> = {};
      insight.recommendations.forEach((rec, index) => {
        // Use recommendation title as key for status - more stable
        const key = rec.title || `rec-${index}`;
        initialStatuses[index] = 'todo'; // Defaulting all to todo for now, status isn't in SimplifiedProductInsight
      });
      setRecommendationStatuses(initialStatuses);
    } else {
      setRecommendationStatuses({}); // Reset if no insight or recommendations
    }
  }, [insight?.recommendations]);

  // Handler to toggle the status of a recommendation
  const handleToggleRecommendationStatus = useCallback((index: number) => {
    setRecommendationStatuses(prevStatuses => {
      const currentStatus = prevStatuses[index];
      const newStatus = currentStatus === 'todo' ? 'done' : 'todo';
      return {
        ...prevStatuses,
        [index]: newStatus,
      };
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 text-blue-500 animate-pulse mb-6">
          <div className="i-ph:brain-duotone animate-bounce" />
        </div>
        <h3 className="text-xl font-medium mb-3 text-bolt-elements-textPrimary">Analyzing Your Project</h3>
        <div className="w-16 h-16 text-bolt-elements-textTertiary animate-spin mb-6">
          <div className="i-ph:circle-notch" />
        </div>
        <p className="text-bolt-elements-textSecondary max-w-md">
          Our AI is examining your code, evaluating market opportunities, and creating personalized recommendations for your product.
        </p>
        <p className="text-sm text-bolt-elements-textTertiary mt-3 max-w-sm">
          This may take a minute or two depending on the size of your project.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="relative mb-6">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-75 blur"></div>
          <div className="relative w-20 h-20 bg-bolt-elements-background rounded-full flex items-center justify-center">
            <div className="w-10 h-10 text-red-500">
              <div className="i-ph:warning-circle" />
            </div>
          </div>
        </div>
        <h3 className="text-xl font-medium mb-3 text-bolt-elements-textPrimary">Error</h3>
        <p className="text-bolt-elements-textSecondary max-w-md mb-6 bg-red-500/5 p-4 rounded-lg border border-red-500/20">
          {error}
        </p>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-bolt-elements-background-depth-1 hover:bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary rounded-lg font-medium transition-all border border-bolt-elements-borderColor"
            onClick={() => window.location.reload()}
          >
            <div className="flex items-center gap-2">
              <div className="i-ph:arrow-clockwise" />
              <span>Reload Page</span>
            </div>
          </button>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            onClick={onAnalyzeProject}
          >
            <div className="flex items-center gap-2">
              <div className="i-ph:arrow-counter-clockwise" />
              <span>Try Again</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="relative mb-8">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 blur"></div>
          <div className="relative w-20 h-20 bg-bolt-elements-background rounded-full flex items-center justify-center">
            <div className="w-10 h-10 text-blue-500">
              <div className="i-ph:lightbulb-filament" />
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-medium mb-3 text-bolt-elements-textPrimary">Product Coach</h3>
        <p className="text-bolt-elements-textSecondary max-w-md mb-2">
          Get insights about your product's market fit, competitive landscape, and growth opportunities.
        </p>
        <p className="text-sm text-bolt-elements-textTertiary max-w-md mb-8">
          Our AI will analyze your project files to provide targeted recommendations and insights to help your product succeed.
        </p>
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          onClick={onAnalyzeProject}
        >
          <div className="flex items-center gap-2">
            <div className="i-ph:magic-wand" />
            <span>Analyze Project</span>
          </div>
        </button>
      </div>
    );
  }

  // --- Calculate Recommendation Priority Counts ---
  const priorityCounts = { high: 0, medium: 0, low: 0 };
  let totalRecommendations = 0;
  if (insight.recommendations) {
    totalRecommendations = insight.recommendations.length;
    insight.recommendations.forEach(rec => {
      if (rec.priority === 'high') priorityCounts.high++;
      else if (rec.priority === 'medium') priorityCounts.medium++;
      else if (rec.priority === 'low') priorityCounts.low++;
    });
  }

  // Define chart data with proper colors
  const priorityChartData = [
    { name: 'High Priority', count: priorityCounts.high, color: '#ef4444' }, // Red-500
    { name: 'Medium Priority', count: priorityCounts.medium, color: '#eab308' }, // Yellow-500
    { name: 'Low Priority', count: priorityCounts.low, color: '#22c55e' }, // Green-500
  ];

  return (
    <div className="h-full overflow-auto p-4">
      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="mb-4 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor flex flex-wrap justify-start h-auto">
          <TabsTrigger value="overview" className="text-bolt-elements-textPrimary data-[state=active]:bg-bolt-elements-background-depth-2 data-[state=active]:text-bolt-elements-textPrimary data-[state=inactive]:text-bolt-elements-textSecondary">Overview</TabsTrigger>
          <TabsTrigger value="market" className="text-bolt-elements-textPrimary data-[state=active]:bg-bolt-elements-background-depth-2 data-[state=active]:text-bolt-elements-textPrimary data-[state=inactive]:text-bolt-elements-textSecondary">Market</TabsTrigger>
          <TabsTrigger value="competitors" className="text-bolt-elements-textPrimary data-[state=active]:bg-bolt-elements-background-depth-2 data-[state=active]:text-bolt-elements-textPrimary data-[state=inactive]:text-bolt-elements-textSecondary">Competitors</TabsTrigger>
          <TabsTrigger value="revenue" className="text-bolt-elements-textPrimary data-[state=active]:bg-bolt-elements-background-depth-2 data-[state=active]:text-bolt-elements-textPrimary data-[state=inactive]:text-bolt-elements-textSecondary">Revenue</TabsTrigger>
          <TabsTrigger value="roadmap" className="text-bolt-elements-textPrimary data-[state=active]:bg-bolt-elements-background-depth-2 data-[state=active]:text-bolt-elements-textPrimary data-[state=inactive]:text-bolt-elements-textSecondary">Roadmap</TabsTrigger>
          <TabsTrigger value="recommendations" className="text-bolt-elements-textPrimary data-[state=active]:bg-bolt-elements-background-depth-2 data-[state=active]:text-bolt-elements-textPrimary data-[state=inactive]:text-bolt-elements-textSecondary">Recommendations</TabsTrigger>
          <TabsTrigger value="chat" className="text-bolt-elements-textPrimary data-[state=active]:bg-bolt-elements-background-depth-2 data-[state=active]:text-bolt-elements-textPrimary data-[state=inactive]:text-bolt-elements-textSecondary">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Card: Project Summary */}
            <div className="lg:col-span-2 bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md flex flex-col space-y-2">
              <div className="flex items-center">
                <div className="text-blue-500 mr-2 text-xl shrink-0">
                  <div className="i-ph:identification-card-duotone" />
                </div>
                <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Project Summary</h3>
              </div>
              <p className="text-bolt-elements-textSecondary flex-grow">
                {stripMarkdown(insight?.summary || 'Summary not available.')}
              </p>
            </div>

            {/* Card: Target Audience */}
            <div className="lg:col-span-1 bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md flex flex-col space-y-2">
              <div className="flex items-center">
                <div className="text-teal-500 mr-2 text-xl shrink-0">
                  <div className="i-ph:users-three-duotone" />
                </div>
                <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Target Audience</h3>
              </div>
              <p className="text-bolt-elements-textSecondary leading-relaxed flex-grow">
                {stripMarkdown(insight?.audience || 'Audience not specified.')}
              </p>
            </div>

            {/* Product Market Fit Score */}
            <div className="lg:col-span-3">
              <ProductMarketFitScore />
            </div>

            {/* Card: Competitors - Condensed */}
            <div className="lg:col-span-1 bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md flex flex-col space-y-2">
              <div className="flex items-center mb-1">
                <div className="text-red-500 mr-2 text-xl shrink-0">
                  <div className="i-ph:strategy-duotone" />
                </div>
                <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Competitors</h3>
              </div>
              {insight?.competitors && insight.competitors.length > 0 ? (
                <ul className="space-y-1.5 text-sm">
                  {insight.competitors.slice(0, 3).map((c, i) => ( // Show top 3
                    <li key={i} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 text-red-400 shrink-0"><div className="i-ph:flag-duotone"/></div>
                      <span className="text-bolt-elements-textSecondary">{stripMarkdown(c.name)}</span>
                    </li>
                  ))}
                  {insight.competitors.length > 3 && (
                     <li className="text-xs text-bolt-elements-textTertiary pl-4">+ {insight.competitors.length - 3} more...</li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-bolt-elements-textTertiary italic">No competitors identified.</p>
              )}
              <p className="text-xs text-bolt-elements-textTertiary flex-grow pt-1">
                See Market tab for details.
              </p>
            </div>

            {/* Card: Trends - Condensed */}
            <div className="lg:col-span-1 bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md flex flex-col space-y-2">
              <div className="flex items-center mb-1">
                <div className="text-amber-500 mr-2 text-xl shrink-0">
                  <div className="i-ph:trend-up-duotone" />
                </div>
                <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Trends</h3>
              </div>
              {insight?.trends && insight.trends.length > 0 ? (
                <ul className="space-y-1.5 text-sm">
                  {insight.trends.slice(0, 3).map((t, i) => ( // Show top 3
                    <li key={i} className="flex items-center gap-1.5">
                       <div className="w-3 h-3 text-amber-500 shrink-0"><div className="i-ph:arrow-up-right"/></div>
                      <span className="text-bolt-elements-textSecondary">{stripMarkdown(t)}</span>
                    </li>
                  ))}
                  {insight.trends.length > 3 && (
                     <li className="text-xs text-bolt-elements-textTertiary pl-4">+ {insight.trends.length - 3} more...</li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-bolt-elements-textTertiary italic">No trends identified.</p>
              )}
              <p className="text-xs text-bolt-elements-textTertiary flex-grow pt-1">
                See Market tab for details.
              </p>
            </div>

             {/* Card: Recommendation Priority Overview */}
            <div className="lg:col-span-1 bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md flex flex-col space-y-2">
               <div className="flex items-center mb-1">
                 <div className="text-green-500 mr-2 text-xl shrink-0">
                   <div className="i-ph:chart-bar-duotone" />
                 </div>
                 <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Recommendations</h3>
               </div>
               {totalRecommendations > 0 ? (
                 <PriorityBarChart data={priorityChartData} />
               ) : (
                 <p className="text-sm text-bolt-elements-textTertiary italic">No recommendations generated.</p>
               )}
               <p className="text-xs text-bolt-elements-textTertiary flex-grow pt-1">
                  See Recommendations tab for details.
               </p>
             </div>
          </div>
        </TabsContent>

        <TabsContent value="market">
          <MarketTab insight={insight} />
        </TabsContent>

        <TabsContent value="competitors">
           <CompetitorTab competitors={$detailedCompetitors} />
        </TabsContent>

        <TabsContent value="revenue">
           <RevenueTab pricingRecommendations={$pricingRecommendations} />
        </TabsContent>

        <TabsContent value="roadmap">
           <RoadmapTab
             prioritizedFeatures={$prioritizedFeatures}
             roadmapSuggestions={$roadmapSuggestions}
           />
        </TabsContent>

        <TabsContent value="recommendations">
           <RecommendationsTab insight={insight} />
        </TabsContent>

        <TabsContent value="chat">
          <ProductCoachChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};