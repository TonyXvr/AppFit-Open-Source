import { atom, map } from 'nanostores';
// Remove ProductInsight import if no longer directly used, keep Simplified for potential future use or comparison
import type { SimplifiedProductInsight, ProductMarketFitScore } from '~/types/perplexity';
// Import all detailed types
import type {
  CompetitorAnalysis,
  PricingModelRecommendation,
  PrioritizedFeature,
  RoadmapSuggestion,
  MarketingChannelSuggestion // Import MarketingChannelSuggestion
} from '~/types/product-coach';

// Define the expected raw response structure (matching backend)
interface RawInsightResponse {
  summary: string;
  audience: string;
  competitors: CompetitorAnalysis[];
  trends: string[];
  recommendations: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  marketingChannelSuggestions?: MarketingChannelSuggestion[]; // Added
  pricingRecommendations?: PricingModelRecommendation[];
  prioritizedFeatures?: PrioritizedFeature[];
  roadmapSuggestions?: RoadmapSuggestion[];
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

export class PerplexityStore {
  // Store the full raw response
  insights = map<Record<string, RawInsightResponse | { error: string }>>({});
  // Store detailed competitors separately for easier access
  detailedCompetitors = map<CompetitorAnalysis[]>([]);
  // Add state for pricing recommendations
  pricingRecommendations = map<PricingModelRecommendation[]>([]);
  // Add state for roadmap data
  prioritizedFeatures = map<PrioritizedFeature[]>([]);
  roadmapSuggestions = map<RoadmapSuggestion[]>([]);
  // Add state for marketing suggestions
  marketingChannelSuggestions = map<MarketingChannelSuggestion[]>([]);
  // Add state for product market fit score
  pmfScore = atom<ProductMarketFitScore | null>(null);
  isLoading = atom<boolean>(false);
  error = atom<string | null>(null);
  lastAnalyzedAt = atom<number | null>(null);

  async fetchInsights(projectData: any, context?: { description?: string; recentFocus?: string }) {
    this.isLoading.set(true);
    this.error.set(null);
    this.detailedCompetitors.set([]); // Clear previous detailed competitors
    this.pricingRecommendations.set([]); // Clear previous pricing recommendations
    this.prioritizedFeatures.set([]); // Clear previous roadmap data
    this.roadmapSuggestions.set([]); // Clear previous roadmap data
    this.marketingChannelSuggestions.set([]); // Clear previous suggestions
    this.pmfScore.set(null); // Clear previous PMF score

    try {
      console.log('Fetching insights for project data with files:',
        projectData.files ? projectData.files.length : 'none');

      const response = await fetch('/api/perplexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectData, chatContext: context }),
      });

      if (!response.ok) {
        const errorData = await response.text().catch(() => 'No error details');
        console.error('API error:', response.status, errorData);
        throw new Error(`Failed to fetch insights: ${response.status} ${errorData}`);
      }

      // Expect the backend to return the full RawInsightResponse structure
      const data = await response.json() as Record<string, RawInsightResponse | { error: string }>;

      this.insights.set(data); // Store the full raw response

      const insightData = data['project-insights'];

      // Check if the insight data is valid and not an error object
      if (insightData && !( 'error' in insightData)) {
        console.log('Received valid RawInsightResponse structure');
        // Extract and store detailed competitors
        this.detailedCompetitors.set(insightData.competitors || []);
        // Extract and store pricing recommendations
        this.pricingRecommendations.set(insightData.pricingRecommendations || []);
        // Extract and store roadmap data
        this.prioritizedFeatures.set(insightData.prioritizedFeatures || []);
        this.roadmapSuggestions.set(insightData.roadmapSuggestions || []);
        // Extract and store marketing suggestions
        this.marketingChannelSuggestions.set(insightData.marketingChannelSuggestions || []);
        // Extract and store PMF score
        this.pmfScore.set(insightData.pmfScore || null);
        this.lastAnalyzedAt.set(Date.now());
        this.error.set(null); // Clear error if successful
      } else if (insightData && 'error' in insightData) {
        console.error('Received error in insight data:', insightData.error);
        throw new Error(insightData.error); // Propagate the specific error
      } else {
        console.error('Received invalid data structure:', data);
        throw new Error('Received invalid or incomplete data structure from API.');
      }

    } catch (error: any) {
      console.error('Error fetching insights:', error);
      this.error.set(error.message || 'Unknown error');
      // Ensure other states are reset on error
      this.insights.set({ 'project-insights': { error: error.message || 'Unknown error' } });
      this.detailedCompetitors.set([]);
      this.pricingRecommendations.set([]); // Clear on error
      this.prioritizedFeatures.set([]); // Clear on error
      this.roadmapSuggestions.set([]); // Clear on error
      this.marketingChannelSuggestions.set([]); // Clear on error
      this.lastAnalyzedAt.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  clearInsights() {
    this.insights.set({});
    this.detailedCompetitors.set([]); // Clear detailed competitors
    this.pricingRecommendations.set([]); // Clear pricing recommendations
    this.prioritizedFeatures.set([]); // Clear roadmap data
    this.roadmapSuggestions.set([]); // Clear roadmap data
    this.marketingChannelSuggestions.set([]); // Clear marketing suggestions
    this.pmfScore.set(null); // Clear PMF score
    this.lastAnalyzedAt.set(null);
    this.error.set(null);
    this.isLoading.set(false);
  }
}

export const perplexityStore = new PerplexityStore();