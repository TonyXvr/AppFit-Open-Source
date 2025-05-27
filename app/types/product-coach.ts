export interface CompetitorAnalysis {
  name: string;
  description?: string;
  url?: string;
  strengths?: string[];
  weaknesses?: string[];
  marketShare?: number; // Optional: Example numeric data
  fundingTotal?: number; // Optional: Example numeric data
  pricingModel?: string;
  attributes?: Record<string, number>; // Key-value pairs for radar chart (e.g., { 'Ease of Use': 8, 'Features': 6 })
  features?: string[]; // List of key features
}

export interface PricingModelRecommendation {
  type: 'freemium' | 'subscription' | 'one-time' | 'usage-based' | 'other';
  rationale: string; // Why this model is suggested
  pros?: string[];
  cons?: string[];
  suggestedTiers?: {
    name: string;
    price: string; // Use string for flexibility (e.g., "$10/mo", "Free", "Custom")
    features: string[];
  }[];
}

export interface PrioritizedFeature {
  id: string; // Unique identifier for the feature
  name: string;
  description: string;
  impact: number; // Score 1-10
  effort: number; // Score 1-10 (higher effort = more complex)
  category?: 'New Feature' | 'Improvement' | 'Bug Fix' | 'Tech Debt';
}

export interface RoadmapSuggestion {
  title: string;
  description: string;
  category: 'Security' | 'Performance' | 'User Experience' | 'Monetization' | 'Feature Theme' | 'Milestone';
  priority?: 'high' | 'medium' | 'low';
}

export interface RevenueCalculatorInput {
  // Example structure, can be adapted
  pricingModelType: 'subscription' | 'one-time' | 'other'; // Link to recommended model perhaps?
  monthlyVisitors?: number;
  conversionRate?: number; // e.g., 0.05 for 5%
  avgRevenuePerUser?: number; // For one-time or simpler models
  monthlySubscriptionPrice?: number; // For subscription models
  churnRate?: number; // Monthly churn, e.g., 0.02 for 2%
  projectionMonths?: number;
}

export interface RevenueDataPoint {
  month: number;
  revenue: number;
  users?: number; // Optional: track user growth too
}

export interface MarketingChannelSuggestion {
  channel: string; // e.g., "Content Marketing", "Social Media (LinkedIn)", "PPC Ads"
  rationale: string; // Why this channel is suitable
  roiEstimate?: string; // Optional ROI context (e.g., "Medium", "High", "Potentially high if targeted correctly")
  keyActions?: string[]; // Optional concrete actions (e.g., "Focus on SEO for blog posts", "Target industry keywords")
}

// Potentially add other detailed types here later (MarketTrend, PricingModel, etc.) 