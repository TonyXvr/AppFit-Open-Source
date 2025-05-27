import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore, generateFileExplanation } from '~/lib/stores/projectContext';
import { Button } from '~/components/ui/Button';

interface CodeQuickTipsProps {
  filePath?: string;
  isVisible: boolean;
  onClose: () => void;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const CodeQuickTips: React.FC<CodeQuickTipsProps> = ({
  filePath,
  isVisible,
  onClose
}) => {
  const projectContext = useStore(projectContextStore);
  const [tips, setTips] = useState<Tip[]>([]);

  // Get file extension for context
  const fileExtension = filePath ? filePath.split('.').pop()?.toLowerCase() : '';
  const fileName = filePath ? filePath.split('/').pop() : '';

  // Generate tips based on file type and project context
  useEffect(() => {
    if (filePath) {
      const newTips: Tip[] = [];

      // Add general tips for all files
      newTips.push({
        id: 'general-1',
        title: 'What is this file?',
        description: `This file (${fileName}) contains code that helps your application work. It's like a piece of a puzzle that fits with other files to create your complete app.`,
        icon: 'i-ph:file-text'
      });

      // Add file-specific tips based on extension
      if (fileExtension === 'tsx' || fileExtension === 'jsx') {
        newTips.push({
          id: 'react-1',
          title: 'React Component',
          description: 'This is a React component file. It defines a part of your user interface, like a button, form, or section of a page.',
          icon: 'i-ph:atom'
        });

        newTips.push({
          id: 'react-2',
          title: 'JSX Syntax',
          description: 'The code that looks like HTML is called JSX. It lets you write HTML-like code in JavaScript to create user interfaces.',
          icon: 'i-ph:code'
        });
      }
      else if (fileExtension === 'ts' || fileExtension === 'js') {
        newTips.push({
          id: 'js-1',
          title: 'JavaScript/TypeScript',
          description: 'This file contains logic that makes your application work. It might include functions, data processing, or business rules.',
          icon: 'i-ph:function'
        });

        if (fileExtension === 'ts') {
          newTips.push({
            id: 'ts-1',
            title: 'TypeScript Benefits',
            description: 'TypeScript adds type checking to JavaScript, which helps catch errors before your code runs and makes it easier to understand.',
            icon: 'i-ph:check-square'
          });
        }
      }
      else if (fileExtension === 'css' || fileExtension === 'scss') {
        newTips.push({
          id: 'css-1',
          title: 'Styling File',
          description: 'This file controls how your application looks. It defines colors, layouts, spacing, and other visual aspects.',
          icon: 'i-ph:paint-brush'
        });
      }
      else if (fileExtension === 'json') {
        newTips.push({
          id: 'json-1',
          title: 'Configuration File',
          description: 'This JSON file stores settings or data for your application in a structured format that is easy for computers to read.',
          icon: 'i-ph:gear'
        });
      }
      else if (fileExtension === 'md') {
        newTips.push({
          id: 'md-1',
          title: 'Documentation',
          description: 'This Markdown file contains documentation that explains how to use or understand parts of your project.',
          icon: 'i-ph:book-open'
        });
      }

      // Add project-specific tips
      if (projectContext.summary.technologies.includes('React')) {
        newTips.push({
          id: 'project-react',
          title: 'Part of a React Project',
          description: 'This file is part of a React application, which uses components to build interactive user interfaces.',
          icon: 'i-ph:atom'
        });
      }

      if (projectContext.summary.technologies.includes('TypeScript')) {
        newTips.push({
          id: 'project-ts',
          title: 'TypeScript Project',
          description: 'Your project uses TypeScript to add type safety to JavaScript, making your code more reliable and easier to maintain.',
          icon: 'i-ph:check-square'
        });
      }

      if (projectContext.summary.technologies.includes('Tailwind CSS')) {
        newTips.push({
          id: 'project-tailwind',
          title: 'Tailwind CSS',
          description: 'Your project uses Tailwind CSS, which lets you style elements using class names directly in your HTML/JSX.',
          icon: 'i-ph:paint-brush'
        });
      }

      // Limit to 5 tips maximum
      setTips(newTips.slice(0, 5));
    }
  }, [filePath, projectContext]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute bottom-0 right-0 w-full md:w-1/3 bg-bolt-elements-background-depth-1 border-l border-t border-bolt-elements-borderColor rounded-tl-lg shadow-lg z-10 max-h-[50vh] overflow-hidden flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-3 border-b border-bolt-elements-borderColor">
        <h3 className="text-sm font-medium text-bolt-elements-textPrimary flex items-center">
          <div className="i-ph:lightbulb-filament text-amber-500 mr-2" />
          Quick Tips for {fileName || 'This File'}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            title="Close"
          >
            <div className="i-ph:x" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {tips.length > 0 ? (
          <div className="space-y-4">
            {tips.map(tip => (
              <motion.div
                key={tip.id}
                className="p-3 rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start">
                  <div className={`${tip.icon} text-lg mr-3 mt-0.5 text-amber-500`} />
                  <div>
                    <h4 className="font-medium text-bolt-elements-textPrimary">{tip.title}</h4>
                    <p className="text-sm text-bolt-elements-textSecondary mt-1">{tip.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="i-ph:file-text text-4xl text-bolt-elements-textTertiary mb-2" />
            <p className="text-sm text-bolt-elements-textSecondary">No file selected.</p>
            <p className="text-xs text-bolt-elements-textTertiary mt-1">
              Select a file to see quick tips.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
