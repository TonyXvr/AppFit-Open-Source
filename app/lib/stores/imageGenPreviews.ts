import { atom, map } from 'nanostores';

export interface ImagePreview {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
  selected?: boolean;
}

// Store for image previews
export const imagePreviewsStore = map<Record<string, ImagePreview>>({});

// Store for loading state
export const isGeneratingPreviewsStore = atom<boolean>(false);

// Actions for the image previews store
export const imagePreviewsActions = {
  addPreview: (preview: ImagePreview) => {
    imagePreviewsStore.setKey(preview.id, preview);
  },
  
  addPreviews: (previews: ImagePreview[]) => {
    previews.forEach(preview => {
      imagePreviewsStore.setKey(preview.id, preview);
    });
  },
  
  removePreview: (id: string) => {
    const previews = { ...imagePreviewsStore.get() };
    delete previews[id];
    imagePreviewsStore.set(previews);
  },
  
  clearPreviews: () => {
    imagePreviewsStore.set({});
  },
  
  selectPreview: (id: string) => {
    const previews = { ...imagePreviewsStore.get() };
    
    // Deselect all previews first
    Object.keys(previews).forEach(previewId => {
      previews[previewId] = {
        ...previews[previewId],
        selected: previewId === id
      };
    });
    
    imagePreviewsStore.set(previews);
  },
  
  getSelectedPreview: (): ImagePreview | null => {
    const previews = imagePreviewsStore.get();
    const selectedPreview = Object.values(previews).find(preview => preview.selected);
    return selectedPreview || null;
  },
  
  setGenerating: (isGenerating: boolean) => {
    isGeneratingPreviewsStore.set(isGenerating);
  }
};
