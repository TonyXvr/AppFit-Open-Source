import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore } from '~/lib/stores/projectContext';
import type { ProjectInsight } from '~/lib/stores/projectContext';
import { AILearningService } from '~/lib/services/aiLearningService';

interface ProjectInsightsProps {
  // Add any props needed
}

export const ProjectInsights: React.FC<ProjectInsightsProps> = () => {
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const projectContext = useStore(projectContextStore);

  // Generate insights when component mounts if we don't have any
  useEffect(() => {
    if (projectContext.insights.length === 0) {
      setIsLoading(true);
      AILearningService.generateProjectInsights()
        .then((insights) => {
          // The service updates the store directly
          console.log('Generated project insights:', insights.length);
        })
        .catch(error => {
          console.error('Error generating project insights:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const toggleExpanded = (insightId: string) => {
    setExpandedInsights(prev => {
      const newSet = new Set(prev);
      if (newSet.has(insightId)) {
        newSet.delete(insightId);
      } else {
        newSet.add(insightId);
      }
      return newSet;
    });
  };

  // Group insights by type
  const insightsByType: Record<string, ProjectInsight[]> = {
    pattern: [],
    tip: [],
    warning: [],
    improvement: []
  };

  projectContext.insights.forEach(insight => {
    insightsByType[insight.type].push(insight);
  });

  // Get type display name and icon
  const getTypeInfo = (type: string): { name: string; icon: string; color: string } => {
    switch (type) {
      case 'pattern':
        return { name: 'Code Patterns', icon: 'i-ph:code', color: 'text-blue-500' };
      case 'tip':
        return { name: 'Tips', icon: 'i-ph:lightbulb', color: 'text-green-500' };
      case 'warning':
        return { name: 'Warnings', icon: 'i-ph:warning', color: 'text-amber-500' };
      case 'improvement':
        return { name: 'Improvements', icon: 'i-ph:trend-up', color: 'text-purple-500' };
      default:
        return { name: type, icon: 'i-ph:info', color: 'text-blue-500' };
    }
  };

  // Get impact color
  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-amber-500 bg-amber-500/10';
      case 'low':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
          <div className="i-ph:lightbulb text-amber-500 mr-2" />
          Project Insights
        </h3>
      </div>

      {/* Insights by type */}
      {Object.entries(insightsByType).map(([type, insights]) => {
        if (insights.length === 0) return null;

        const { name, icon, color } = getTypeInfo(type);

        return (
          <div key={type} className="mb-6">
            <h4 className="text-xs font-medium text-bolt-elements-textTertiary uppercase tracking-wider mb-2 flex items-center">
              <div className={`${icon} ${color} mr-1.5`} />
              {name}
            </h4>

            <div className="space-y-3">
              {insights.map(insight => (
                <motion.div
                  key={insight.id}
                  className={`bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor overflow-hidden ${
                    type === 'warning' ? 'border-amber-500/20' :
                    type === 'improvement' ? 'border-purple-500/20' :
                    type === 'tip' ? 'border-green-500/20' :
                    'border-blue-500/20'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => toggleExpanded(insight.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`${getTypeInfo(insight.type).icon} ${getTypeInfo(insight.type).color} mr-2`} />
                        <h5 className="font-medium text-bolt-elements-textPrimary">{insight.title}</h5>
                      </div>

                      <div className="flex items-center">
                        <div className={`text-xs px-2 py-0.5 rounded mr-2 ${getImpactColor(insight.impact)}`}>
                          {insight.impact} impact
                        </div>
                        <div className={`i-ph:caret-down transition-transform ${expandedInsights.has(insight.id) ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    <p className="text-sm text-bolt-elements-textSecondary mt-1">{insight.description}</p>
                  </div>

                  {expandedInsights.has(insight.id) && (
                    <div className={`border-t ${
                      type === 'warning' ? 'border-amber-500/20 bg-amber-500/5' :
                      type === 'improvement' ? 'border-purple-500/20 bg-purple-500/5' :
                      type === 'tip' ? 'border-green-500/20 bg-green-500/5' :
                      'border-blue-500/20 bg-blue-500/5'
                    } p-4`}>
                      <div className="space-y-4">
                        {insight.solution && (
                          <div>
                            <h6 className="text-xs font-medium text-bolt-elements-textTertiary mb-2">Solution</h6>
                            <p className="text-sm text-bolt-elements-textSecondary">{insight.solution}</p>
                          </div>
                        )}

                        {insight.relatedFiles.length > 0 && (
                          <div>
                            <h6 className="text-xs font-medium text-bolt-elements-textTertiary mb-2">Related Files</h6>
                            <div className="flex flex-wrap gap-2">
                              {insight.relatedFiles.map((file, index) => (
                                <div key={index} className="bg-bolt-elements-background-depth-2 px-2 py-1 rounded flex items-center">
                                  <div className="i-ph:file-code text-amber-500 mr-1" />
                                  <span className="text-xs text-bolt-elements-textSecondary">{file.split('/').pop()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {projectContext.insights.length === 0 && (
        <div className="bg-bolt-elements-background-depth-1 rounded-lg p-8 text-center">
          {isLoading ? (
            <>
              <div className="i-ph:spinner animate-spin text-5xl mx-auto mb-4 text-amber-500" />
              <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">Discovering Insights...</h3>
              <p className="text-bolt-elements-textSecondary">
                We're analyzing your code to find patterns, tips, and improvement opportunities.
                <br />
                This may take a moment as we examine your project structure.
              </p>
            </>
          ) : (
            <>
              <div className="i-ph:lightbulb text-5xl mx-auto mb-4 text-bolt-elements-textTertiary" />
              <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">No Insights Available Yet</h3>
              <p className="text-bolt-elements-textSecondary">
                We're analyzing your project to generate helpful insights.
                <br />
                Check back soon or refresh the project context.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors"
                onClick={() => {
                  setIsLoading(true);
                  console.log('Finding insights now...');
                  AILearningService.generateProjectInsights()
                    .then((insights) => {
                      console.log('Generated project insights:', insights.length);
                    })
                    .catch(error => {
                      console.error('Error generating project insights:', error);
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }}
              >
                Find Insights Now
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
