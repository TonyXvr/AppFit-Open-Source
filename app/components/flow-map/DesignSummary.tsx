import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { useNavigate } from '@remix-run/react';
import { flowMapData, flowMapStore, FlowMapStep } from '~/lib/stores/flowMap';
import { FlowMapLayout } from './FlowMapLayout';
import { Button } from '~/components/ui/Button';
import { classNames } from '~/utils/classNames';
import ChatDialog from './ChatDialog';

export const DesignSummary: React.FC = () => {
  const navigate = useNavigate();
  const data = useStore(flowMapData);
  const [copied, setCopied] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);

  // Generate design prompt
  const designPrompt = flowMapStore.generateDesignPrompt();

  // Handle copy design prompt
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(designPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle open in chat
  const handleOpenInChat = () => {
    // Reset the flow map and navigate back to the home page with the prompt
    flowMapStore.reset();

    // Store the prompt in localStorage to be picked up by the chat component
    localStorage.setItem('flowMapPrompt', designPrompt);

    // Navigate back to the home page
    navigate('/');
  };

  // Handle chat with AI
  const handleChatWithAI = () => {
    setIsChatDialogOpen(true);
  };

  // Handle edit for each section
  const handleEdit = (section: FlowMapStep) => {
    flowMapStore.goToStep(section);
  };

  return (
    <FlowMapLayout
      title="Design System Summary"
      description="Complete documentation of your design choices"
      showContinueButton={false}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleCopyPrompt}
          >
            {copied ? (
              <>
                <div className="i-ph:check text-lg" />
                Copied!
              </>
            ) : (
              <>
                <div className="i-ph:copy text-lg" />
                Copy Design Prompt
              </>
            )}
          </Button>

          <div className="flex gap-2">
            {/* Generate Design Previews button commented out
            <Button
              variant="outline"
              className="flex items-center gap-2 border-purple-500/30 text-purple-500 hover:bg-purple-500/10"
              onClick={() => {
                // Store the design prompt in localStorage
                localStorage.setItem('designPromptForImages', designPrompt);

                // Navigate to the home page
                flowMapStore.reset();
                navigate('/');

                // Set a flag to open the workbench with image generation tab
                localStorage.setItem('openImageGeneration', 'true');
              }}
            >
              <div className="i-ph:image text-lg" />
              Generate Design Previews
            </Button>
            */}

            <Button
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white"
              onClick={handleOpenInChat}
            >
              <div className="i-ph:arrow-square-out text-lg" />
              Open in Chat
            </Button>
          </div>
        </div>

        <div className="bg-bolt-elements-background-depth-2 p-4 rounded-md border border-bolt-elements-borderColor">
          <h3 className="text-lg font-medium text-purple-500 mb-2">
            {data.projectInfo.name} Design Specification
          </h3>
          <div className="text-xs text-bolt-elements-textSecondary mb-4">
            {data.projectInfo.category} - {data.projectInfo.subcategory} • Generated on {new Date().toLocaleDateString()}
          </div>

          {/* Project Overview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-medium text-bolt-elements-textPrimary">Project Overview</h4>
            </div>

            <div className="bg-bolt-elements-background-depth-1 p-3 rounded-md border border-bolt-elements-borderColor/50">
              <h5 className="font-medium text-bolt-elements-textPrimary">{data.projectInfo.name}</h5>
              <p className="text-sm text-bolt-elements-textSecondary mt-1">{data.projectInfo.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full">
                  {data.projectInfo.category}
                </span>
                {data.projectInfo.subcategory && (
                  <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                    {data.projectInfo.subcategory}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Layout & Structure */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-medium text-bolt-elements-textPrimary">Layout & Structure</h4>
              <button
                onClick={() => handleEdit(FlowMapStep.LayoutStructure)}
                className="text-xs text-purple-500 hover:text-purple-600"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="bg-bolt-elements-background-depth-1 p-3 rounded-md border border-bolt-elements-borderColor/50">
              <div className="flex items-center mb-2">
                <div className="i-ph:layout text-lg text-bolt-elements-textSecondary mr-2" />
                <h5 className="font-medium text-bolt-elements-textPrimary">
                  {data.layoutStructure.columnLayout === 'single' && 'Single Column'}
                  {data.layoutStructure.columnLayout === 'two' && 'Two Column'}
                  {data.layoutStructure.columnLayout === 'three' && 'Three Column'}
                  {data.layoutStructure.columnLayout === 'four' && 'Four Column'}
                </h5>
              </div>
              <p className="text-sm text-bolt-elements-textSecondary">
                {data.layoutStructure.columnLayout === 'single' && 'Classic stacked layout, ideal for articles and content-heavy pages'}
                {data.layoutStructure.columnLayout === 'two' && 'Balanced layout with sidebar, great for blogs and dashboards'}
                {data.layoutStructure.columnLayout === 'three' && 'Rich layout with multiple content sections, ideal for news sites'}
                {data.layoutStructure.columnLayout === 'four' && 'Grid layout for gallery-style content or product listings'}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <h6 className="text-sm font-medium text-bolt-elements-textPrimary">Header</h6>
                  <span className={classNames(
                    "text-xs px-1.5 py-0.5 rounded",
                    data.layoutStructure.hasHeader
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  )}>
                    {data.layoutStructure.hasHeader ? 'Simple' : 'None'}
                  </span>
                </div>

                <div>
                  <h6 className="text-sm font-medium text-bolt-elements-textPrimary">Footer</h6>
                  <span className={classNames(
                    "text-xs px-1.5 py-0.5 rounded",
                    data.layoutStructure.hasFooter
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  )}>
                    {data.layoutStructure.hasFooter ? 'Simple' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Design System */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-medium text-bolt-elements-textPrimary">Design System</h4>
              <button
                onClick={() => handleEdit(FlowMapStep.DesignSystem)}
                className="text-xs text-purple-500 hover:text-purple-600"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="bg-bolt-elements-background-depth-1 p-3 rounded-md border border-bolt-elements-borderColor/50">
              <div className="flex items-center mb-3">
                <div className="i-ph:paint-brush text-lg text-bolt-elements-textSecondary mr-2" />
                <h5 className="font-medium text-bolt-elements-textPrimary">Design Language</h5>
                <span className="ml-2 text-xs bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded">
                  {data.designSystem.designLanguage}
                </span>
              </div>

              <div className="flex items-center mb-3">
                <div className="i-ph:palette text-lg text-bolt-elements-textSecondary mr-2" />
                <h5 className="font-medium text-bolt-elements-textPrimary">Color Theme</h5>
                <span className="ml-2 text-xs bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded">
                  {data.designSystem.colorTheme}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h6 className="text-sm font-medium text-bolt-elements-textPrimary">Heading</h6>
                  <span className="text-xs text-bolt-elements-textSecondary">
                    {data.designSystem.typography.headingFont}
                  </span>
                </div>

                <div>
                  <h6 className="text-sm font-medium text-bolt-elements-textPrimary">Body</h6>
                  <span className="text-xs text-bolt-elements-textSecondary">
                    {data.designSystem.typography.bodyFont}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Elements */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-medium text-bolt-elements-textPrimary">Visual Elements</h4>
              <button
                onClick={() => handleEdit(FlowMapStep.VisualElements)}
                className="text-xs text-purple-500 hover:text-purple-600"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="bg-bolt-elements-background-depth-1 p-3 rounded-md border border-bolt-elements-borderColor/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h6 className="text-sm font-medium text-bolt-elements-textPrimary">Icon Style</h6>
                  <span className="text-xs bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded">
                    {data.visualElements.iconStyle}
                  </span>
                </div>

                <div>
                  <h6 className="text-sm font-medium text-bolt-elements-textPrimary">Illustration Style</h6>
                  <span className="text-xs bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded">
                    {data.visualElements.illustrationStyle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Functionality */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-medium text-bolt-elements-textPrimary">Functionality</h4>
              <button
                onClick={() => handleEdit(FlowMapStep.Functionality)}
                className="text-xs text-purple-500 hover:text-purple-600"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="bg-bolt-elements-background-depth-1 p-3 rounded-md border border-bolt-elements-borderColor/50">
              <div className="mb-3">
                <h6 className="text-sm font-medium text-bolt-elements-textPrimary">Functionality Level</h6>
                <span className="text-xs bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded">
                  {data.functionality.level}
                </span>
                <p className="text-xs text-bolt-elements-textSecondary mt-1">
                  {data.functionality.level === 'basic' && 'Essential features for a minimal viable product'}
                  {data.functionality.level === 'standard' && 'Comprehensive features for typical use cases'}
                  {data.functionality.level === 'advanced' && 'Extensive features for power users and complex scenarios'}
                  {data.functionality.level === 'enterprise' && 'Full-featured with security, scalability, and advanced integrations'}
                </p>
              </div>

              <div className="mb-3">
                <h6 className="text-sm font-medium text-bolt-elements-textPrimary">Technical Requirements</h6>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.functionality.technicalRequirements.map((req, index) => (
                    <span key={index} className="text-xs bg-gray-500/10 text-gray-500 px-1.5 py-0.5 rounded">
                      {req}
                    </span>
                  ))}
                  {data.functionality.technicalRequirements.length === 0 && (
                    <span className="text-xs text-bolt-elements-textTertiary">None selected</span>
                  )}
                </div>
              </div>

              {data.functionality.customFeatures.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium text-bolt-elements-textPrimary">Custom Features</h6>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.functionality.customFeatures.map((feature, index) => (
                      <span key={index} className="text-xs bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generated Prompt */}
          <div>
            <h4 className="text-md font-medium text-bolt-elements-textPrimary mb-2">Generated Prompt</h4>
            <div className="bg-bolt-elements-background-depth-3 p-3 rounded-md border border-bolt-elements-borderColor/50 font-mono text-xs text-bolt-elements-textSecondary whitespace-pre-wrap">
              {designPrompt}
            </div>
          </div>
        </div>

        <p className="text-sm text-bolt-elements-textSecondary text-center">
          Use this specification as a reference for your design and development.
        </p>
      </div>

      {/* Chat Dialog */}
      <ChatDialog
        isOpen={isChatDialogOpen}
        onClose={() => setIsChatDialogOpen(false)}
        designPrompt={designPrompt}
      />
    </FlowMapLayout>
  );
};

export default DesignSummary;
