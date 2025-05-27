import { json } from '@remix-run/cloudflare';
import type { ActionFunction } from '@remix-run/cloudflare';
import type { ProductInsight, CompetitorInfo, SimplifiedProductInsight, ProductMarketFitScore } from '~/types/perplexity';
import type { CompetitorAnalysis, PricingModelRecommendation, PrioritizedFeature, RoadmapSuggestion, MarketingChannelSuggestion } from '~/types/product-coach';

// Define context type
interface ChatContext {
  description?: string;
  recentFocus?: string; // Keep placeholder for future use
}

interface ChatRequest {
  chatMode: boolean;
  message: string;
}

interface ProjectRequest {
  projectData: any;
  chatContext?: ChatContext; // Add chatContext here
}

type ApiRequest = ChatRequest | ProjectRequest;

// Define an interface for the expected raw response structure
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
  marketingChannelSuggestions?: MarketingChannelSuggestion[];
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

export const action: ActionFunction = async ({ request, context }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Get Perplexity API key from environment variables
    // Set PERPLEXITY_API_KEY environment variable with your Perplexity API key
    // Get your API key from: https://www.perplexity.ai/settings/api
    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;

    if (!perplexityApiKey) {
      return json({ error: 'Perplexity API key not configured. Please set PERPLEXITY_API_KEY environment variable.' }, { status: 500 });
    }

    const reqBody = await request.json() as ApiRequest;

    // Check if this is a chat mode request or a project analysis request
    if ('chatMode' in reqBody && reqBody.chatMode) {
      // Handle chat mode
      const { message } = reqBody;

      // Call to Perplexity API for chat
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${perplexityApiKey}`,
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: "You are a product coach expert helping users with product strategy, market analysis, and growth opportunities. Provide concise, actionable advice based on deep market research and competitive analysis. Your tone is professional but friendly. Format your responses in a clean, well-structured way with clear sections and bullet points where appropriate. Avoid excessive technical jargon unless specifically requested."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 1500
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Perplexity API chat error:', response.status, errorText);
        throw new Error(`Failed to fetch from Perplexity API: ${response.status} ${errorText}`);
      }

      const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const responseText = data.choices?.[0]?.message?.content || "I couldn't generate a response at this time.";

      return json({ response: responseText });
    } else {
      // Handle project analysis (original functionality)
      const projectData = 'projectData' in reqBody ? reqBody.projectData : {};
      // Extract chat context
      const chatContext = 'chatContext' in reqBody ? reqBody.chatContext : undefined;

      // ---> Add logging to inspect projectData and context <---
      console.log("--- Analyzing Project Data --- ");
      console.log("Timestamp:", projectData?.timestamp);
      const filePaths = projectData?.files?.map((f: { path: string }) => f.path) || [];
      console.log("File Paths Sent:", JSON.stringify(filePaths, null, 2));
      console.log(`Total files: ${filePaths.length}`);
      console.log("Chat Context Received:", JSON.stringify(chatContext, null, 2)); // Log context
      console.log("----------------------------- ");
      // ---> End logging <---

      // Call to Perplexity API for project analysis
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${perplexityApiKey}`,
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              // Modify system prompt to mention context
              content: `You are a product analysis expert. Analyze the provided project files (paths and content) to understand the application's primary purpose and target domain.

**Project Goal/Description (if provided):** ${chatContext?.description || 'Not provided.'}
**User's Recent Focus (if provided):** ${chatContext?.recentFocus || 'Not provided.'}

**Instructions:**
1.  **Infer Purpose:** Based on file names, data structures, overall structure, AND the provided Project Goal/Description, determine the likely goal of this project.
2.  **Generate Concise Analysis:** Provide insights SPECIFIC to the inferred purpose and domain, taking the user's context into account:
    *   **summary:** One-sentence summary reflecting the project's inferred purpose AND the user's goal. DO NOT just describe the tech stack.
    *   **audience:** Likely primary target audience based on the inferred domain AND the user's goal.
    *   **competitors:** ~3 key potential competitors. Determine the market domain PRIMARILY from the 'Project Goal/Description' provided in the context. List competitors relevant to THAT domain and the user's goal. For each competitor, provide:
        *   "name": Competitor's name (string).
        *   "description": Brief description (string, optional).
        *   "attributes": An object scoring the competitor on key dimensions relevant to the domain (e.g., { "Features": 8, "Ease of Use": 7, "Pricing Score": 6 }). Aim for ~3-5 attributes with scores 1-10 (higher is better). (Record<string, number>, optional).
        *   "features": A list of ~3-5 key features offered by the competitor (array of strings, optional).
    *   **trends:** ~2-3 relevant market trends *for the inferred domain* relevant to the user's goal.
    *   **marketingChannelSuggestions:** Suggest ~2-4 potentially effective marketing channels for reaching the target audience of this type of product, considering the user's goal. For each, provide:
        *   "channel": The channel name (string, e.g., "Content Marketing").
        *   "rationale": Brief justification for its suitability (string).
        *   "roiEstimate": General potential ROI (string, e.g., "Medium", "High", optional).
        *   "keyActions": ~1-2 specific actions to take (array of strings, optional).
    *   **recommendations:** ~3-5 actionable, high-level recommendations *specific to building or improving a product in the inferred domain to meet the user's goal*. Include a title, short description, and priority (high|medium|low).
    *   **prioritizedFeatures:** Based on the project's current state and potential market gaps related to the user's goal, suggest ~5-8 potential features or improvements. For each, provide:
        *   "id": A unique string identifier (e.g., "feat-001").
        *   "name": A short, descriptive name (string).
        *   "description": A brief explanation (string).
        *   "impact": Estimated impact on users/business (integer 1-10).
        *   "effort": Estimated implementation effort/complexity (integer 1-10).
        *   "category": Type like 'New Feature', 'Improvement', etc. (string, optional).
    *   **roadmapSuggestions:** Provide ~3-5 broader strategic suggestions or themes for the product roadmap relevant to the user's goal. For each, provide:
        *   "title": A concise suggestion title (string).
        *   "description": A brief explanation (string).
        *   "category": Theme like 'Security', 'Performance', 'User Experience', 'Monetization', 'Feature Theme', 'Milestone' (string).
        *   "priority": Suggested priority (high|medium|low, optional).
    *   **pricingRecommendations:** Recommend 1-2 potential pricing models (e.g., freemium, subscription) suitable for this type of product based on the user's goal. For each, provide:
        *   "type": The model type (string: freemium|subscription|one-time|usage-based|other).
        *   "rationale": Brief justification (string).
        *   "pros": ~2-3 advantages (array of strings, optional).
        *   "cons": ~2-3 disadvantages (array of strings, optional).
        *   "suggestedTiers": 1-3 example tiers with name, price (string), and key features (array of strings, optional).
    *   **swot:** Generate a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) relevant to the project in its inferred domain and considering the user's goal. Provide ~2-3 bullet points for each category as arrays of strings.
    *   **marketSize:** Estimate the potential market size (TAM, SAM, SOM) for a product in this inferred domain, considering the user's goal. Provide brief string descriptions for each. If estimation is highly speculative, indicate that.
    *   **pmfScore:** Evaluate the product market fit based on the four key customer personas: pain point holder, budget holder, authority/decision maker, and end user. For each persona, provide a score from 0-100, a brief description, and feedback. Also provide an overall PMF score from 0-100 and general feedback. Use this structure:
        *   "overall": Overall PMF score (number 0-100).
        *   "feedback": General feedback on the product market fit (string, optional).
        *   "personas": Object containing four persona evaluations:
            *   "painPoint": { "name": "Pain Point Holder", "description": "The person experiencing the problem your product solves.", "score": (number 0-100), "feedback": (string) }
            *   "budget": { "name": "Budget Holder", "description": "The person with financial resources to pay for your solution.", "score": (number 0-100), "feedback": (string) }
            *   "authority": { "name": "Decision Maker", "description": "The person with authority to decide on implementing your solution.", "score": (number 0-100), "feedback": (string) }
            *   "user": { "name": "End User", "description": "The person who will actually use your product day-to-day.", "score": (number 0-100), "feedback": (string) }

**Output Format:**
Format the entire response as a single, valid JSON object using this exact structure (do not wrap in markdown fences):
{ "summary": "...", "audience": "...", "competitors": [ { "name": "...", "description": "...", "attributes": { "Attribute 1": 8, "Attribute 2": 7 }, "features": ["Feature A", "Feature B"] } ], "trends": [ "...", "..." ], "marketingChannelSuggestions": [ { "channel": "...", "rationale": "...", "roiEstimate": "...", "keyActions": ["..."] } ], "recommendations": [ { "title": "...", "description": "...", "priority": "high|medium|low" } ], "prioritizedFeatures": [ { "id": "...", "name": "...", "description": "...", "impact": ..., "effort": ..., "category": "..." } ], "roadmapSuggestions": [ { "title": "...", "description": "...", "category": "...", "priority": "..." } ], "pricingRecommendations": [ { "type": "...", "rationale": "...", "pros": ["..."], "cons": ["..."], "suggestedTiers": [ { "name": "...", "price": "...", "features": ["..."] } ] } ], "swot": { "strengths": ["...", "..."], "weaknesses": ["...", "..."], "opportunities": ["...", "..."], "threats": ["...", "..."] }, "marketSize": { "tam": "...", "sam": "...", "som": "..." }, "pmfScore": { "overall": 75, "feedback": "...", "personas": { "painPoint": { "name": "Pain Point Holder", "description": "...", "score": 80, "feedback": "..." }, "budget": { "name": "Budget Holder", "description": "...", "score": 70, "feedback": "..." }, "authority": { "name": "Decision Maker", "description": "...", "score": 65, "feedback": "..." }, "user": { "name": "End User", "description": "...", "score": 85, "feedback": "..." } } } }`
            },
            {
              role: "user",
              // Pass project data in the user message (unchanged)
              content: generateQueryFromProjectData(projectData)
            }
          ],
          max_tokens: 4000
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Perplexity API error:', response.status, errorText);
        throw new Error(`Failed to fetch from Perplexity API: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return json(transformPerplexityResponse(data));
    }
  } catch (error: any) {
    console.error('API error:', error);
    return json({ error: error.message }, { status: 500 });
  }
};

function generateQueryFromProjectData(projectData: any): string {
  // Simply provide the project data, the system prompt handles the analysis request
  // Context is now included in the system prompt, so this function remains simple.
  return `Project details:
${JSON.stringify(projectData, null, 2)}`;
}

function transformPerplexityResponse(response: any): Record<string, RawInsightResponse | { error: string }> {
  try {
    let content = response?.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content found in Perplexity response:', response);
      return { 'project-insights': { error: 'No content received from analysis API.' } };
    }

    console.log('Raw Perplexity response content:', content);

    // Strip markdown fences if present
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.substring(7); // Remove ```json
    }
    if (content.endsWith('```')) {
      content = content.substring(0, content.length - 3); // Remove ```
    }
    content = content.trim(); // Trim again

    // Attempt to parse the cleaned JSON response into the RawInsightResponse structure
    const parsedData = JSON.parse(content) as RawInsightResponse;

    // --- Updated validation to include optional marketing channels ---
    if (!parsedData ||
        typeof parsedData.summary !== 'string' ||
        typeof parsedData.audience !== 'string' ||
        !Array.isArray(parsedData.competitors) ||
        !Array.isArray(parsedData.trends) ||
        (parsedData.marketingChannelSuggestions && !Array.isArray(parsedData.marketingChannelSuggestions)) ||
        !Array.isArray(parsedData.recommendations) ||
        (parsedData.pricingRecommendations && !Array.isArray(parsedData.pricingRecommendations)) ||
        (parsedData.prioritizedFeatures && !Array.isArray(parsedData.prioritizedFeatures)) ||
        (parsedData.roadmapSuggestions && !Array.isArray(parsedData.roadmapSuggestions))
       ) {
        throw new Error('Parsed data is missing required fields or has incorrect types.');
    }

    // Validate competitor structure (example checks)
    if (parsedData.competitors.some(c => typeof c.name !== 'string' || (c.attributes && typeof c.attributes !== 'object') || (c.features && !Array.isArray(c.features)))) {
        throw new Error('Parsed competitors have invalid structure.');
    }

    // Validate recommendation structure (example)
    if (parsedData.recommendations.some(rec => typeof rec.title !== 'string' || typeof rec.description !== 'string' || !['high', 'medium', 'low'].includes(rec.priority))) {
        throw new Error('Parsed recommendations have invalid structure.');
    }

    // Optional: Add validation for pricingRecommendations structure if needed
    if (parsedData.pricingRecommendations?.some(p => typeof p.type !== 'string' || typeof p.rationale !== 'string')) {
       console.warn('Warning: Parsed pricingRecommendations have potentially invalid structure.');
       // Decide if this should be a hard error or just a warning
       // throw new Error('Parsed pricingRecommendations have invalid structure.');
    }

    // Optional: Add validation for roadmap fields if needed
    if (parsedData.prioritizedFeatures?.some(f => typeof f.id !== 'string' || typeof f.name !== 'string' || typeof f.impact !== 'number' || typeof f.effort !== 'number')) {
       console.warn('Warning: Parsed prioritizedFeatures have potentially invalid structure.');
    }
    if (parsedData.roadmapSuggestions?.some(s => typeof s.title !== 'string' || typeof s.category !== 'string')) {
       console.warn('Warning: Parsed roadmapSuggestions have potentially invalid structure.');
    }

    // Optional: Add validation for marketing channel suggestions
    if (parsedData.marketingChannelSuggestions?.some(m => typeof m.channel !== 'string' || typeof m.rationale !== 'string')) {
        console.warn('Warning: Parsed marketingChannelSuggestions have potentially invalid structure.');
    }

    // Optional: Add validation for PMF score
    if (parsedData.pmfScore) {
        if (typeof parsedData.pmfScore.overall !== 'number' ||
            !parsedData.pmfScore.personas ||
            typeof parsedData.pmfScore.personas.painPoint?.score !== 'number' ||
            typeof parsedData.pmfScore.personas.budget?.score !== 'number' ||
            typeof parsedData.pmfScore.personas.authority?.score !== 'number' ||
            typeof parsedData.pmfScore.personas.user?.score !== 'number') {
            console.warn('Warning: Parsed pmfScore has potentially invalid structure.');
        }
    }

    console.log('Successfully parsed RawInsightResponse:', parsedData);
    return { 'project-insights': parsedData };

  } catch (error: any) {
    console.error('Error transforming Perplexity response:', error);
    const content = response?.choices?.[0]?.message?.content;
    console.error('Failed to parse content:', content);
    // Ensure error is returned within the expected structure
    return { 'project-insights': { error: `Failed to process analysis response: ${error.message}` } };
  }
}