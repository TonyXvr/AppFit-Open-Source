import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export default class GoogleProvider extends BaseProvider {
  name = 'Google';
  getApiKeyLink = 'https://aistudio.google.com/app/apikey';

  config = {
    apiTokenKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
  };

  staticModels: ModelInfo[] = [
    // Main model with increased token limit
    { name: 'gemini-2.5-pro-preview-05-06', label: 'Gemini 2.5 Pro', provider: 'Google', maxTokenAllowed: 100000 },
    // Keeping the experimental model as a fallback
    { name: 'gemini-2.5-pro-exp-03-25', label: 'Gemini 2.5 Pro Exp 03-25', provider: 'Google', maxTokenAllowed: 65536 },
    // All other models are commented out to limit selection
    // { name: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash', provider: 'Google', maxTokenAllowed: 8192 },
    // { name: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro', provider: 'Google', maxTokenAllowed: 8192 },
  ];

  async getDynamicModels(
    _apiKeys?: Record<string, string>,
    _settings?: IProviderSetting,
    _serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    // Return empty array to prevent loading any dynamic models
    // Only the static Gemini 2.5 Pro models will be available
    return [];
  }

  getModelInstance(options: {
    model: string;
    serverEnv: any;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const google = createGoogleGenerativeAI({
      apiKey,
    });

    return google(model);
  }
}
