import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore, analyzeProject, type MicroLesson, type ProjectConcept, generateFileExplanation } from '~/lib/stores/projectContext';
import { Button } from '~/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';

interface CodeExplainerProps {
  filePath?: string;
  isVisible: boolean;
  onClose: () => void;
}

export const CodeExplainer: React.FC<CodeExplainerProps> = ({ filePath, isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('explanation');
  const projectContext = useStore(projectContextStore);
  const [relatedLessons, setRelatedLessons] = useState<MicroLesson[]>([]);
  const [relatedConcepts, setRelatedConcepts] = useState<ProjectConcept[]>([]);
  
  useEffect(() => {
    if (filePath) {
      // Find related lessons for this file
      const lessons = projectContext.microLessons.filter(lesson => 
        lesson.relatedFiles.some(file => file === filePath || filePath.includes(file))
      );
      setRelatedLessons(lessons);
      
      // Find related concepts for this file
      const concepts = projectContext.concepts.filter(concept => 
        concept.usageInProject.files.some(file => file === filePath || filePath.includes(file))
      );
      setRelatedConcepts(concepts);
    }
  }, [filePath, projectContext]);
  
  // Get file explanation if available
  const fileExplanation = filePath ? (
    projectContext.fileExplanations[filePath] || generateFileExplanation(filePath)
  ) : '';
  
  const handleRefreshContext = async () => {
    await analyzeProject();
  };
  
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
          <div className="i-ph:book-open-text text-blue-500 mr-2" />
          Learn About This Code
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefreshContext}
            title="Refresh context"
          >
            <div className="i-ph:arrows-clockwise" />
          </Button>
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-3 pt-2 border-b border-bolt-elements-borderColor">
          <TabsTrigger value="explanation" className="text-xs">Explanation</TabsTrigger>
          <TabsTrigger value="lessons" className="text-xs">Lessons ({relatedLessons.length})</TabsTrigger>
          <TabsTrigger value="concepts" className="text-xs">Concepts ({relatedConcepts.length})</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-auto">
          <TabsContent value="explanation" className="p-4 h-full">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {fileExplanation ? (
                <div dangerouslySetInnerHTML={{ __html: fileExplanation }} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="i-ph:file-text text-4xl text-bolt-elements-textTertiary mb-2" />
                  <p className="text-sm text-bolt-elements-textSecondary">No file selected.</p>
                  <p className="text-xs text-bolt-elements-textTertiary mt-1">
                    Select a file to see an explanation.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="lessons" className="h-full">
            {relatedLessons.length > 0 ? (
              <div className="space-y-3 p-4">
                {relatedLessons.map(lesson => (
                  <div 
                    key={lesson.id}
                    className="bg-bolt-elements-background-depth-2 rounded-md p-3 border border-bolt-elements-borderColor"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-bolt-elements-textPrimary">{lesson.title}</h4>
                        <p className="text-xs text-bolt-elements-textSecondary mt-1">{lesson.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          {lesson.estimatedTime}
                        </span>
                        <span className="text-xs text-bolt-elements-textTertiary mt-1">
                          {lesson.technology}
                        </span>
                      </div>
                    </div>
                    
                    {lesson.codeExample && (
                      <div className="mt-2 text-xs">
                        <details>
                          <summary className="cursor-pointer text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary">
                            View Code Example
                          </summary>
                          <pre className="mt-2 p-2 bg-bolt-elements-background-depth-3 rounded overflow-x-auto">
                            <code>{lesson.codeExample}</code>
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="i-ph:book-bookmark text-4xl text-bolt-elements-textTertiary mb-2" />
                <p className="text-sm text-bolt-elements-textSecondary">No lessons found for this file.</p>
                <p className="text-xs text-bolt-elements-textTertiary mt-1">
                  Visit the Vibe Learning tab for all available lessons.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="concepts" className="h-full">
            {relatedConcepts.length > 0 ? (
              <div className="space-y-3 p-4">
                {relatedConcepts.map(concept => (
                  <div 
                    key={concept.id}
                    className="bg-bolt-elements-background-depth-2 rounded-md p-3 border border-bolt-elements-borderColor"
                  >
                    <h4 className="text-sm font-medium text-bolt-elements-textPrimary">{concept.name}</h4>
                    <p className="text-xs text-bolt-elements-textSecondary mt-1">{concept.description}</p>
                    
                    {concept.examples.length > 0 && (
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-bolt-elements-textSecondary">Examples:</h5>
                        <ul className="list-disc pl-5 text-xs text-bolt-elements-textSecondary mt-1">
                          {concept.examples.map((example, index) => (
                            <li key={index}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {concept.learnMoreUrl && (
                      <div className="mt-2">
                        <a 
                          href={concept.learnMoreUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:text-blue-600 flex items-center"
                        >
                          Learn more <div className="i-ph:arrow-right ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="i-ph:lightbulb text-4xl text-bolt-elements-textTertiary mb-2" />
                <p className="text-sm text-bolt-elements-textSecondary">No concepts found for this file.</p>
                <p className="text-xs text-bolt-elements-textTertiary mt-1">
                  Visit the Vibe Learning tab to explore all concepts.
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};
