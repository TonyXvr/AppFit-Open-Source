import React from 'react';
import type { ReactNode } from 'react';
import { useStore } from '@nanostores/react';
import { useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Button } from '~/components/ui/Button';
import { currentStep, FlowMapStep, flowMapStore } from '~/lib/stores/flowMap';
import { classNames } from '~/utils/classNames';
import LivePreview from './LivePreview';

interface FlowMapLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showBackButton?: boolean;
  showContinueButton?: boolean;
  continueButtonText?: string;
  onContinue?: () => void;
  disableContinue?: boolean;
}

export const FlowMapLayout: React.FC<FlowMapLayoutProps> = ({
  children,
  title,
  description,
  showBackButton = true,
  showContinueButton = true,
  continueButtonText = 'Continue',
  onContinue,
  disableContinue = false,
}) => {
  const navigate = useNavigate();
  const step = useStore(currentStep);

  const handleBack = () => {
    flowMapStore.previousStep();
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      flowMapStore.nextStep();
    }
  };

  const handleCancel = () => {
    // Reset the flow map and navigate back to the home page
    flowMapStore.reset();
    navigate('/');
  };

  // Calculate progress percentage based on current step
  const getProgressPercentage = () => {
    switch (step) {
      case FlowMapStep.ProjectInformation:
        return 0;
      case FlowMapStep.LayoutStructure:
        return 20;
      case FlowMapStep.DesignSystem:
        return 40;
      case FlowMapStep.VisualElements:
        return 60;
      case FlowMapStep.Functionality:
        return 80;
      case FlowMapStep.DesignSummary:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with progress bar */}
      <div className="bg-bolt-elements-background-depth-2 p-4 border-b border-bolt-elements-borderColor">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-bolt-elements-textPrimary">{title}</h1>
          <button
            onClick={handleCancel}
            className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
          >
            <div className="i-ph:x text-xl" />
          </button>
        </div>
        <p className="text-sm text-bolt-elements-textSecondary mb-4">{description}</p>

        {/* Progress bar */}
        <div className="w-full h-1 bg-bolt-elements-background-depth-3 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-purple-500"
            initial={{ width: `${getProgressPercentage()}%` }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-2 text-xs text-bolt-elements-textTertiary">
          <div className={classNames(
            "flex flex-col items-center",
            step === FlowMapStep.ProjectInformation ? "text-purple-500 font-medium" : ""
          )}>
            <div className={classNames(
              "w-2 h-2 rounded-full mb-1",
              step === FlowMapStep.ProjectInformation || getProgressPercentage() > 0 ? "bg-purple-500" : "bg-bolt-elements-background-depth-3"
            )} />
            Project
          </div>
          <div className={classNames(
            "flex flex-col items-center",
            step === FlowMapStep.LayoutStructure ? "text-purple-500 font-medium" : ""
          )}>
            <div className={classNames(
              "w-2 h-2 rounded-full mb-1",
              step === FlowMapStep.LayoutStructure || getProgressPercentage() > 20 ? "bg-purple-500" : "bg-bolt-elements-background-depth-3"
            )} />
            Layout
          </div>
          <div className={classNames(
            "flex flex-col items-center",
            step === FlowMapStep.DesignSystem ? "text-purple-500 font-medium" : ""
          )}>
            <div className={classNames(
              "w-2 h-2 rounded-full mb-1",
              step === FlowMapStep.DesignSystem || getProgressPercentage() > 40 ? "bg-purple-500" : "bg-bolt-elements-background-depth-3"
            )} />
            Design
          </div>
          <div className={classNames(
            "flex flex-col items-center",
            step === FlowMapStep.VisualElements ? "text-purple-500 font-medium" : ""
          )}>
            <div className={classNames(
              "w-2 h-2 rounded-full mb-1",
              step === FlowMapStep.VisualElements || getProgressPercentage() > 60 ? "bg-purple-500" : "bg-bolt-elements-background-depth-3"
            )} />
            Visual
          </div>
          <div className={classNames(
            "flex flex-col items-center",
            step === FlowMapStep.Functionality ? "text-purple-500 font-medium" : ""
          )}>
            <div className={classNames(
              "w-2 h-2 rounded-full mb-1",
              step === FlowMapStep.Functionality || getProgressPercentage() > 80 ? "bg-purple-500" : "bg-bolt-elements-background-depth-3"
            )} />
            Function
          </div>
          <div className={classNames(
            "flex flex-col items-center",
            step === FlowMapStep.DesignSummary ? "text-purple-500 font-medium" : ""
          )}>
            <div className={classNames(
              "w-2 h-2 rounded-full mb-1",
              step === FlowMapStep.DesignSummary ? "bg-purple-500" : "bg-bolt-elements-background-depth-3"
            )} />
            Summary
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          {/* Left panel with form */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {children}
          </div>

          {/* Right panel with live preview */}
          <div className="w-1/2 border-l border-bolt-elements-borderColor">
            <LivePreview />
          </div>
        </div>
      </div>

      {/* Footer with navigation buttons */}
      <div className="bg-bolt-elements-background-depth-2 p-4 border-t border-bolt-elements-borderColor flex justify-between">
        {showBackButton ? (
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <div className="i-ph:arrow-left text-lg" />
            Back
          </Button>
        ) : (
          <div></div>
        )}

        {showContinueButton && (
          <Button
            onClick={handleContinue}
            className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
            disabled={disableContinue}
          >
            {continueButtonText}
            <div className="i-ph:arrow-right text-lg" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FlowMapLayout;
