import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore } from '~/lib/stores/projectContext';
import { workbenchStore } from '~/lib/stores/workbench';

interface ContextualHelpProps {
  // Add any props needed
}

interface HelpItem {
  id: string;
  title: string;
  description: string;
  solution?: string;
  relevance: number; // 0-100 score for how relevant this is to the current context
  type: 'error' | 'warning' | 'tip' | 'info';
}

export const ContextualHelp: React.FC<ContextualHelpProps> = () => {
  const [helpItems, setHelpItems] = useState<HelpItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const projectContext = useStore(projectContextStore);
  const files = useStore(workbenchStore.files);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  
  // Simulate getting the current file from the editor
  useEffect(() => {
    // In a real implementation, this would come from the editor state
    const fileKeys = Object.keys(files);
    if (fileKeys.length > 0) {
      setCurrentFile(fileKeys[0]);
    }
  }, [files]);
  
  // Generate contextual help based on project context and current file
  useEffect(() => {
    if (!currentFile || projectContext.summary.technologies.length === 0) return;
    
    setIsAnalyzing(true);
    
    // In a real implementation, we would analyze the current file and project
    // to generate contextual help items
    
    // For now, we'll create sample items based on file extension and technologies
    const fileExtension = currentFile.split('.').pop()?.toLowerCase();
    const generatedItems: HelpItem[] = [];
    
    // Common errors and solutions
    if (fileExtension === 'tsx' || fileExtension === 'jsx') {
      generatedItems.push(
        {
          id: 'react-error-1',
          title: 'React component must return a single root element',
          description: 'React components need to return a single parent element that wraps all other elements.',
          solution: 'Wrap your component\'s return value in a single parent element like a <div> or use a React Fragment (<> ... </>) to avoid adding extra nodes to the DOM.',
          relevance: 80,
          type: 'error'
        },
        {
          id: 'react-error-2',
          title: 'Missing dependency in useEffect',
          description: 'When using variables from component scope in useEffect, they should be included in the dependency array.',
          solution: 'Add all variables used inside the useEffect callback to the dependency array, or consider moving the variable inside the effect.',
          relevance: 75,
          type: 'warning'
        }
      );
    }
    
    if (fileExtension === 'ts' || fileExtension === 'tsx') {
      generatedItems.push(
        {
          id: 'ts-error-1',
          title: 'Type errors in TypeScript',
          description: 'TypeScript requires variables to match their declared types.',
          solution: 'Check that your variable assignments match the declared types. Use type assertions (as Type) when necessary, but prefer proper typing.',
          relevance: 85,
          type: 'error'
        },
        {
          id: 'ts-tip-1',
          title: 'Use TypeScript utility types',
          description: 'TypeScript provides built-in utility types to make common type transformations easier.',
          solution: 'Consider using utility types like Partial<T>, Required<T>, Pick<T, K>, Omit<T, K>, etc. to transform existing types instead of creating new ones from scratch.',
          relevance: 70,
          type: 'tip'
        }
      );
    }
    
    // Project-specific help based on technologies
    if (projectContext.summary.technologies.includes('React')) {
      generatedItems.push(
        {
          id: 'react-tip-1',
          title: 'Use React DevTools for debugging',
          description: 'React DevTools browser extension helps inspect component props, state, and hierarchy.',
          solution: 'Install React DevTools for your browser to debug component issues more effectively.',
          relevance: 90,
          type: 'tip'
        },
        {
          id: 'react-info-1',
          title: 'Component re-rendering too often?',
          description: 'Unnecessary re-renders can impact performance in React applications.',
          solution: 'Use React.memo for functional components, implement shouldComponentUpdate for class components, or use useMemo and useCallback hooks to optimize rendering.',
          relevance: 65,
          type: 'info'
        }
      );
    }
    
    // General development tips
    generatedItems.push(
      {
        id: 'general-tip-1',
        title: 'Use console.log for quick debugging',
        description: 'Temporarily add console.log statements to check variable values during execution.',
        solution: 'Add console.log(variable) at key points in your code to see values in the browser console. Remember to remove them before production.',
        relevance: 85,
        type: 'tip'
      },
      {
        id: 'general-tip-2',
        title: 'Break down complex functions',
        description: 'Large, complex functions are harder to understand and maintain.',
        solution: 'Split large functions into smaller, focused functions that each do one thing well. This improves readability and testability.',
        relevance: 75,
        type: 'tip'
      }
    );
    
    // Sort by relevance
    generatedItems.sort((a, b) => b.relevance - a.relevance);
    
    // Simulate analysis time
    setTimeout(() => {
      setHelpItems(generatedItems);
      setIsAnalyzing(false);
    }, 1000);
  }, [currentFile, projectContext, files]);
  
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  // Group items by type
  const errorItems = helpItems.filter(item => item.type === 'error');
  const warningItems = helpItems.filter(item => item.type === 'warning');
  const tipItems = helpItems.filter(item => item.type === 'tip');
  const infoItems = helpItems.filter(item => item.type === 'info');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
          <div className="i-ph:lifebuoy text-green-500 mr-2" />
          Contextual Help
        </h3>
        
        <button
          className={`text-xs px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors flex items-center ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={() => {
            setIsAnalyzing(true);
            // In a real implementation, this would re-analyze the current context
            setTimeout(() => setIsAnalyzing(false), 1000);
          }}
          disabled={isAnalyzing}
        >
          <div className={`i-ph:arrows-clockwise mr-1.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>
      
      {isAnalyzing ? (
        <div className="bg-bolt-elements-background-depth-1 rounded-lg p-8 flex flex-col items-center justify-center">
          <div className="i-ph:spinner animate-spin text-3xl text-blue-500 mb-3" />
          <p className="text-bolt-elements-textSecondary">Analyzing your code for contextual help...</p>
          <p className="text-xs text-bolt-elements-textTertiary mt-2">Looking for common issues and helpful tips</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentFile && (
            <div className="bg-bolt-elements-background-depth-1 rounded-lg p-3 text-sm">
              <div className="flex items-center text-bolt-elements-textSecondary">
                <div className="i-ph:file-code text-amber-500 mr-2" />
                <span>Current file: </span>
                <span className="font-mono ml-1 text-bolt-elements-textPrimary">{currentFile.split('/').pop()}</span>
              </div>
            </div>
          )}
          
          {helpItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="i-ph:check-circle text-4xl mx-auto mb-2 text-green-500" />
              <p className="text-bolt-elements-textSecondary">No issues detected!</p>
              <p className="text-sm text-bolt-elements-textTertiary mt-1">Your code looks good. Keep up the great work!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Errors */}
              {errorItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2 flex items-center">
                    <div className="i-ph:warning-circle text-red-500 mr-1.5" />
                    Potential Errors
                  </h4>
                  <div className="space-y-2">
                    {errorItems.map(item => (
                      <motion.div
                        key={item.id}
                        className="bg-red-500/5 border border-red-500/20 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="p-3 cursor-pointer"
                          onClick={() => toggleExpanded(item.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="i-ph:warning-circle text-red-500 mr-2" />
                              <h5 className="font-medium text-bolt-elements-textPrimary">{item.title}</h5>
                            </div>
                            <div className={`i-ph:caret-down transition-transform ${expandedItems.has(item.id) ? 'rotate-180' : ''}`} />
                          </div>
                          <p className="text-sm text-bolt-elements-textSecondary mt-1">{item.description}</p>
                        </div>
                        
                        {expandedItems.has(item.id) && item.solution && (
                          <div className="border-t border-red-500/10 bg-red-500/5 p-3">
                            <div className="text-sm">
                              <div className="font-medium text-bolt-elements-textPrimary mb-1">Solution:</div>
                              <p className="text-bolt-elements-textSecondary">{item.solution}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Warnings */}
              {warningItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2 flex items-center">
                    <div className="i-ph:warning text-amber-500 mr-1.5" />
                    Warnings
                  </h4>
                  <div className="space-y-2">
                    {warningItems.map(item => (
                      <motion.div
                        key={item.id}
                        className="bg-amber-500/5 border border-amber-500/20 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="p-3 cursor-pointer"
                          onClick={() => toggleExpanded(item.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="i-ph:warning text-amber-500 mr-2" />
                              <h5 className="font-medium text-bolt-elements-textPrimary">{item.title}</h5>
                            </div>
                            <div className={`i-ph:caret-down transition-transform ${expandedItems.has(item.id) ? 'rotate-180' : ''}`} />
                          </div>
                          <p className="text-sm text-bolt-elements-textSecondary mt-1">{item.description}</p>
                        </div>
                        
                        {expandedItems.has(item.id) && item.solution && (
                          <div className="border-t border-amber-500/10 bg-amber-500/5 p-3">
                            <div className="text-sm">
                              <div className="font-medium text-bolt-elements-textPrimary mb-1">Solution:</div>
                              <p className="text-bolt-elements-textSecondary">{item.solution}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tips */}
              {tipItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2 flex items-center">
                    <div className="i-ph:lightbulb text-green-500 mr-1.5" />
                    Helpful Tips
                  </h4>
                  <div className="space-y-2">
                    {tipItems.map(item => (
                      <motion.div
                        key={item.id}
                        className="bg-green-500/5 border border-green-500/20 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="p-3 cursor-pointer"
                          onClick={() => toggleExpanded(item.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="i-ph:lightbulb text-green-500 mr-2" />
                              <h5 className="font-medium text-bolt-elements-textPrimary">{item.title}</h5>
                            </div>
                            <div className={`i-ph:caret-down transition-transform ${expandedItems.has(item.id) ? 'rotate-180' : ''}`} />
                          </div>
                          <p className="text-sm text-bolt-elements-textSecondary mt-1">{item.description}</p>
                        </div>
                        
                        {expandedItems.has(item.id) && item.solution && (
                          <div className="border-t border-green-500/10 bg-green-500/5 p-3">
                            <div className="text-sm">
                              <div className="font-medium text-bolt-elements-textPrimary mb-1">Implementation:</div>
                              <p className="text-bolt-elements-textSecondary">{item.solution}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Info */}
              {infoItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2 flex items-center">
                    <div className="i-ph:info text-blue-500 mr-1.5" />
                    Information
                  </h4>
                  <div className="space-y-2">
                    {infoItems.map(item => (
                      <motion.div
                        key={item.id}
                        className="bg-blue-500/5 border border-blue-500/20 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="p-3 cursor-pointer"
                          onClick={() => toggleExpanded(item.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="i-ph:info text-blue-500 mr-2" />
                              <h5 className="font-medium text-bolt-elements-textPrimary">{item.title}</h5>
                            </div>
                            <div className={`i-ph:caret-down transition-transform ${expandedItems.has(item.id) ? 'rotate-180' : ''}`} />
                          </div>
                          <p className="text-sm text-bolt-elements-textSecondary mt-1">{item.description}</p>
                        </div>
                        
                        {expandedItems.has(item.id) && item.solution && (
                          <div className="border-t border-blue-500/10 bg-blue-500/5 p-3">
                            <div className="text-sm">
                              <div className="font-medium text-bolt-elements-textPrimary mb-1">Details:</div>
                              <p className="text-bolt-elements-textSecondary">{item.solution}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
