import { useStore } from '@nanostores/react';
import { perplexityStore } from '~/lib/stores/perplexity';
import type { ProductMarketFitScore as PMFScoreType } from '~/types/perplexity';

// Helper component for the circular gauge
const CircularGauge = ({ value, size = 120, strokeWidth = 8 }: { value: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const remaining = circumference - progress;
  
  // Calculate color based on score
  const getColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green-500
    if (score >= 60) return '#eab308'; // Yellow-500
    if (score >= 40) return '#f97316'; // Orange-500
    return '#ef4444'; // Red-500
  };
  
  const color = getColor(value);
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-bolt-elements-background-depth-2"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={remaining}
          strokeLinecap="round"
        />
      </svg>
      <div 
        className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
};

// Helper component for persona score bars
const PersonaScoreBar = ({ 
  name, 
  description, 
  score, 
  feedback 
}: { 
  name: string; 
  description: string; 
  score: number; 
  feedback?: string 
}) => {
  // Calculate color based on score
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const barColor = getColor(score);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="font-medium text-bolt-elements-textPrimary">{name}</div>
        <div className="text-sm font-medium text-bolt-elements-textSecondary">{score}/100</div>
      </div>
      <div className="text-xs text-bolt-elements-textSecondary mb-2">{description}</div>
      <div className="w-full bg-bolt-elements-background-depth-2 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${barColor}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      {feedback && (
        <div className="mt-1 text-xs text-bolt-elements-textTertiary">{feedback}</div>
      )}
    </div>
  );
};

export const ProductMarketFitScore = () => {
  const pmfScore = useStore(perplexityStore.pmfScore);
  
  if (!pmfScore) {
    return (
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md">
        <div className="flex items-center mb-3">
          <div className="text-purple-500 mr-2 text-xl shrink-0">
            <div className="i-ph:target-duotone" />
          </div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Product Market Fit Score</h3>
        </div>
        <p className="text-sm text-bolt-elements-textTertiary italic px-2">
          No product market fit data available. Analyze your project to generate a PMF score.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 border border-bolt-elements-borderColor transition-all duration-200 hover:shadow-md">
      <div className="flex items-center mb-3">
        <div className="text-purple-500 mr-2 text-xl shrink-0">
          <div className="i-ph:target-duotone" />
        </div>
        <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Product Market Fit Score</h3>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Overall Score Gauge */}
        <div className="flex flex-col items-center">
          <CircularGauge value={pmfScore.overall} />
          <div className="mt-2 text-sm font-medium text-bolt-elements-textSecondary">Overall Score</div>
          {pmfScore.feedback && (
            <p className="mt-2 text-xs text-bolt-elements-textSecondary max-w-xs text-center">
              {pmfScore.feedback}
            </p>
          )}
        </div>
        
        {/* Persona Scores */}
        <div className="flex-1">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-bolt-elements-textSecondary mb-1">Customer Persona Alignment</h4>
            <p className="text-xs text-bolt-elements-textTertiary">
              The ideal product has all four personas mapped to a single person or a small group.
            </p>
          </div>
          
          <PersonaScoreBar 
            name="Pain Point Holder" 
            description="The person experiencing the problem your product solves."
            score={pmfScore.personas.painPoint.score}
            feedback={pmfScore.personas.painPoint.feedback}
          />
          
          <PersonaScoreBar 
            name="Budget Holder" 
            description="The person with financial resources to pay for your solution."
            score={pmfScore.personas.budget.score}
            feedback={pmfScore.personas.budget.feedback}
          />
          
          <PersonaScoreBar 
            name="Decision Maker" 
            description="The person with authority to decide on implementing your solution."
            score={pmfScore.personas.authority.score}
            feedback={pmfScore.personas.authority.feedback}
          />
          
          <PersonaScoreBar 
            name="End User" 
            description="The person who will actually use your product day-to-day."
            score={pmfScore.personas.user.score}
            feedback={pmfScore.personas.user.feedback}
          />
        </div>
      </div>
    </div>
  );
};
