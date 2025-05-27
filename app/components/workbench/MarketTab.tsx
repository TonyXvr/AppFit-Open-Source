import { useStore } from '@nanostores/react';
import { stripMarkdown } from '~/components/workbench/ProductCoachPanel';
import { perplexityStore } from '~/lib/stores/perplexity';
import type { SimplifiedProductInsight } from '~/types/perplexity';
import type { MarketingChannelSuggestion } from '~/types/product-coach';

interface MarketTabProps {
  insight: SimplifiedProductInsight;
}

// Helper component for rendering SWOT lists
const SwotList = ({ title, items, icon, colorClass }: { title: string; items: string[]; icon: string; colorClass: string }) => {
  if (!items || items.length === 0) {
    return null; // Don't render if no items
  }
  return (
    <div>
      <h4 className={`flex items-center text-sm font-semibold mb-1.5 ${colorClass}`}>
        <div className={`w-4 h-4 mr-1.5 shrink-0 ${icon}`} />
        {title}
      </h4>
      <ul className="space-y-1 pl-1">
        {items.map((item, index) => {
          const cleanItem = stripMarkdown(item);
          if (!cleanItem) return null;
          return (
            <li key={index} className="flex items-start gap-1.5">
              <span className={`mt-1 w-1.5 h-1.5 rounded-full ${colorClass} opacity-70 shrink-0`}></span>
              <span className="text-xs text-bolt-elements-textSecondary">{cleanItem}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const MarketTab = ({ insight }: MarketTabProps) => {
  const audience = insight.audience || 'Not specified';
  const competitors = insight.competitors || [];
  const trends = insight.trends || [];
  const swot = insight.swot; // Get SWOT data
  const marketSize = insight.marketSize; // Get Market Size data
  // Get marketing suggestions from the store
  const $marketingSuggestions = useStore(perplexityStore.marketingChannelSuggestions);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 

      {/* Card: Target Audience Summary - Simplified */}
      <div className="md:col-span-2 bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md">
        <div className="flex items-center mb-2">
           <div className="text-blue-500 mr-2 text-xl shrink-0">
             <div className="i-ph:users-three-duotone" />
           </div>
           <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Target Audience</h3>
        </div>
        <p className="text-bolt-elements-textSecondary leading-relaxed">
          {stripMarkdown(audience)}
        </p>
        <p className="text-xs text-bolt-elements-textTertiary mt-2">
          Understanding your audience helps tailor product and marketing strategy.
        </p>
      </div>

      {/* Card: Competitors - Simplified List */}
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md">
        <div className="flex items-center mb-3">
           <div className="text-red-500 mr-2 text-xl shrink-0">
             <div className="i-ph:strategy-duotone" />
           </div>
           <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Potential Competitors</h3>
        </div>
        
        {competitors.length > 0 ? (
          <ul className="space-y-2">
            {competitors.map((competitor, index) => {
              const cleanName = stripMarkdown(competitor.name || '');
              const differentiator = stripMarkdown(competitor.differentiator || '');
              if (!cleanName) return null;
              
              return (
                <li 
                  key={index} 
                  className="bg-bolt-elements-background-depth-2 p-2.5 rounded-md border border-bolt-elements-borderColor/50"
                >
                  <div className="flex items-start gap-2">
                    <div className="text-red-400 shrink-0 mt-0.5 w-4 h-4">
                      <div className="i-ph:flag-duotone" />
                    </div>
                    <div>
                      <div className="font-medium text-bolt-elements-textPrimary">
                        {cleanName}
                      </div>
                      {differentiator && (
                        <p className="text-xs text-bolt-elements-textSecondary mt-0.5">
                           {differentiator}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-bolt-elements-textTertiary italic px-2">No specific competitors identified.</p>
        )}
        <p className="text-xs text-bolt-elements-textTertiary mt-3 px-2">
          Analyzing competition helps identify market gaps.
        </p>
      </div>

      {/* Card: Market Trends - Simplified List */}
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md">
        <div className="flex items-center mb-3">
          <div className="text-amber-500 mr-2 text-xl shrink-0">
            <div className="i-ph:trend-up-duotone" />
          </div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Relevant Trends</h3>
        </div>
        
        {trends.length > 0 ? (
           <ul className="space-y-2">
            {trends.map((trend, index) => {
              const cleanTrend = stripMarkdown(trend);
              if (!cleanTrend) return null;
              
              return (
                <li 
                  key={index} 
                  className="bg-bolt-elements-background-depth-2 p-2.5 rounded-md border border-bolt-elements-borderColor/50"
                >
                  <div className="flex gap-2 items-start">
                    <div className="text-amber-500 mt-0.5 shrink-0 w-4 h-4">
                      <div className="i-ph:arrow-up-right" />
                    </div>
                    <p className="text-sm text-bolt-elements-textSecondary">{cleanTrend}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-bolt-elements-textTertiary italic px-2">No specific market trends identified.</p>
        )}
         <p className="text-xs text-bolt-elements-textTertiary mt-3 px-2">
          Staying aligned with trends improves market fit.
        </p>
      </div>
      
      {/* Card: Marketing Channel Suggestions - Added */}
      <div className="md:col-span-2 bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md">
        <div className="flex items-center mb-3">
           <div className="text-indigo-500 mr-2 text-xl shrink-0">
             <div className="i-ph:megaphone-duotone" />
           </div>
           <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Marketing Channel Suggestions</h3>
        </div>
        
        {$marketingSuggestions && $marketingSuggestions.length > 0 ? (
          <div className="space-y-4">
            {$marketingSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-bolt-elements-background-depth-2 p-3 rounded border border-bolt-elements-borderColor/50">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="font-medium text-bolt-elements-textPrimary">{suggestion.channel}</h4>
                  {suggestion.roiEstimate && (
                    <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded whitespace-nowrap">
                      ROI: {suggestion.roiEstimate}
                    </span>
                  )}
                </div>
                <p className="text-sm text-bolt-elements-textSecondary mb-2">{stripMarkdown(suggestion.rationale)}</p>
                {suggestion.keyActions && suggestion.keyActions.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 pl-2 mt-1">
                    {suggestion.keyActions.map((action, aIndex) => (
                      <li key={aIndex} className="text-xs text-bolt-elements-textSecondary">
                        {stripMarkdown(action)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-bolt-elements-textTertiary italic px-2">No specific marketing channel suggestions available.</p>
        )}
      </div>

      {/* Card: SWOT Analysis - Added */}
      {swot && (
        <div className="md:col-span-2 bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md">
          <div className="flex items-center mb-3">
            <div className="text-purple-500 mr-2 text-xl shrink-0">
              <div className="i-ph:puzzle-piece-duotone" />
            </div>
            <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">SWOT Analysis</h3>
          </div>
          
          {(swot.strengths?.length || swot.weaknesses?.length || swot.opportunities?.length || swot.threats?.length) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <SwotList title="Strengths" items={swot.strengths} icon="i-ph:thumbs-up-duotone" colorClass="text-green-500" />
              <SwotList title="Weaknesses" items={swot.weaknesses} icon="i-ph:thumbs-down-duotone" colorClass="text-red-500" />
              <SwotList title="Opportunities" items={swot.opportunities} icon="i-ph:sparkle-duotone" colorClass="text-blue-500" />
              <SwotList title="Threats" items={swot.threats} icon="i-ph:warning-duotone" colorClass="text-orange-500" />
            </div>
          ) : (
            <p className="text-sm text-bolt-elements-textTertiary italic px-2">No SWOT analysis data available.</p>
          )}
          <p className="text-xs text-bolt-elements-textTertiary mt-3 px-2">
            Understanding SWOT informs strategic decisions.
          </p>
        </div>
      )}

      {/* Card: Market Size (TAM/SAM/SOM) - Added */}
      {marketSize && (marketSize.tam || marketSize.sam || marketSize.som) && (
        <div className="md:col-span-2 bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md">
          <div className="flex items-center mb-3">
            <div className="text-teal-500 mr-2 text-xl shrink-0">
              <div className="i-ph:chart-pie-slice-duotone" />
            </div>
            <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Market Size Estimation</h3>
          </div>
          
          <div className="space-y-2">
            {marketSize.tam && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-xs text-teal-600 bg-teal-500/10 px-1.5 py-0.5 rounded mt-0.5">TAM</span>
                <p className="text-sm text-bolt-elements-textSecondary">{stripMarkdown(marketSize.tam)}</p>
              </div>
            )}
            {marketSize.sam && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-xs text-sky-600 bg-sky-500/10 px-1.5 py-0.5 rounded mt-0.5">SAM</span>
                <p className="text-sm text-bolt-elements-textSecondary">{stripMarkdown(marketSize.sam)}</p>
              </div>
            )}
            {marketSize.som && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-xs text-indigo-600 bg-indigo-500/10 px-1.5 py-0.5 rounded mt-0.5">SOM</span>
                <p className="text-sm text-bolt-elements-textSecondary">{stripMarkdown(marketSize.som)}</p>
              </div>
            )}
          </div>
          <p className="text-xs text-bolt-elements-textTertiary mt-3 px-2">
            TAM: Total Addressable Market, SAM: Serviceable Available Market, SOM: Serviceable Obtainable Market.
          </p>
        </div>
      )}

    </div>
  );
}; 