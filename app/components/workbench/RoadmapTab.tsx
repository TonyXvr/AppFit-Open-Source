import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import type { PrioritizedFeature, RoadmapSuggestion } from '~/types/product-coach';
import { stripMarkdown } from '~/components/workbench/ProductCoachPanel';

interface RoadmapTabProps {
  prioritizedFeatures: PrioritizedFeature[];
  roadmapSuggestions: RoadmapSuggestion[];
}

// Define quadrants
const QUADRANTS = {
  q1: { id: 'q1', name: 'Quick Wins', style: 'border-green-500/50', labelColor: 'text-green-400', desc: 'High Impact / Low Effort' },
  q2: { id: 'q2', name: 'Major Projects', style: 'border-blue-500/50', labelColor: 'text-blue-400', desc: 'High Impact / High Effort' },
  q3: { id: 'q3', name: 'Fill-ins', style: 'border-yellow-500/50', labelColor: 'text-yellow-400', desc: 'Low Impact / Low Effort' },
  q4: { id: 'q4', name: 'Money Pits', style: 'border-red-500/50', labelColor: 'text-red-400', desc: 'Low Impact / High Effort' },
};

type QuadrantId = keyof typeof QUADRANTS;

// Helper to assign feature to initial quadrant
const getInitialQuadrantId = (feature: PrioritizedFeature): QuadrantId => {
  if (feature.impact >= 6 && feature.effort <= 5) return 'q1';
  if (feature.impact >= 6 && feature.effort > 5) return 'q2';
  if (feature.impact < 6 && feature.effort <= 5) return 'q3';
  return 'q4';
};

export const RoadmapTab = ({ prioritizedFeatures, roadmapSuggestions }: RoadmapTabProps) => {
  // State to hold features organized by quadrant
  const [quadrantFeatures, setQuadrantFeatures] = useState<Record<QuadrantId, PrioritizedFeature[]>>({
    q1: [], q2: [], q3: [], q4: [],
  });

  // Effect to populate state when initial features change
  useEffect(() => {
    const initialQuadrants: Record<QuadrantId, PrioritizedFeature[]> = { q1: [], q2: [], q3: [], q4: [] };
    prioritizedFeatures.forEach(feature => {
      const quadrantId = getInitialQuadrantId(feature);
      initialQuadrants[quadrantId].push(feature);
    });
    setQuadrantFeatures(initialQuadrants);
  }, [prioritizedFeatures]);

  // Handle drag & drop logic
  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list or in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const startQuadrantId = source.droppableId as QuadrantId;
    const endQuadrantId = destination.droppableId as QuadrantId;

    setQuadrantFeatures(prev => {
      const startQuadrantFeatures = Array.from(prev[startQuadrantId]);
      const [movedFeature] = startQuadrantFeatures.splice(source.index, 1);

      const newQuadrants = { ...prev, [startQuadrantId]: startQuadrantFeatures };

      if (startQuadrantId === endQuadrantId) {
        // Moved within the same quadrant
        newQuadrants[startQuadrantId].splice(destination.index, 0, movedFeature);
      } else {
        // Moved to a different quadrant
        const endQuadrantFeatures = Array.from(prev[endQuadrantId]);
        endQuadrantFeatures.splice(destination.index, 0, movedFeature);
        newQuadrants[endQuadrantId] = endQuadrantFeatures;
      }
      return newQuadrants;
    });

    // TODO: Optionally persist the new quadrant assignment for the feature (e.g., update backend/store)
    console.log(`Moved feature ${draggableId} from ${startQuadrantId} to ${endQuadrantId}`);

  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-6">
        {/* Section 1: Feature Prioritization Matrix (Interactive) */}
        <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor">
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-1">Feature Prioritization (Impact vs. Effort)</h3>
          <p className="text-xs text-bolt-elements-textTertiary mb-4">Drag & drop features to adjust priorities.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(Object.keys(QUADRANTS) as QuadrantId[]).map((quadrantId) => {
              const quadrant = QUADRANTS[quadrantId];
              const featuresInQuadrant = quadrantFeatures[quadrantId];
              return (
                <Droppable key={quadrantId} droppableId={quadrantId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-bolt-elements-background-depth-2 rounded-md p-3 border min-h-[200px] ${quadrant.style} ${snapshot.isDraggingOver ? 'bg-blue-900/30' : ''}`}
                    >
                      <h4 className={`text-sm font-bold mb-1 ${quadrant.labelColor}`}>{quadrant.name}</h4>
                      <p className="text-[10px] font-medium text-bolt-elements-textTertiary mb-3">{quadrant.desc}</p>
                      
                      <div className="space-y-1.5">
                        {featuresInQuadrant.map((feature, index) => (
                          <Draggable key={feature.id} draggableId={feature.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-bolt-elements-background-depth-3 p-2 rounded text-xs border border-bolt-elements-borderColor/30 shadow-sm ${snapshot.isDragging ? 'shadow-lg opacity-80' : ''}`}
                                title={`Impact: ${feature.impact}/10, Effort: ${feature.effort}/10\n${feature.description}`}
                              >
                                <span className="font-medium text-bolt-elements-textSecondary block truncate">{feature.name}</span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                      {featuresInQuadrant.length === 0 && !snapshot.isDraggingOver && (
                         <p className="text-xs text-bolt-elements-textTertiary italic text-center pt-4">Drop features here</p>
                      )}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </div>

        {/* Section 2: Roadmap Suggestions */}
        <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor">
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-3">Roadmap Themes & Suggestions</h3>
          {roadmapSuggestions && roadmapSuggestions.length > 0 ? (
            <div className="space-y-4">
              {roadmapSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-bolt-elements-background-depth-2 p-3 rounded border border-bolt-elements-borderColor/50">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-bolt-elements-textPrimary">{suggestion.title}</h4>
                    <span className="text-xs font-semibold bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">
                      {suggestion.category}
                    </span>
                  </div>
                  <p className="text-sm text-bolt-elements-textSecondary">{stripMarkdown(suggestion.description)}</p>
                  {/* Optional: Add priority badge if available */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-bolt-elements-textTertiary italic">No specific roadmap suggestions available.</p>
          )}
        </div>
      </div>
    </DragDropContext>
  );
}; 