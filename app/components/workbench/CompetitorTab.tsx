import React from 'react';
import type { CompetitorAnalysis } from '~/types/product-coach';
import { stripMarkdown } from '~/components/workbench/ProductCoachPanel'; // Import stripMarkdown

interface CompetitorTabProps {
  competitors: CompetitorAnalysis[];
  // TODO: Add userProjectData for comparison later
}

// Helper to display attributes as badges
const AttributeBadges = ({ attributes }: { attributes: Record<string, number> | undefined }) => {
  if (!attributes || Object.keys(attributes).length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
      {Object.entries(attributes).map(([key, value]) => (
        <span 
          key={key} 
          className="text-xs font-medium bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20"
          title={`Score: ${value}/10`}
        >
          {key}: {value}/10
        </span>
      ))}
    </div>
  );
};

export const CompetitorTab = ({ competitors }: CompetitorTabProps) => {

  return (
    <div className="space-y-4"> {/* Changed to space-y-4, removed outer space-y-6 */} 
      
      {/* Removed Chart Section */}
      
      {/* Section: Competitor Details (Enhanced) */}
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor">
        <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-3">Competitor Analysis</h3>
        {competitors && competitors.length > 0 ? (
          <div className="space-y-5"> {/* Increased spacing between competitors */}
            {competitors.map((competitor, index) => (
              <div key={index} className="bg-bolt-elements-background-depth-2 p-4 rounded border border-bolt-elements-borderColor/50">
                <h4 className="text-base font-semibold text-bolt-elements-textPrimary mb-1">{competitor.name}</h4>
                
                {/* Display Description if available */}
                {competitor.description && (
                  <p className="text-sm text-bolt-elements-textSecondary mb-2">
                    {stripMarkdown(competitor.description)}
                  </p>
                )}
                
                {/* Display Attributes */} 
                <AttributeBadges attributes={competitor.attributes} />
                
                {/* Display Features */}
                {competitor.features && competitor.features.length > 0 && (
                   <div>
                     <h5 className="text-xs font-semibold text-bolt-elements-textTertiary uppercase tracking-wide mt-3 mb-1.5">Key Features:</h5>
                     <ul className="list-disc list-inside space-y-1 pl-2">
                      {competitor.features.map((feature, fIndex) => (
                        <li key={fIndex} className="text-sm text-bolt-elements-textSecondary">
                          {stripMarkdown(feature)} 
                        </li>
                      ))}
                    </ul>
                   </div>
                )}
                 {!competitor.features || competitor.features.length === 0 && (
                  <p className="text-sm text-bolt-elements-textTertiary italic mt-2">No specific features listed.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-bolt-elements-textTertiary italic">No competitor data available.</p>
        )}
      </div>
    </div>
  );
}; 