import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { generateIdeas } from '~/lib/.server/llm/generate-ideas';
import { createScopedLogger } from '~/utils/logger';
import { getApiKeysFromCookie, getProviderSettingsFromCookie } from '~/lib/api/cookies';

const logger = createScopedLogger('api.generate-ideas');

export const action: ActionFunction = async ({ request, context }) => {
  try {
    const body = await request.json();
    const { messages, model, provider, promptId, contextOptimization } = body;

    if (!messages || !Array.isArray(messages)) {
      return json({ error: 'Invalid messages' }, { status: 400 });
    }

    // Get API keys and provider settings from cookies
    const cookieHeader = request.headers.get('Cookie');
    const apiKeys = getApiKeysFromCookie(cookieHeader);
    const providerSettings = getProviderSettingsFromCookie(cookieHeader);

    const ideas = await generateIdeas({
      messages,
      env: context.cloudflare?.env,
      apiKeys,
      providerSettings,
      promptId,
      contextOptimization,
    });

    return json({ ideas });
  } catch (error) {
    logger.error('Error generating ideas:', error);
    return json({ error: 'Failed to generate ideas' }, { status: 500 });
  }
};
