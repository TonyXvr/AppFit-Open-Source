import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useNavigate } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { UIPreviewGallery } from '~/components/ui-preview-flow/UIPreviewGallery';
import { uiPreviewsActions } from '~/lib/stores/uiPreviewFlow';

export const meta: MetaFunction = () => {
  return [
    { title: 'UI Preview Flow - AppFit' },
    { name: 'description', content: 'Generate and select UI previews for your project' }
  ];
};

export const loader = () => json({});

export default function UIPreviewFlow() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <div className="flex-1 overflow-hidden">
        <ClientOnly>
          {() => <UIPreviewFlowContent />}
        </ClientOnly>
      </div>
    </div>
  );
}

function UIPreviewFlowContent() {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Get the selected preview
    const selectedPreview = uiPreviewsActions.getSelectedPreview();

    if (selectedPreview) {
      // Store the selected preview in localStorage for the chat component to use
      if (typeof window !== 'undefined') {
        // Convert base64 to blob and prepare for chat
        const fetchImage = async () => {
          try {
            // Convert base64 to blob
            const response = await fetch(selectedPreview.imageUrl);
            const blob = await response.blob();

            // Create a File object
            const file = new File([blob], `ui-preview-${Date.now()}.png`, { type: 'image/png' });

            // Store the file and image data in localStorage for the chat component to use
            localStorage.setItem('pendingImageFile', JSON.stringify({
              dataUrl: selectedPreview.imageUrl,
              name: file.name,
              type: file.type,
              size: file.size
            }));

            // Set a flag to indicate there's a pending image to be added to the chat
            localStorage.setItem('addPendingImageToChat', 'true');

            // Store the prompt as context for the chat
            localStorage.setItem('uiPreviewPrompt', selectedPreview.prompt);

            // Navigate to the chat page
            navigate('/');
          } catch (error) {
            console.error('Error preparing image for chat:', error);
          }
        };

        fetchImage();
      }
    }
  };

  return (
    <UIPreviewGallery onContinue={handleContinue} />
  );
}
