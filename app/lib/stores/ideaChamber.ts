import { atom, map } from 'nanostores';

export interface IdeaSuggestion {
  id: string;
  title: string;
  description: string;
  selected: boolean;
}

// Store for idea suggestions
export const ideaSuggestions = atom<IdeaSuggestion[]>([]);

// Store for Idea Chamber visibility
export const isIdeaChamberVisible = atom<boolean>(false);

// Store for loading state
export const isIdeaChamberLoading = atom<boolean>(false);

// Store for tracking if ideas have been generated for the current message
export const hasGeneratedIdeas = map<{
  messageId: string | null;
  generated: boolean;
}>({
  messageId: null,
  generated: false,
});

// Actions
export const ideaChamberStore = {
  // Set suggestions
  setSuggestions: (suggestions: IdeaSuggestion[]) => {
    ideaSuggestions.set(suggestions);
  },

  // Toggle suggestion selection
  toggleSuggestion: (id: string) => {
    const currentSuggestions = ideaSuggestions.get();
    const updatedSuggestions = currentSuggestions.map((suggestion) => {
      if (suggestion.id === id) {
        return { ...suggestion, selected: !suggestion.selected };
      }
      return suggestion;
    });
    ideaSuggestions.set(updatedSuggestions);
  },

  // Show Idea Chamber
  showIdeaChamber: () => {
    isIdeaChamberVisible.set(true);
  },

  // Hide Idea Chamber
  hideIdeaChamber: () => {
    isIdeaChamberVisible.set(false);
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    isIdeaChamberLoading.set(loading);
  },

  // Set generated state for a message
  setGenerated: (messageId: string, generated: boolean = true) => {
    hasGeneratedIdeas.set({
      messageId,
      generated,
    });
  },

  // Reset Idea Chamber
  reset: () => {
    ideaSuggestions.set([]);
    isIdeaChamberVisible.set(false);
    isIdeaChamberLoading.set(false);
    hasGeneratedIdeas.set({
      messageId: null,
      generated: false,
    });
  },

  // Get selected suggestions
  getSelectedSuggestions: () => {
    return ideaSuggestions.get().filter((suggestion) => suggestion.selected);
  },
};
