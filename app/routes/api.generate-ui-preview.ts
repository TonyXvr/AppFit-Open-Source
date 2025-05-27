import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { createScopedLogger } from '~/utils/logger';
import { getApiKeysFromCookie, getProviderSettingsFromCookie } from '~/lib/api/cookies';
import { LLMManager } from '~/lib/modules/llm/manager';

const logger = createScopedLogger('api.generate-ui-preview');

export const action: ActionFunction = async ({ request, context }) => {
  try {
    const body = await request.json();
    const { designPrompt, model, provider, promptId, contextOptimization } = body;

    if (!designPrompt) {
      return json({ error: 'Invalid design prompt' }, { status: 400 });
    }

    // Get API keys and provider settings from cookies
    const cookieHeader = request.headers.get('Cookie');
    const apiKeys = getApiKeysFromCookie(cookieHeader);
    const providerSettings = getProviderSettingsFromCookie(cookieHeader);

    // Initialize LLM manager
    const llmManager = LLMManager.getInstance(context.cloudflare?.env);
    const llmProvider = llmManager.getProvider(provider);

    if (!llmProvider) {
      return json({ error: 'Invalid provider' }, { status: 400 });
    }

    // Create the prompt for generating UI previews
    const systemPrompt = `You are a UI/UX designer specializing in creating wireframes and mockups. 
Your task is to generate three different UI design concepts based on the user's requirements.
For each design concept, provide:
1. A title that captures the essence of the design
2. A detailed description of the layout, components, and visual style
3. A simple ASCII art representation of the layout (optional)

Focus on creating designs that are:
- Visually distinct from each other
- Aligned with the user's requirements
- Feasible to implement with standard web technologies
- Follow modern UI/UX best practices

Respond with a JSON array containing exactly three design concepts, each with the following structure:
{
  "title": "Design Concept Title",
  "description": "Detailed description of the design...",
  "layout": "ASCII art representation (optional)"
}`;

    // Generate the UI previews
    const response = await llmProvider.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: designPrompt }
      ],
      model: model,
      apiKeys,
      providerSettings,
      serverEnv: context.cloudflare?.env,
    });

    // Parse the response to extract the UI previews
    let uiPreviews;
    try {
      // Extract JSON from the response
      const content = response.content;
      const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
      
      if (jsonMatch) {
        uiPreviews = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array is found, try to parse the entire response as JSON
        uiPreviews = JSON.parse(content);
      }
      
      // Ensure we have exactly three previews
      if (!Array.isArray(uiPreviews) || uiPreviews.length !== 3) {
        throw new Error('Invalid response format');
      }
      
      // Validate each preview has the required fields
      uiPreviews = uiPreviews.map(preview => ({
        title: preview.title || 'Untitled Design',
        description: preview.description || 'No description provided',
        layout: preview.layout || ''
      }));
      
    } catch (error) {
      logger.error('Failed to parse UI previews:', error);
      return json({ 
        error: 'Failed to parse UI previews',
        rawResponse: response.content
      }, { status: 500 });
    }

    return json({ previews: uiPreviews });
  } catch (error) {
    logger.error('Error generating UI previews:', error);
    return json({ error: 'Failed to generate UI previews' }, { status: 500 });
  }
};
