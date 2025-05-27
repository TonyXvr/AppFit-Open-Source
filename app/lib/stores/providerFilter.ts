import { atom } from 'nanostores';
import type { ProviderInfo } from '~/types/model';

// List of allowed providers - only Anthropic and Google are enabled
export const ALLOWED_PROVIDERS = ['Anthropic', 'Google'];

// Filter function to only show allowed providers
export const filterProviders = (providers: ProviderInfo[]): ProviderInfo[] => {
  return providers.filter(provider => ALLOWED_PROVIDERS.includes(provider.name));
};

// Store to track if filtering is enabled
export const providerFilteringEnabled = atom<boolean>(true);
