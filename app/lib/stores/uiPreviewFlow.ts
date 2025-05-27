import { atom, map } from 'nanostores';

export interface UIPreview {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
  selected?: boolean;
}

// Store for UI previews
export const uiPreviewsStore = map<Record<string, UIPreview>>({});

// Store for loading state
export const isGeneratingUIPreviewsStore = atom<boolean>(false);

// Actions for the UI previews store
export const uiPreviewsActions = {
  addPreview: (preview: UIPreview) => {
    uiPreviewsStore.setKey(preview.id, preview);
  },
  
  addPreviews: (previews: UIPreview[]) => {
    previews.forEach(preview => {
      uiPreviewsStore.setKey(preview.id, preview);
    });
  },
  
  removePreview: (id: string) => {
    const previews = { ...uiPreviewsStore.get() };
    delete previews[id];
    uiPreviewsStore.set(previews);
  },
  
  clearPreviews: () => {
    uiPreviewsStore.set({});
  },
  
  selectPreview: (id: string) => {
    const previews = { ...uiPreviewsStore.get() };
    
    // Deselect all previews first
    Object.keys(previews).forEach(previewId => {
      previews[previewId] = {
        ...previews[previewId],
        selected: previewId === id
      };
    });
    
    uiPreviewsStore.set(previews);
  },
  
  getSelectedPreview: (): UIPreview | null => {
    const previews = uiPreviewsStore.get();
    const selectedPreview = Object.values(previews).find(preview => preview.selected);
    return selectedPreview || null;
  },
  
  setGenerating: (isGenerating: boolean) => {
    isGeneratingUIPreviewsStore.set(isGenerating);
  }
};
