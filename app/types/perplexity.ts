export interface CompetitorInfo {
  name: string;
  url?: string; // Optional URL for the competitor
  strengths?: string;
  weaknesses?: string;
}

export interface MarketInsight {
  competitors: CompetitorInfo[];
  marketSize: string;
  targetAudience: string;
  trends: string[];
}

export interface ProductRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status?: 'todo' | 'done';
}

export interface ProductInsight {
  id: string;
  projectType: string;
  marketInsights: MarketInsight;
  recommendations: ProductRecommendation[];
  valueProposition: string;
  growthOpportunities: string[];
}

export interface ProductMarketFitPersona {
  name: string;
  description: string;
  score: number; // 0-100
  feedback?: string;
}

export interface ProductMarketFitScore {
  overall: number; // 0-100
  personas: {
    painPoint: ProductMarketFitPersona;
    budget: ProductMarketFitPersona;
    authority: ProductMarketFitPersona;
    user: ProductMarketFitPersona;
  };
  feedback?: string;
}

export interface SimplifiedProductInsight {
  summary: string;
  audience: string;
  competitors: {
    name: string;
    differentiator?: string;
  }[];
  trends: string[];
  recommendations: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketSize?: {
    tam?: string;
    sam?: string;
    som?: string;
  };
  pmfScore?: ProductMarketFitScore;
}