import { type ActionFunction, json } from '@remix-run/cloudflare';
import { getApiKeysFromCookie } from '~/lib/api/cookies';

interface RequestBody {
  prompt: string;
  model?: string;
  provider?: string;
  apiKey?: string;
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.json() as RequestBody;
    const { prompt, apiKey } = body;

    if (!prompt) {
      return json({ error: 'Invalid prompt' }, { status: 400 });
    }

    // Get API keys from cookies
    const cookieHeader = request.headers.get('Cookie');
    const apiKeys = getApiKeysFromCookie(cookieHeader);

    // Use API key from request body if provided, otherwise use from cookies
    const openAIApiKey = apiKey || apiKeys?.['OpenAI'];

    // Validate OpenAI API key
    if (!openAIApiKey) {
      return json({ error: 'OpenAI API key is required' }, { status: 401 });
    }

    // Make the API call to OpenAI for image generation
    try {
      // Enhanced prompt with UI/UX design context
      const enhancedPrompt = `You are a world class UI/UX Designer that works for AppFit, a text-to-prompt code generator. You have 40 years of experience who understands every design principle ever created. You have designed award-winning interfaces for top tech companies and have mastered visual hierarchy, color theory, typography, and modern design trends. Create 3 extremely different yet visually stunning, professional UIs for: ${prompt}. The design should be clean, modern, visually compelling, with perfect spacing, alignment, and contrast. Include intuitive navigation, clear call-to-action elements, and ensure the interface follows accessibility best practices. Take inspiration from the greatest websites in the world that have incredible aesthetics and are user-friendly.`;

      // Direct API call without response_format parameter
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-image-1', // Using the correct model name as per OpenAI docs
          prompt: enhancedPrompt,
          n: 3, // Generate 3 images
          size: '1024x1024' // Standard size
          // No response_format or output_format for gpt-image-1
        })
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: { message?: string } };
        console.error('OpenAI API error:', errorData);
        return json({
          error: `OpenAI API error: ${errorData.error?.message || response.statusText}`
        }, { status: response.status });
      }

      const data = await response.json() as { data: Array<{ b64_json: string }> };

      // Format the response
      const imagePreviews = data.data.map((item, index: number) => ({
        id: `preview-${Date.now()}-${index}`,
        imageUrl: `data:image/png;base64,${item.b64_json}`,
        prompt: prompt, // Store the original user prompt, not the enhanced one
        timestamp: Date.now()
      }));

      return json({
        success: true,
        previews: imagePreviews
      });
    } catch (error) {
      console.error('Error generating images:', error);
      return json({
        error: `Error generating images: ${error instanceof Error ? error.message : String(error)}`
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return json({
      error: `Error processing request: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 });
  }
};
