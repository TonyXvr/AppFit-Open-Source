import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import { perplexityStore } from '~/lib/stores/perplexity';
import { description } from '~/lib/persistence';
import { ProductCoachPanel } from './ProductCoachPanel';
import type { ProductInsight, SimplifiedProductInsight } from '~/types/perplexity';

interface ProductCoachProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

export const ProductCoach = ({ chatStarted, isStreaming }: ProductCoachProps) => {
  const files = useStore(workbenchStore.files);
  // Assuming insights from the store *will be* SimplifiedProductInsight after store update
  const insights = useStore(perplexityStore.insights) as unknown as Record<string, SimplifiedProductInsight>; 
  const isLoading = useStore(perplexityStore.isLoading);
  const error = useStore(perplexityStore.error);
  const lastAnalyzedAt = useStore(perplexityStore.lastAnalyzedAt);
  const currentChatDescription = useStore(description);
  
  const [currentInsight, setCurrentInsight] = useState<SimplifiedProductInsight | undefined>(undefined);
  
  useEffect(() => {
    const insightKeys = Object.keys(insights);
    if (insightKeys.length > 0) {
      setCurrentInsight(insights[insightKeys[0]]); // No assertion needed now
    } else {
      setCurrentInsight(undefined);
    }
  }, [insights]);
  
  const handleAnalyzeProject = useCallback(() => {
    const lastUserMessage = undefined;
    
    const context = {
        description: currentChatDescription,
        recentFocus: lastUserMessage 
    };

    const projectData = {
      files: Object.entries(files).map(([path, content]) => ({
        path,
        content: typeof content === 'string' ? content : '',
      })),
      timestamp: new Date().toISOString(),
    };
    perplexityStore.fetchInsights(projectData, context);
  }, [files, currentChatDescription]);
  
  const getLastAnalyzedText = useCallback(() => {
    if (!lastAnalyzedAt) return '';
    const now = Date.now();
    const diff = now - lastAnalyzedAt;
    if (diff < 60 * 1000) return 'just now';
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }, [lastAnalyzedAt]);
  
  return (
    <motion.div
      className="flex flex-col h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {currentInsight && lastAnalyzedAt && (
        <div className="bg-bolt-elements-background-depth-1 border-b border-bolt-elements-borderColor px-4 py-2 flex justify-between items-center">
          <div className="text-sm text-bolt-elements-textTertiary">
            Last analyzed: {getLastAnalyzedText()}
          </div>
          <button 
            className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded transition-colors"
            onClick={handleAnalyzeProject}
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>
      )}
      
      <ProductCoachPanel
        insight={currentInsight}
        isLoading={isLoading}
        error={error}
        onAnalyzeProject={handleAnalyzeProject}
      />
    </motion.div>
  );
}; 