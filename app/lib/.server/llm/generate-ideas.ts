import { generateText, type CoreTool, type GenerateTextResult, type Message } from 'ai';
import type { IProviderSetting } from '~/types/model';
import { DEFAULT_MODEL, DEFAULT_PROVIDER, PROVIDER_LIST } from '~/utils/constants';
import { extractCurrentContext, extractPropertiesFromMessage, simplifyBoltActions } from './utils';
import { createScopedLogger } from '~/utils/logger';
import { LLMManager } from '~/lib/modules/llm/manager';

const logger = createScopedLogger('generate-ideas');

export interface IdeaSuggestion {
  id: string;
  title: string;
  description: string;
}

export async function generateIdeas(props: {
  messages: Message[];
  env?: Env;
  apiKeys?: Record<string, string>;
  providerSettings?: Record<string, IProviderSetting>;
  promptId?: string;
  contextOptimization?: boolean;
  onFinish?: (resp: GenerateTextResult<Record<string, CoreTool<any, any>>, never>) => void;
}): Promise<IdeaSuggestion[]> {
  const { messages, env: serverEnv, apiKeys, providerSettings, onFinish } = props;
  let currentModel = DEFAULT_MODEL;
  let currentProvider = DEFAULT_PROVIDER.name;

  // Process messages similar to createSummary
  const processedMessages = messages.map((message) => {
    if (message.role === 'user') {
      const { model, provider, content } = extractPropertiesFromMessage(message);
      currentModel = model;
      currentProvider = provider;

      return { ...message, content };
    } else if (message.role === 'assistant') {
      let content = message.content;

      content = simplifyBoltActions(content);
      content = content.replace(/<div class=\\"__boltThought__\\">.*?<\/div>/s, '');
      content = content.replace(/<think>.*?<\/think>/s, '');
      content = content.replace(/^thinking:.*$/gm, '');

      return { ...message, content };
    }

    return message;
  });

  const provider = PROVIDER_LIST.find((p) => p.name === currentProvider) || DEFAULT_PROVIDER;
  const staticModels = LLMManager.getInstance().getStaticModelListFromProvider(provider);
  let modelDetails = staticModels.find((m) => m.name === currentModel);

  if (!modelDetails) {
    const modelsList = [
      ...(provider.staticModels || []),
      ...(await LLMManager.getInstance().getModelListFromProvider(provider, {
        apiKeys,
        providerSettings,
        serverEnv: serverEnv as any,
      })),
    ];

    if (!modelsList.length) {
      throw new Error(`No models found for provider ${provider.name}`);
    }

    modelDetails = modelsList.find((m) => m.name === currentModel);

    if (!modelDetails) {
      // Fallback to first model
      logger.warn(
        `MODEL [${currentModel}] not found in provider [${provider.name}]. Falling back to first model. ${modelsList[0].name}`,
      );
      modelDetails = modelsList[0];
    }
  }

  const extractTextContent = (message: Message) =>
    Array.isArray(message.content)
      ? (message.content.find((item) => item.type === 'text')?.text as string) || ''
      : message.content;

  // Generate ideas based on the conversation
  const resp = await generateText({
    system: `
      You are a creative software development assistant. Your task is to generate three innovative ideas or suggestions based on the current conversation.
      These ideas should be related to the current project or task the user is working on.

      Each idea should:
      1. Be specific and actionable
      2. Provide value to the current project
      3. Be feasible to implement in a webcontainer environment
      4. Focus on practical features rather than architectural changes

      Important: All suggestions must be feasible to implement within a webcontainer environment with limited resources. Focus on UI features, functionality enhancements, and user experience improvements that can be implemented without complex infrastructure changes.

      Format your response as a JSON array with exactly 3 objects, each with the following structure:
      [
        {
          "title": "Brief, catchy title for the idea",
          "description": "A 1-2 sentence explanation of the idea and its benefits"
        },
        ...
      ]

      Only return the JSON array, nothing else. Do not include any explanations, introductions, or other text.
    `,
    prompt: `
      Here is the conversation so far:

      ${processedMessages
        .map((x) => {
          return `[${x.role}] ${extractTextContent(x)}`;
        })
        .join('\n\n')}

      Based on this conversation, generate three innovative feature ideas or suggestions that would be valuable for the user's project. Remember to focus on features that are feasible in a webcontainer environment and can be implemented without complex infrastructure changes.
    `,
    model: provider.getModelInstance({
      model: currentModel,
      serverEnv,
      apiKeys,
      providerSettings,
    }),
  });

  if (onFinish) {
    onFinish(resp);
  }

  try {
    // Parse the response as JSON
    const ideas = JSON.parse(resp.text);

    // Validate and format the ideas
    if (Array.isArray(ideas) && ideas.length > 0) {
      return ideas.map((idea, index) => ({
        id: `idea-${index + 1}`,
        title: idea.title || `Idea ${index + 1}`,
        description: idea.description || '',
      }));
    }

    // Fallback if the response is not in the expected format
    return [
      {
        id: 'idea-1',
        title: 'Add interactive UI component',
        description: 'Implement a new interactive UI element to enhance user engagement and functionality.',
      },
      {
        id: 'idea-2',
        title: 'Improve responsive design',
        description: 'Enhance the responsive behavior of your interface to provide better experience across devices.',
      },
      {
        id: 'idea-3',
        title: 'Implement feature toggle',
        description: 'Add a feature toggle system to easily enable/disable features during development and testing.',
      },
    ];
  } catch (error) {
    logger.error('Failed to parse ideas:', error);

    // Return default ideas if parsing fails
    return [
      {
        id: 'idea-1',
        title: 'Add interactive UI component',
        description: 'Implement a new interactive UI element to enhance user engagement and functionality.',
      },
      {
        id: 'idea-2',
        title: 'Improve responsive design',
        description: 'Enhance the responsive behavior of your interface to provide better experience across devices.',
      },
      {
        id: 'idea-3',
        title: 'Implement feature toggle',
        description: 'Add a feature toggle system to easily enable/disable features during development and testing.',
      },
    ];
  }
}
