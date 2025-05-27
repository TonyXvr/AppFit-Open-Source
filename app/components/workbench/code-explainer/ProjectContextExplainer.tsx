import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore, analyzeProject, type ProjectInsight, type FileRelationship } from '~/lib/stores/projectContext';
import { Button } from '~/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';

interface ProjectContextExplainerProps {
  filePath?: string;
  isVisible: boolean;
  onClose: () => void;
}

export const ProjectContextExplainer: React.FC<ProjectContextExplainerProps> = ({
  filePath,
  isVisible,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<string>('project');
  const projectContext = useStore(projectContextStore);
  const [relatedInsights, setRelatedInsights] = useState<ProjectInsight[]>([]);
  const [fileRelationship, setFileRelationship] = useState<FileRelationship | null>(null);

  // Get file name for display
  const fileName = filePath ? filePath.split('/').pop() : '';

  useEffect(() => {
    if (filePath) {
      // Find insights related to this file
      const insights = projectContext.insights.filter(insight =>
        insight.relatedFiles.some(file => file === filePath || filePath.includes(file))
      );
      setRelatedInsights(insights);

      // Get file relationship information
      const relationship = projectContext.fileRelationships[filePath];
      setFileRelationship(relationship || null);
    }
  }, [filePath, projectContext]);

  const handleRefreshContext = async () => {
    await analyzeProject();
  };

  // Determine if the current file is a key file in the project
  const isKeyFile = projectContext.keyFiles.includes(filePath || '');

  // Generate relationship explanation between file and project
  const generateRelationshipExplanation = () => {
    if (!filePath) return '<p>Select a file to see how it relates to the project.</p>';

    const extension = filePath.split('.').pop()?.toLowerCase();
    let relationship = '';

    if (isKeyFile) {
      relationship = `<p><strong>${fileName}</strong> is a key file in your project. It plays a critical role in the overall functionality.</p>`;
    } else {
      relationship = `<p><strong>${fileName}</strong> is part of your project structure.</p>`;
    }

    // Add more specific relationship based on file type
    switch (extension) {
      case 'tsx':
      case 'jsx':
        relationship += `
          <p>As a React component file, it contributes to the user interface of your application.
          ${projectContext.summary.type.includes('React') ? 'It fits into the React-based architecture of your project.' : ''}
          </p>
        `;
        break;
      case 'ts':
      case 'js':
        relationship += `
          <p>This JavaScript/TypeScript file likely contains logic, utilities, or data structures used by other parts of your application.
          ${projectContext.summary.technologies.includes('TypeScript') ? 'It leverages TypeScript for type safety, which is a key technology in your project.' : ''}
          </p>
        `;
        break;
      case 'css':
      case 'scss':
        relationship += `
          <p>This stylesheet file defines the visual appearance of components in your application.
          ${projectContext.summary.technologies.includes('Tailwind CSS') ? 'Your project also uses Tailwind CSS for styling.' : ''}
          </p>
        `;
        break;
      case 'json':
        if (filePath.includes('package.json')) {
          relationship += `
            <p>This is your project's package.json file, which defines dependencies and scripts for your application.
            It's a critical configuration file that determines what libraries your project uses.</p>
          `;
        } else {
          relationship += `
            <p>This JSON configuration file stores structured data used by your application or its build tools.</p>
          `;
        }
        break;
    }

    return relationship;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 bg-bolt-elements-background-depth-1 border-b border-bolt-elements-borderColor shadow-lg z-10 max-h-[60vh] overflow-hidden flex flex-col"
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-3 border-b border-bolt-elements-borderColor">
        <h3 className="text-sm font-medium text-bolt-elements-textPrimary flex items-center">
          <div className="i-ph:map-trifold text-purple-500 mr-2" />
          Project Context
          {fileName && <span className="ml-1 text-bolt-elements-textSecondary">/ {fileName}</span>}
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
          <TabsTrigger value="project" className="text-xs">Project Overview</TabsTrigger>
          <TabsTrigger value="relationship" className="text-xs">File Relationship</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">Insights ({relatedInsights.length})</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="project" className="p-4 h-full">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2>{projectContext.summary.name}</h2>
              <p>{projectContext.summary.description}</p>

              <h3>Project Type</h3>
              <p>{projectContext.summary.type}</p>

              {projectContext.summary.architecture && (
                <>
                  <h3>Architecture</h3>
                  <p>{projectContext.summary.architecture}</p>
                </>
              )}

              <h3>Technologies</h3>
              {projectContext.summary.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {projectContext.summary.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p>No technologies detected yet.</p>
              )}

              <h3>Main Features</h3>
              {projectContext.summary.mainFeatures.length > 0 ? (
                <ul>
                  {projectContext.summary.mainFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p>No main features detected yet.</p>
              )}

              <h3>Key Files</h3>
              {projectContext.keyFiles.length > 0 ? (
                <ul>
                  {projectContext.keyFiles.slice(0, 5).map((file, index) => (
                    <li key={index} className="text-sm">
                      {file.split('/').pop()}
                      {file === filePath && ' (current file)'}
                    </li>
                  ))}
                  {projectContext.keyFiles.length > 5 && (
                    <li className="text-sm text-bolt-elements-textTertiary">
                      ...and {projectContext.keyFiles.length - 5} more
                    </li>
                  )}
                </ul>
              ) : (
                <p>No key files detected yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="relationship" className="p-4 h-full">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2>How {fileName || 'This File'} Fits Into Your Project</h2>

              <div dangerouslySetInnerHTML={{ __html: generateRelationshipExplanation() }} />

              <h3>File Dependencies</h3>
              {fileRelationship ? (
                <div>
                  <p>
                    This file is a <strong>{fileRelationship.role}</strong> with
                    <strong> {fileRelationship.importance}</strong> importance in your project.
                  </p>

                  {fileRelationship.imports.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Imports:</h4>
                      <ul className="list-disc pl-5 text-xs">
                        {fileRelationship.imports.slice(0, 5).map((imp, index) => (
                          <li key={index}>{imp.split('/').pop()}</li>
                        ))}
                        {fileRelationship.imports.length > 5 && (
                          <li className="text-bolt-elements-textTertiary">...and {fileRelationship.imports.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {fileRelationship.importedBy.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Imported By:</h4>
                      <ul className="list-disc pl-5 text-xs">
                        {fileRelationship.importedBy.slice(0, 5).map((imp, index) => (
                          <li key={index}>{imp.split('/').pop()}</li>
                        ))}
                        {fileRelationship.importedBy.length > 5 && (
                          <li className="text-bolt-elements-textTertiary">...and {fileRelationship.importedBy.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {fileRelationship.relatedFiles.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Related Files:</h4>
                      <ul className="list-disc pl-5 text-xs">
                        {fileRelationship.relatedFiles.slice(0, 5).map((file, index) => (
                          <li key={index}>{file.split('/').pop()}</li>
                        ))}
                        {fileRelationship.relatedFiles.length > 5 && (
                          <li className="text-bolt-elements-textTertiary">...and {fileRelationship.relatedFiles.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p>
                  This file may be connected to other files in your project through imports, exports,
                  or functional relationships. Understanding these connections helps you see how changes
                  in one file might affect others.
                </p>
              )}

              {isKeyFile && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-md mt-4">
                  <h4 className="text-amber-800 dark:text-amber-300 text-sm font-medium flex items-center">
                    <div className="i-ph:star-fill mr-1.5" />
                    Key File
                  </h4>
                  <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">
                    This is identified as a key file in your project, which means it plays an important role
                    in the overall functionality or structure.
                  </p>
                </div>
              )}

              <h3>Suggested Learning Path</h3>
              <p>
                To better understand how this file works within your project, consider exploring:
              </p>
              <ul>
                {projectContext.suggestedTopics.slice(0, 3).map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
                <li>The project's architecture and data flow</li>
                <li>Related files and components</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="h-full">
            {relatedInsights.length > 0 ? (
              <div className="space-y-3 p-4">
                {relatedInsights.map(insight => (
                  <div
                    key={insight.id}
                    className="bg-bolt-elements-background-depth-2 rounded-md p-3 border border-bolt-elements-borderColor"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`
                        ${insight.type === 'tip' ? 'i-ph:lightbulb-fill text-blue-500' :
                          insight.type === 'warning' ? 'i-ph:warning-fill text-amber-500' :
                          insight.type === 'improvement' ? 'i-ph:arrow-up-right-fill text-green-500' :
                          'i-ph:pattern-fill text-purple-500'}
                        text-lg mt-0.5
                      `} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-bolt-elements-textPrimary">{insight.title}</h4>
                        <p className="text-xs text-bolt-elements-textSecondary mt-1">{insight.description}</p>

                        {insight.solution && (
                          <div className="mt-2 text-xs">
                            <h5 className="font-medium text-bolt-elements-textSecondary">Suggested Solution:</h5>
                            <p className="text-bolt-elements-textSecondary mt-0.5">{insight.solution}</p>
                          </div>
                        )}

                        <div className="mt-2 flex items-center">
                          <span className={`
                            inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                            ${insight.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              insight.impact === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}
                          `}>
                            {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="i-ph:magnifying-glass text-4xl text-bolt-elements-textTertiary mb-2" />
                <p className="text-sm text-bolt-elements-textSecondary">No insights found for this file.</p>
                <p className="text-xs text-bolt-elements-textTertiary mt-1">
                  Try refreshing the project context or selecting a different file.
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};
