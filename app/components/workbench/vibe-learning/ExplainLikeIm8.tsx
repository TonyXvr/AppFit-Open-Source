import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore } from '~/lib/stores/projectContext';

interface ExplainLikeIm8Props {
  // Add any props needed for this component
}

export const ExplainLikeIm8: React.FC<ExplainLikeIm8Props> = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const projectContext = useStore(projectContextStore);
  const [explanationSteps, setExplanationSteps] = useState<Array<{title: string; content: string; icon: string}>>([]);

  // Generate project-specific explanations based on project context
  useEffect(() => {
    // Default explanations that are always included
    const defaultExplanations = [
      {
        title: "What is this website?",
        content: "This website is like a magical toy factory! You tell it what kind of toy you want to build, and it helps you create it without needing to know all the complicated stuff.",
        icon: "i-ph:browser"
      },
      {
        title: "How does it work?",
        content: "It's like having a super smart friend who knows how to build things. You just tell your friend what you want, and they help you put all the pieces together in the right way!",
        icon: "i-ph:gear"
      },
      {
        title: "What are these files?",
        content: "Think of these files like different parts of a toy. Some files are like the toy's body, some are like its colors and decorations, and others tell the toy how to move and do cool things!",
        icon: "i-ph:file-text"
      }
    ];

    // Project-specific explanations based on technologies
    const techExplanations: Array<{title: string; content: string; icon: string}> = [];

    if (projectContext.summary.technologies.includes('React')) {
      techExplanations.push({
        title: "What is React?",
        content: "React is like building with special LEGO blocks that can change their shape and color all by themselves! When you want your toy to do something new, these blocks can update without having to rebuild the whole toy.",
        icon: "i-ph:atom"
      });
    }

    if (projectContext.summary.technologies.includes('TypeScript')) {
      techExplanations.push({
        title: "What is TypeScript?",
        content: "TypeScript is like having special labels on all your toy parts. These labels tell you exactly where each part should go and warn you if you try to put the wrong pieces together. It helps you build your toy correctly!",
        icon: "i-ph:code"
      });
    }

    if (projectContext.summary.technologies.includes('Tailwind CSS')) {
      techExplanations.push({
        title: "What is Tailwind CSS?",
        content: "Tailwind CSS is like having a huge box of pre-mixed paints. Instead of having to mix colors yourself, you can just pick the exact color, size, or style you want from the box and use it right away!",
        icon: "i-ph:paint-brush"
      });
    }

    // Generic explanations to fill in if we don't have enough project-specific ones
    const genericExplanations = [
      {
        title: "What is code?",
        content: "Code is like giving instructions to a robot. You have to be very clear and use special words the robot understands. When you write good instructions, the robot can do amazing things!",
        icon: "i-ph:code"
      },
      {
        title: "What is a website?",
        content: "A website is like a digital book that lives on the internet. But unlike regular books, websites can have buttons you can press, videos you can watch, and games you can play!",
        icon: "i-ph:globe"
      }
    ];

    // Combine explanations, prioritizing project-specific ones
    const combinedExplanations = [
      ...defaultExplanations,
      ...techExplanations,
      ...genericExplanations.slice(0, Math.max(0, 5 - defaultExplanations.length - techExplanations.length))
    ];

    setExplanationSteps(combinedExplanations);
  }, [projectContext]);

  const handleNext = () => {
    if (currentStep < explanationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0); // Loop back to the beginning
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setCurrentStep(explanationSteps.length - 1); // Loop to the end
    }
  };

  // Get current explanation with safety check
  const currentExplanation = explanationSteps.length > 0 ? explanationSteps[currentStep] : null;

  // Show loading state if no explanations yet
  if (!currentExplanation) {
    return (
      <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-lg p-4 shadow-sm border border-blue-500/10">
        <div className="flex items-center mb-4">
          <div className="bg-blue-500 text-white p-2 rounded-lg mr-3">
            <div className="i-ph:smiley text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-bolt-elements-textPrimary">
              Explain Like I'm 8
            </h3>
            <p className="text-sm text-bolt-elements-textSecondary">
              Simple explanations anyone can understand
            </p>
          </div>
        </div>

        <div className="bg-bolt-elements-background-depth-1 rounded-lg p-6 mb-4 flex flex-col items-center justify-center">
          <div className="i-ph:spinner animate-spin text-3xl text-blue-500 mb-3" />
          <p className="text-bolt-elements-textSecondary">Loading explanations...</p>
          <p className="text-xs text-bolt-elements-textTertiary mt-2">Tailoring content to your project</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-lg p-4 shadow-sm border border-blue-500/10">
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 text-white p-2 rounded-lg mr-3">
          <div className="i-ph:smiley text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">
            Explain Like I'm 8
          </h3>
          <p className="text-sm text-bolt-elements-textSecondary">
            Simple explanations anyone can understand
          </p>
        </div>
      </div>

      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-6 mb-4 relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 h-1 bg-blue-200 w-full">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${explanationSteps.length > 0 ? ((currentStep + 1) / explanationSteps.length) * 100 : 0}%` }}
          />
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="pt-2"
        >
          <div className="flex items-center mb-3">
            <div className={`${currentExplanation.icon} text-3xl text-blue-500 mr-3`} />
            <h4 className="text-xl font-medium text-bolt-elements-textPrimary">{currentExplanation.title}</h4>
          </div>

          <div className="text-lg leading-relaxed text-bolt-elements-textSecondary mb-6 font-light">
            {currentExplanation.content}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-bolt-elements-textTertiary">
              Step {currentStep + 1} of {explanationSteps.length}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                className="p-2 rounded-full bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3 transition-colors"
              >
                <div className="i-ph:caret-left text-bolt-elements-textSecondary" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white"
              >
                <div className="i-ph:caret-right" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {explanationSteps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`p-2 rounded-md transition-all ${currentStep === index
              ? 'bg-blue-500 text-white'
              : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textTertiary hover:bg-bolt-elements-background-depth-2'}`}
          >
            <div className={`${step.icon} mx-auto`} />
          </button>
        ))}
      </div>
    </div>
  );
};
