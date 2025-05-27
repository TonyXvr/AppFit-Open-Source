import { useState } from 'react';
import { stripMarkdown } from '~/components/workbench/ProductCoachPanel';
import type { SimplifiedProductInsight } from '~/types/perplexity';

interface RecommendationsTabProps {
  insight: SimplifiedProductInsight;
}

// Priority type based on the recommendation priority values
type Priority = 'high' | 'medium' | 'low';

export const RecommendationsTab = ({ insight }: RecommendationsTabProps) => {
  const [filterPriority, setFilterPriority] = useState<'all' | Priority>('all');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  
  // Recommendations might be undefined if the API call failed partially or returned invalid data
  const recommendations = insight.recommendations || [];

  // Calculate the counts for each priority
  const priorityCounts = {
    high: recommendations.filter(r => r.priority === 'high').length,
    medium: recommendations.filter(r => r.priority === 'medium').length,
    low: recommendations.filter(r => r.priority === 'low').length,
  };

  // Total recommendations count
  const totalRecommendations = recommendations.length;
  
  // Chart data for priority distribution
  const chartData = [
    { name: 'High', count: priorityCounts.high, color: '#ef4444' }, // Red-500 (Keep consistent)
    { name: 'Medium', count: priorityCounts.medium, color: '#eab308' }, // Yellow-500 (Keep consistent)
    { name: 'Low', count: priorityCounts.low, color: '#22c55e' }, // Green-500 (Keep consistent)
  ];

  // Filter recommendations based on selected priority
  const filteredRecommendations = recommendations.filter(rec => 
    filterPriority === 'all' || rec.priority === filterPriority
  );

  // Handle task completion toggle using title
  const toggleTaskCompletion = (taskTitle: string) => {
    setCompletedTasks(prev => {
      const newCompletedTasks = new Set(prev);
      if (newCompletedTasks.has(taskTitle)) {
        newCompletedTasks.delete(taskTitle);
      } else {
        newCompletedTasks.add(taskTitle);
      }
      return newCompletedTasks;
    });
  };

  // Helper to get priority icon and color
  const getPriorityVisuals = (priority: Priority) => {
    switch (priority) {
      case 'high': return { icon: 'i-ph:warning-octagon-duotone', color: 'text-red-500', borderColor: 'border-red-500/30' };
      case 'medium': return { icon: 'i-ph:warning-duotone', color: 'text-amber-500', borderColor: 'border-amber-500/30' };
      case 'low': return { icon: 'i-ph:info-duotone', color: 'text-blue-500', borderColor: 'border-blue-500/30' };
      default: return { icon: 'i-ph:question', color: 'text-gray-500', borderColor: 'border-gray-500/30' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Recommendation Priorities Summary Card - Simplified */}
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor">
        <div className="flex items-center mb-3">
          <div className="text-blue-500 mr-2 text-xl shrink-0">
            <div className="i-ph:chart-bar" />
          </div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Recommendation Priorities</h3>
        </div>
        
        {/* Simplified Priority Breakdown - more visual */}
        {totalRecommendations > 0 ? (
          <div className="grid grid-cols-3 gap-3 text-center">
            {[ 'high', 'medium', 'low' ].map(p => {
              const priority = p as Priority;
              const count = priorityCounts[priority];
              const visuals = getPriorityVisuals(priority);
              return (
                <div key={priority} className={`bg-bolt-elements-background-depth-2 rounded-md p-3 border ${count > 0 ? visuals.borderColor : 'border-transparent'}`}>
                  <div className={`${visuals.color} mx-auto w-6 h-6 mb-1`}>
                    <div className={visuals.icon} />
                  </div>
                  <div className={`text-lg font-bold ${count > 0 ? 'text-bolt-elements-textPrimary' : 'text-bolt-elements-textTertiary'}`}>{count}</div>
                  <div className="text-xs text-bolt-elements-textSecondary capitalize">{priority}</div>
                </div>
              );
            })}
          </div>
        ) : (
           <p className="text-sm text-bolt-elements-textTertiary text-center py-2">No recommendations available to prioritize.</p>
        )}
      </div>
      
      {/* Recommendation List Section */}
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-purple-500 mr-2 text-xl shrink-0">
              <div className="i-ph:list-checks" />
            </div>
            <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Actionable Recommendations</h3>
          </div>
          
          {/* Priority Filter Buttons - slightly smaller */}
          {totalRecommendations > 0 && (
            <div className="flex space-x-1.5">
              <button 
                onClick={() => setFilterPriority('all')}
                className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                  filterPriority === 'all' 
                    ? 'bg-gray-600 text-white font-medium' 
                    : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-3'
                }`}
              >
                All ({totalRecommendations})
              </button>
              {[ 'high', 'medium', 'low' ].map(p => {
                const priority = p as Priority;
                const count = priorityCounts[priority];
                const visuals = getPriorityVisuals(priority);
                let activeBg = 'bg-gray-600';
                if (priority === 'high') activeBg = 'bg-red-500';
                if (priority === 'medium') activeBg = 'bg-amber-500';
                if (priority === 'low') activeBg = 'bg-blue-500';
                
                return (
                  <button 
                    key={priority}
                    onClick={() => setFilterPriority(priority)}
                    disabled={count === 0}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all flex items-center gap-1 ${filterPriority === priority ? `${activeBg} text-white font-medium` : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-3 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                  >
                     <div className={`w-3 h-3 ${filterPriority === priority ? 'text-white' : visuals.color}`}><div className={visuals.icon} /></div>
                     <span>{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Recommendation Cards */}
        {filteredRecommendations.length > 0 ? (
          <div className="space-y-3">
            {filteredRecommendations.map((recommendation, index) => {
              // Use title for key and completion check
              const taskTitle = recommendation.title;
              const isCompleted = completedTasks.has(taskTitle);
              const visuals = getPriorityVisuals(recommendation.priority);
              
              // Determine the background color based on priority and completion status
              const bgColor = isCompleted 
                ? 'bg-green-500/10 border-green-500/20' 
                : `bg-bolt-elements-background-depth-2 ${visuals.borderColor}`;
              
              return (
                <div 
                  key={taskTitle} // Use title as key
                  className={`p-3 rounded-md border transition-all ${bgColor} ${
                    isCompleted ? 'opacity-60' : 'hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox on left */}
                    <div className="shrink-0 pt-0.5">
                      <input
                        type="checkbox"
                        id={`rec-${index}`} // Keep id unique for label association if needed
                        checked={isCompleted}
                        onChange={() => toggleTaskCompletion(taskTitle)}
                        className="w-4 h-4 rounded border-gray-400 cursor-pointer focus:ring-blue-500 text-blue-600 bg-bolt-elements-background"
                      />
                    </div>
                    
                    {/* Content Area */}
                    <div className="flex-1">
                      {/* Title and Priority Icon */}
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium text-bolt-elements-textPrimary leading-snug ${
                          isCompleted ? 'line-through' : ''
                        }`}>
                          {stripMarkdown(recommendation.title)}
                        </h4>
                        <div className={`w-4 h-4 shrink-0 ${visuals.color}`} title={`Priority: ${recommendation.priority}`}>
                          <div className={visuals.icon} />
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className={`text-sm text-bolt-elements-textSecondary ${
                        isCompleted ? 'line-through opacity-80' : ''
                      }`}>
                        {stripMarkdown(recommendation.description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-400 mx-auto w-12 h-12 mb-2">
              <div className="i-ph:list-checks-duotone" />
            </div>
            <h4 className="text-md font-medium text-bolt-elements-textPrimary">No Recommendations Match Filter</h4>
            <p className="mt-1 text-sm text-bolt-elements-textSecondary">
              {totalRecommendations > 0 
                ? 'Try selecting a different priority filter.' 
                : 'No recommendations were generated in the analysis.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 