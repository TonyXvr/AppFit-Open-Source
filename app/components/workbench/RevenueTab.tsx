import React from 'react';
import type { PricingModelRecommendation } from '~/types/product-coach';
import { stripMarkdown } from '~/components/workbench/ProductCoachPanel';
import { RevenueCalculator } from './RevenueCalculator';

interface RevenueTabProps {
  pricingRecommendations: PricingModelRecommendation[];
  // TODO: Add data for Revenue Projection Calculator later
}

// Helper to render a list of items (e.g., pros/cons, features)
const InfoList = ({ title, items, icon, colorClass }: { title?: string, items: string[] | undefined, icon: string, colorClass: string }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-2">
      {title && <h5 className={`text-xs font-semibold uppercase tracking-wide mb-1 ${colorClass}`}>{title}</h5>}
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-1.5">
            <div className={`w-3 h-3 mt-0.5 shrink-0 ${icon} ${colorClass}`} />
            <span className="text-sm text-bolt-elements-textSecondary">{stripMarkdown(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const RevenueTab = ({ pricingRecommendations }: RevenueTabProps) => {

  // Determine initial model type for calculator based on recommendations
  const initialCalculatorModel = pricingRecommendations?.[0]?.type === 'one-time' ? 'one-time' : 'subscription';

  return (
    <div className="space-y-6">
      {/* Section 1: Pricing Model Recommendations */}
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor">
        <div className="flex items-center mb-3">
           <div className="text-emerald-500 mr-2 text-xl shrink-0">
             <div className="i-ph:tag-duotone" />
           </div>
           <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Pricing Model Recommendations</h3>
        </div>
        
        {pricingRecommendations && pricingRecommendations.length > 0 ? (
          <div className="space-y-5">
            {pricingRecommendations.map((rec, index) => (
              <div key={index} className="bg-bolt-elements-background-depth-2 p-4 rounded border border-bolt-elements-borderColor/50">
                <h4 className="text-base font-semibold text-emerald-400 capitalize mb-1">
                  {rec.type.replace('-', ' ')} Model
                </h4>
                <p className="text-sm text-bolt-elements-textSecondary mb-2">{stripMarkdown(rec.rationale)}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <InfoList title="Pros" items={rec.pros} icon="i-ph:check-circle-duotone" colorClass="text-green-500" />
                  <InfoList title="Cons" items={rec.cons} icon="i-ph:x-circle-duotone" colorClass="text-red-500" />
                </div>

                {rec.suggestedTiers && rec.suggestedTiers.length > 0 && (
                  <div className="mt-4 border-t border-bolt-elements-borderColor/30 pt-3">
                    <h5 className="text-sm font-semibold text-bolt-elements-textTertiary mb-2">Suggested Tiers:</h5>
                    <div className="space-y-3">
                      {rec.suggestedTiers.map((tier, tIndex) => (
                        <div key={tIndex} className="bg-bolt-elements-background-depth-1 p-3 rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-bolt-elements-textPrimary">{tier.name}</span>
                            <span className="text-sm font-semibold text-emerald-400">{tier.price}</span>
                          </div>
                          <InfoList items={tier.features} icon="i-ph:star-duotone" colorClass="text-yellow-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-bolt-elements-textTertiary italic">No specific pricing model recommendations available.</p>
        )}
      </div>

      {/* Section 2: Revenue Projection Calculator (Integrated) */}
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor">
        <div className="flex items-center mb-3">
           <div className="text-cyan-500 mr-2 text-xl shrink-0">
             <div className="i-ph:calculator-duotone" />
           </div>
           <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Revenue Projection Calculator</h3>
        </div>
        <p className="text-xs text-bolt-elements-textTertiary mb-4">Adjust the parameters below to estimate potential revenue and user growth based on common models.</p>
        <RevenueCalculator initialInputs={{ pricingModelType: initialCalculatorModel }} />
      </div>

    </div>
  );
}; 