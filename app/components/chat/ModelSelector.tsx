import type { ProviderInfo } from '~/types/model';
import { useEffect } from 'react';
import type { ModelInfo } from '~/lib/modules/llm/types';
import { classNames } from '~/utils/classNames';

interface ModelSelectorProps {
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  modelList: ModelInfo[];
  providerList: ProviderInfo[];
  apiKeys: Record<string, string>;
  modelLoading?: string;
}

/**
 * ModelSelector that allows selection between Claude 3.7 Sonnet and Gemini 2.5 Pro
 */
export const ModelSelector = ({
  model,
  setModel,
  provider,
  setProvider,
  modelList,
  providerList,
}: ModelSelectorProps) => {
  // Set default model if none selected
  useEffect(() => {
    // If no providers available, return
    if (providerList.length === 0) {
      return;
    }

    // Find Anthropic provider (default)
    const anthropicProvider = providerList.find(p => p.name === 'Anthropic');

    // If no provider is set, default to Anthropic
    if (!provider && anthropicProvider) {
      setProvider?.(anthropicProvider);
    }

    // If no model is set, set the appropriate default model based on provider
    if (!model) {
      if (provider?.name === 'Anthropic') {
        const claude37Model = modelList.find(m =>
          m.provider === 'Anthropic' &&
          m.name === 'claude-3-7-sonnet-20250219'
        );

        if (claude37Model) {
          setModel?.(claude37Model.name);
        }
      } else if (provider?.name === 'Google') {
        const gemini25Model = modelList.find(m =>
          m.provider === 'Google' &&
          m.name === 'gemini-2.5-pro-preview-05-06'
        );

        if (gemini25Model) {
          setModel?.(gemini25Model.name);
        }
      }
    }
  }, [providerList, provider, setProvider, modelList, setModel, model]);

  if (providerList.length === 0) {
    return (
      <div className="mb-2 p-4 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary">
        <p className="text-center">
          No providers are currently enabled. Please enable at least one provider in the settings to start using the
          chat.
        </p>
      </div>
    );
  }

  // Filter to only show Anthropic and Google providers
  const filteredProviders = providerList.filter(p =>
    p.name === 'Anthropic' || p.name === 'Google'
  );

  return (
    <div className="mb-2 flex gap-2 flex-col sm:flex-row">
      {/* Provider selector - allows choosing between Anthropic and Google */}
      <select
        value={provider?.name || ''}
        onChange={(e) => {
          const selectedProvider = filteredProviders.find(p => p.name === e.target.value);
          if (selectedProvider) {
            setProvider?.(selectedProvider);

            // Reset model when provider changes
            if (selectedProvider.name === 'Anthropic') {
              const claude37Model = modelList.find(m =>
                m.provider === 'Anthropic' &&
                m.name === 'claude-3-7-sonnet-20250219'
              );
              if (claude37Model) {
                setModel?.(claude37Model.name);
              }
            } else if (selectedProvider.name === 'Google') {
              const gemini25Model = modelList.find(m =>
                m.provider === 'Google' &&
                m.name === 'gemini-2.5-pro-preview-05-06'
              );
              if (gemini25Model) {
                setModel?.(gemini25Model.name);
              }
            }
          }
        }}
        className="flex-1 p-2 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary"
      >
        {filteredProviders.map((p) => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>

      {/* Model selector - shows the appropriate model based on provider */}
      <div className="relative flex-1 lg:max-w-[70%]">
        <div
          className={classNames(
            'w-full p-2 rounded-lg border border-bolt-elements-borderColor',
            'bg-bolt-elements-prompt-background text-bolt-elements-textPrimary',
          )}
        >
          <div className="flex items-center justify-between">
            <div className="truncate">
              {provider?.name === 'Anthropic' ? 'Claude 3.7 Sonnet' : 'Gemini 2.5 Pro'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
