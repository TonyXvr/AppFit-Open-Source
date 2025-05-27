import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore } from '~/lib/stores/projectContext';
import type { ProjectConcept } from '~/lib/stores/projectContext';
import { ConceptGenerationService } from '~/lib/services/conceptGenerationService';
import { toast } from 'react-toastify';

interface ProjectConceptsProps {
  // Add any props needed
}

export const ProjectConcepts: React.FC<ProjectConceptsProps> = () => {
  const [selectedConcept, setSelectedConcept] = useState<ProjectConcept | null>(null);
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const projectContext = useStore(projectContextStore);

  // Generate concepts if we don't have any
  useEffect(() => {
    if (projectContext.concepts.length === 0) {
      setIsLoading(true);
      ConceptGenerationService.generateProjectConcepts()
        .then(() => {
          // The service updates the store directly
          toast.success('Generated project concepts');
        })
        .catch(error => {
          console.error('Error generating project concepts:', error);
          toast.error(error.message || 'Failed to generate project concepts');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [projectContext.concepts.length]);

  const toggleExpanded = (conceptId: string) => {
    setExpandedConcepts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conceptId)) {
        newSet.delete(conceptId);
      } else {
        newSet.add(conceptId);
      }
      return newSet;
    });
  };

  // Group concepts by technology
  const conceptsByTechnology: Record<string, ProjectConcept[]> = {};

  projectContext.concepts.forEach(concept => {
    if (!conceptsByTechnology[concept.technology]) {
      conceptsByTechnology[concept.technology] = [];
    }
    conceptsByTechnology[concept.technology].push(concept);
  });

  // If a concept is selected, show the concept details
  if (selectedConcept) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSelectedConcept(null)}
            className="text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary transition-colors flex items-center"
          >
            <div className="i-ph:arrow-left mr-1.5" />
            Back to Concepts
          </button>

          <a
            href={selectedConcept.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors flex items-center text-sm"
          >
            <div className="i-ph:book-open mr-1.5" />
            Learn More
          </a>
        </div>

        <div className="bg-bolt-elements-background-depth-1 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className={`p-2 rounded-lg mr-3 ${
                selectedConcept.technology === 'React' ? 'bg-blue-500/10 text-blue-500' :
                selectedConcept.technology === 'TypeScript' ? 'bg-blue-500/10 text-blue-500' :
                selectedConcept.technology === 'Tailwind CSS' ? 'bg-purple-500/10 text-purple-500' :
                'bg-green-500/10 text-green-500'
              }`}>
                <div className={
                  selectedConcept.technology === 'React' ? 'i-ph:atom text-xl' :
                  selectedConcept.technology === 'TypeScript' ? 'i-ph:code text-xl' :
                  selectedConcept.technology === 'Tailwind CSS' ? 'i-ph:paint-brush text-xl' :
                  'i-ph:code text-xl'
                } />
              </div>

              <div>
                <h2 className="text-xl font-medium text-bolt-elements-textPrimary">{selectedConcept.name}</h2>
                <p className="text-sm text-bolt-elements-textTertiary">{selectedConcept.technology}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-bolt-elements-textTertiary uppercase tracking-wider mb-2">Description</h3>
                <p className="text-bolt-elements-textSecondary">{selectedConcept.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-bolt-elements-textTertiary uppercase tracking-wider mb-2">Examples</h3>
                <ul className="space-y-2">
                  {selectedConcept.examples.map((example, index) => (
                    <li key={index} className="bg-bolt-elements-background-depth-2 p-3 rounded-md text-bolt-elements-textSecondary">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedConcept.usageInProject.files.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-bolt-elements-textTertiary uppercase tracking-wider mb-2">
                    Usage in Your Project
                  </h3>

                  <div className="space-y-3">
                    {selectedConcept.usageInProject.examples.map((example, index) => (
                      <p key={index} className="text-bolt-elements-textSecondary">{example}</p>
                    ))}

                    <div className="mt-2">
                      <h4 className="text-xs font-medium text-bolt-elements-textTertiary mb-2">Related Files</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedConcept.usageInProject.files.map((file, index) => (
                          <div key={index} className="bg-bolt-elements-background-depth-2 px-2 py-1 rounded flex items-center">
                            <div className="i-ph:file-code text-amber-500 mr-1.5" />
                            <span className="text-xs text-bolt-elements-textSecondary">{file.split('/').pop()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedConcept.relatedConcepts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-bolt-elements-textTertiary uppercase tracking-wider mb-2">
                    Related Concepts
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {selectedConcept.relatedConcepts.map((concept, index) => (
                      <div
                        key={index}
                        className="bg-bolt-elements-background-depth-2 px-3 py-1.5 rounded-full text-sm text-bolt-elements-textSecondary"
                      >
                        {concept}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedConcept.learnMoreUrl && (
                <div className="pt-4 border-t border-bolt-elements-borderColor">
                  <a
                    href={selectedConcept.learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <div className="i-ph:book-open mr-1.5" />
                    Learn more about {selectedConcept.name}
                    <div className="i-ph:arrow-up-right ml-1.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
            <div className="i-ph:brain text-purple-500 mr-2" />
            Project Concepts
          </h3>
          <p className="text-xs text-bolt-elements-textTertiary">Learn about the concepts used in your project</p>
        </div>
        <button
          onClick={() => {
            setIsLoading(true);
            ConceptGenerationService.generateProjectConcepts()
              .then(() => {
                toast.success('Generated project concepts');
              })
              .catch(error => {
                console.error('Error generating project concepts:', error);
                toast.error(error.message || 'Failed to generate project concepts');
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
          className="text-xs bg-bolt-elements-background-depth-2 px-3 py-1.5 rounded-full text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors flex items-center border border-bolt-elements-borderColor"
          disabled={isLoading}
        >
          <div className={`i-ph:arrows-clockwise mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Concepts
        </button>
      </div>

      {/* Concepts by technology */}
      {Object.entries(conceptsByTechnology).map(([technology, concepts]) => (
        <div key={technology} className="mb-8">
          <div className="flex items-center mb-3 bg-bolt-elements-background-depth-2 px-4 py-2 rounded-lg border border-bolt-elements-borderColor">
            <div className={
              technology === 'React' ? 'i-ph:atom text-blue-500 text-xl mr-2' :
              technology === 'TypeScript' ? 'i-ph:code text-blue-500 text-xl mr-2' :
              technology === 'JavaScript' ? 'i-ph:code-simple text-yellow-500 text-xl mr-2' :
              technology === 'Tailwind CSS' ? 'i-ph:paint-brush text-purple-500 text-xl mr-2' :
              technology === 'CSS' ? 'i-ph:paint-brush text-purple-500 text-xl mr-2' :
              technology === 'HTML' ? 'i-ph:code text-orange-500 text-xl mr-2' :
              'i-ph:code text-green-500 text-xl mr-2'
            } />
            <h4 className="font-medium text-bolt-elements-textPrimary">{technology} Concepts</h4>
            <div className="ml-2 px-2 py-0.5 bg-bolt-elements-background-depth-1 rounded-full text-xs text-bolt-elements-textTertiary">
              {concepts.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {concepts.map(concept => (
              <motion.div
                key={concept.id}
                className="bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor overflow-hidden h-full flex flex-col"
                whileHover={{ scale: 1.01, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div
                  className="p-4 cursor-pointer flex-1"
                  onClick={() => toggleExpanded(concept.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className={
                        concept.technology === 'React' ? 'i-ph:atom text-blue-500 mr-2 text-lg' :
                        concept.technology === 'TypeScript' ? 'i-ph:code text-blue-500 mr-2 text-lg' :
                        concept.technology === 'JavaScript' ? 'i-ph:code-simple text-yellow-500 mr-2 text-lg' :
                        concept.technology === 'Tailwind CSS' ? 'i-ph:paint-brush text-purple-500 mr-2 text-lg' :
                        concept.technology === 'CSS' ? 'i-ph:paint-brush text-purple-500 mr-2 text-lg' :
                        concept.technology === 'HTML' ? 'i-ph:code text-orange-500 mr-2 text-lg' :
                        'i-ph:code text-green-500 mr-2 text-lg'
                      } />
                      <h5 className="font-medium text-bolt-elements-textPrimary">{concept.name}</h5>
                    </div>

                    <div className={`i-ph:caret-down transition-transform ${expandedConcepts.has(concept.id) ? 'rotate-180' : ''}`} />
                  </div>

                  <p className="text-sm text-bolt-elements-textSecondary">{concept.description}</p>
                </div>

                {expandedConcepts.has(concept.id) && (
                  <div className="border-t border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 p-4">
                    <div className="space-y-4">
                      <div>
                        <h6 className="text-xs font-medium text-bolt-elements-textPrimary flex items-center mb-2">
                          <div className="i-ph:code-block mr-1.5 text-bolt-elements-textTertiary" />
                          Examples
                        </h6>
                        <ul className="space-y-1 pl-5 list-disc">
                          {concept.examples.map((example, index) => (
                            <li key={index} className="text-sm text-bolt-elements-textSecondary">{example}</li>
                          ))}
                        </ul>
                      </div>

                      {concept.usageInProject.files.length > 0 && (
                        <div>
                          <h6 className="text-xs font-medium text-bolt-elements-textPrimary flex items-center mb-2">
                            <div className="i-ph:file-code mr-1.5 text-bolt-elements-textTertiary" />
                            Used in {concept.usageInProject.files.length} files
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {concept.usageInProject.files.slice(0, 3).map((file, index) => (
                              <div key={index} className="bg-bolt-elements-background-depth-1 px-2 py-1 rounded-md flex items-center border border-bolt-elements-borderColor">
                                <div className="i-ph:file-code text-amber-500 mr-1.5" />
                                <span className="text-xs text-bolt-elements-textSecondary">{file.split('/').pop()}</span>
                              </div>
                            ))}
                            {concept.usageInProject.files.length > 3 && (
                              <div className="bg-bolt-elements-background-depth-1 px-2 py-1 rounded-md text-xs text-bolt-elements-textTertiary border border-bolt-elements-borderColor">
                                +{concept.usageInProject.files.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <a
                          href={concept.learnMoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary transition-colors flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="i-ph:book-open mr-1" />
                          Learn More
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedConcept(concept);
                          }}
                          className="text-xs text-blue-500 hover:text-blue-600 transition-colors flex items-center"
                        >
                          View Details
                          <div className="i-ph:arrow-right ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Loading state or empty state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin i-ph:circle-notch w-10 h-10 text-purple-500 mb-4" />
          <p className="text-bolt-elements-textSecondary font-medium">Analyzing your project...</p>
          <p className="text-bolt-elements-textTertiary text-sm mt-2">This may take a moment as we scan your code</p>
        </div>
      ) : projectContext.concepts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-bolt-elements-background-depth-2 p-6 rounded-full mb-6">
            <div className="i-ph:code-block w-12 h-12 text-purple-500" />
          </div>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">No Concepts Found</h3>
          <p className="text-bolt-elements-textSecondary max-w-md">
            We need to analyze your project to identify key programming concepts used in your code.
            Click the button below to start the analysis.
          </p>
          <button
            className="mt-6 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center"
            onClick={() => {
              setIsLoading(true);
              ConceptGenerationService.generateProjectConcepts()
                .then(() => {
                  toast.success('Generated project concepts');
                })
                .catch(error => {
                  console.error('Error generating project concepts:', error);
                  toast.error(error.message || 'Failed to generate project concepts');
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
          >
            <div className="i-ph:code mr-2" />
            Analyze Code Now
          </button>
        </div>
      ) : null}
    </div>
  );
};
