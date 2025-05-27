import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore } from '~/lib/stores/projectContext';
import type { MicroLesson } from '~/lib/stores/projectContext';
import { AILearningService } from '~/lib/services/aiLearningService';
import { AICommunicationService } from '~/lib/services/aiCommunicationService';
import { toast } from 'react-toastify';

interface MicroLessonsProps {
  // Add any props needed
}

export const MicroLessons: React.FC<MicroLessonsProps> = () => {
  const [selectedLesson, setSelectedLesson] = useState<MicroLesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const projectContext = useStore(projectContextStore);

  // Load completed lessons from localStorage and generate lessons
  useEffect(() => {
    const savedCompletedLessons = localStorage.getItem('vibe-learning-completed-lessons');
    const savedXp = localStorage.getItem('vibe-learning-xp');

    if (savedCompletedLessons) {
      setCompletedLessons(new Set(JSON.parse(savedCompletedLessons)));
    }

    if (savedXp) {
      setXp(parseInt(savedXp, 10));
    }

    // Generate AI-powered lessons if we don't have any
    if (projectContext.microLessons.length === 0) {
      setIsLoading(true);
      Promise.all([
        AILearningService.generateMicroLessons(),
        // Also generate AI communication lessons
        AICommunicationService.generateAICommunicationLessons()
          .catch(error => {
            console.error('Error generating AI communication lessons:', error);
            // Use fallback lessons if API call fails
            return AICommunicationService.generateFallbackLessons();
          })
      ])
        .then(() => {
          // The services update the store directly
          toast.success('Generated micro-lessons');
        })
        .catch(error => {
          console.error('Error generating micro-lessons:', error);
          toast.error('Failed to generate some lessons. Using fallback content.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [projectContext.microLessons.length]);

  // Save completed lessons to localStorage when they change
  useEffect(() => {
    localStorage.setItem('vibe-learning-completed-lessons', JSON.stringify(Array.from(completedLessons)));
    localStorage.setItem('vibe-learning-xp', xp.toString());
  }, [completedLessons, xp]);

  const handleCompleteLesson = (lessonId: string) => {
    // Mark lesson as completed
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      newSet.add(lessonId);
      return newSet;
    });

    // Award XP
    const lesson = projectContext.microLessons.find(l => l.id === lessonId);
    if (lesson) {
      // Award XP based on difficulty
      const xpAward = lesson.difficulty === 'advanced' ? 30 : lesson.difficulty === 'intermediate' ? 20 : 10;
      setXp(prev => prev + xpAward);
    }

    // Reset selected lesson
    setSelectedLesson(null);
    setCurrentStep(0);
  };

  // Group lessons by technology
  const lessonsByTechnology: Record<string, MicroLesson[]> = {};

  projectContext.microLessons.forEach(lesson => {
    if (!lessonsByTechnology[lesson.technology]) {
      lessonsByTechnology[lesson.technology] = [];
    }
    lessonsByTechnology[lesson.technology].push(lesson);
  });

  // Sort lessons by relevance score
  Object.values(lessonsByTechnology).forEach(lessons => {
    lessons.sort((a, b) => b.relevanceScore - a.relevanceScore);
  });

  // Get recommended lesson (highest relevance score that's not completed)
  const recommendedLesson = projectContext.microLessons
    .filter(lesson => !completedLessons.has(lesson.id))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)[0];

  // Parse lesson content into steps
  const parseLessonContent = (content: string): string[] => {
    // Special handling for AI Communication lessons
    if (selectedLesson?.technology === 'AI Communication') {
      // Check if the content already has ## headers
      const hasHeaders = content.match(/^##\s+/m);

      if (!hasHeaders) {
        // For AI Communication lessons without explicit headers, create artificial steps
        // First extract the title if it exists
        const titleMatch = content.match(/^#\s+(.*)$/m);
        const contentWithoutTitle = titleMatch ? content.replace(/^#\s+.*$/m, '').trim() : content;

        // Split by paragraphs
        const paragraphs = contentWithoutTitle.split(/\n\n+/);

        // Group paragraphs into reasonable steps (3-4 paragraphs per step)
        const steps = [];
        const paragraphsPerStep = 3;

        for (let i = 0; i < paragraphs.length; i += paragraphsPerStep) {
          const stepParagraphs = paragraphs.slice(i, i + paragraphsPerStep);
          const stepTitle = i === 0 ? 'Understanding the Concept' :
                           i === paragraphsPerStep ? 'Practical Application' :
                           i === paragraphsPerStep * 2 ? 'Advanced Techniques' :
                           `Step ${Math.floor(i / paragraphsPerStep) + 1}`;

          steps.push(`## ${stepTitle}\n\n${stepParagraphs.join('\n\n')}`);
        }

        // Add a title section if we extracted one
        if (titleMatch) {
          return [`# ${titleMatch[1]}`, ...steps];
        }

        return steps;
      }
    }

    // Standard parsing for other lessons
    // Split by headers
    const sections = content.split(/^##\s+/m);

    // First section is the intro (with the # title)
    const intro = sections[0].replace(/^#\s+.*$/m, '').trim();

    // Rest are the steps
    const steps = sections.slice(1).map(section => {
      const lines = section.split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      return `## ${title}\n\n${content}`;
    });

    return [intro, ...steps];
  };

  // Render lesson content with markdown
  const renderMarkdown = (markdown: string) => {
    // Simple markdown rendering for headers, lists, and paragraphs
    return markdown
      .split('\n\n')
      .map((paragraph, i) => {
        // Headers
        if (paragraph.startsWith('# ')) {
          return <h2 key={i} className="text-xl font-medium text-bolt-elements-textPrimary mb-3">{paragraph.replace('# ', '')}</h2>;
        }

        if (paragraph.startsWith('## ')) {
          return <h3 key={i} className="text-lg font-medium text-bolt-elements-textPrimary mb-2">{paragraph.replace('## ', '')}</h3>;
        }

        // Code blocks
        if (paragraph.startsWith('```') && paragraph.endsWith('```')) {
          const code = paragraph.slice(3, -3);
          return (
            <div key={i} className="bg-bolt-elements-background-depth-2 rounded-md p-3 font-mono text-sm overflow-x-auto mb-4">
              <pre className="text-bolt-elements-textPrimary whitespace-pre-wrap">{code}</pre>
            </div>
          );
        }

        // Lists
        if (paragraph.includes('\n- ')) {
          const [listTitle, ...items] = paragraph.split('\n- ');
          return (
            <div key={i} className="mb-4">
              {listTitle && <p className="text-bolt-elements-textSecondary mb-2">{listTitle}</p>}
              <ul className="list-disc pl-5 space-y-1">
                {items.map((item, j) => (
                  <li key={j} className="text-bolt-elements-textSecondary">{item}</li>
                ))}
              </ul>
            </div>
          );
        }

        // Regular paragraphs
        return <p key={i} className="text-bolt-elements-textSecondary mb-4">{paragraph}</p>;
      });
  };

  // If a lesson is selected, show the lesson content
  if (selectedLesson) {
    const lessonSteps = parseLessonContent(selectedLesson.content);
    const totalSteps = lessonSteps.length + (selectedLesson.codeExample ? 1 : 0) + 1; // +1 for completion step

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setSelectedLesson(null);
              setCurrentStep(0);
            }}
            className="text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary transition-colors flex items-center"
          >
            <div className="i-ph:arrow-left mr-1.5" />
            Back to Lessons
          </button>

          <div className="flex items-center text-xs text-bolt-elements-textTertiary">
            <div className="i-ph:clock mr-1.5" />
            {selectedLesson.estimatedTime}
          </div>
        </div>

        <div className="bg-bolt-elements-background-depth-1 rounded-lg overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-blue-200 w-full">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>

          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-lg mr-3 ${
                selectedLesson.technology === 'AI Communication' ? 'bg-purple-500/10 text-purple-500' :
                selectedLesson.technology === 'React' ? 'bg-blue-500/10 text-blue-500' :
                selectedLesson.technology === 'TypeScript' ? 'bg-blue-500/10 text-blue-500' :
                selectedLesson.technology === 'Tailwind CSS' ? 'bg-purple-500/10 text-purple-500' :
                'bg-green-500/10 text-green-500'
              }`}>
                <div className={
                  selectedLesson.technology === 'AI Communication' ? 'i-ph:robot text-xl' :
                  selectedLesson.technology === 'React' ? 'i-ph:atom text-xl' :
                  selectedLesson.technology === 'TypeScript' ? 'i-ph:code text-xl' :
                  selectedLesson.technology === 'Tailwind CSS' ? 'i-ph:paint-brush text-xl' :
                  'i-ph:code text-xl'
                } />
              </div>

              <div>
                <h2 className="text-xl font-medium text-bolt-elements-textPrimary">{selectedLesson.title}</h2>
                <p className="text-sm text-bolt-elements-textTertiary">{selectedLesson.description}</p>
              </div>
            </div>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-64"
            >
              {/* Lesson content steps */}
              {currentStep < lessonSteps.length && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {renderMarkdown(lessonSteps[currentStep])}
                </div>
              )}

              {/* Code example step */}
              {currentStep === lessonSteps.length && selectedLesson.codeExample && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">Code Example</h3>
                  <p className="text-bolt-elements-textSecondary mb-4">
                    Here's a practical example you can use in your project:
                  </p>
                  <div className="bg-bolt-elements-background-depth-2 rounded-md p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-bolt-elements-textPrimary whitespace-pre-wrap">{selectedLesson.codeExample}</pre>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="text-blue-500 hover:text-blue-600 transition-colors flex items-center"
                      onClick={() => navigator.clipboard.writeText(selectedLesson.codeExample || '')}
                    >
                      <div className="i-ph:copy mr-1.5" />
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}

              {/* Completion step */}
              {currentStep === (lessonSteps.length + (selectedLesson.codeExample ? 1 : 0)) && (
                <div className="text-center py-6">
                  <div className="i-ph:check-circle text-5xl text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-bolt-elements-textPrimary mb-2">
                    Lesson Complete!
                  </h3>
                  <p className="text-bolt-elements-textSecondary mb-6">
                    Great job! You've completed the {selectedLesson.title} lesson.
                  </p>

                  {selectedLesson.relatedFiles.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Related Files in Your Project</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {selectedLesson.relatedFiles.map((file, index) => (
                          <div key={index} className="bg-bolt-elements-background-depth-2 px-2 py-1 rounded flex items-center">
                            <div className="i-ph:file-code text-amber-500 mr-1.5" />
                            <span className="text-xs text-bolt-elements-textSecondary">{file.split('/').pop()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors"
                    onClick={() => handleCompleteLesson(selectedLesson.id)}
                  >
                    Complete & Earn XP
                  </button>
                </div>
              )}
            </motion.div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-bolt-elements-borderColor">
              <button
                className={`p-2 rounded-full ${
                  currentStep === 0
                    ? 'text-bolt-elements-textTertiary cursor-not-allowed'
                    : 'bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary'
                }`}
                onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 0}
              >
                <div className="i-ph:caret-left" />
              </button>

              <div className="text-xs text-bolt-elements-textTertiary">
                Step {currentStep + 1} of {totalSteps}
              </div>

              <button
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => currentStep < totalSteps - 1 && setCurrentStep(currentStep + 1)}
                disabled={currentStep === totalSteps - 1}
              >
                <div className="i-ph:caret-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
            <div className="i-ph:graduation-cap text-blue-500 mr-2" />
            Micro-Lessons
          </h3>
          <p className="text-xs text-bolt-elements-textTertiary">Learn key concepts and how to communicate with AI</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsLoading(true);
              Promise.all([
                AILearningService.generateMicroLessons(),
                AICommunicationService.generateAICommunicationLessons()
                  .catch(error => {
                    console.error('Error generating AI communication lessons:', error);
                    return AICommunicationService.generateFallbackLessons();
                  })
              ])
                .then(() => {
                  toast.success('Refreshed micro-lessons');
                })
                .catch(error => {
                  console.error('Error refreshing micro-lessons:', error);
                  toast.error('Failed to refresh some lessons');
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
            className="text-xs bg-bolt-elements-background-depth-2 px-3 py-1.5 rounded-full text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors flex items-center border border-bolt-elements-borderColor"
            disabled={isLoading}
          >
            <div className={`i-ph:arrows-clockwise mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Lessons
          </button>

          <div className="flex items-center bg-green-500/10 text-green-500 px-3 py-1.5 rounded-md">
            <div className="i-ph:star mr-1.5" />
            <span className="text-sm font-medium">{xp} XP</span>
          </div>
        </div>
      </div>

      {/* Recommended lesson */}
      {recommendedLesson && (
        <div className="mb-6">
          <h4 className="text-xs font-medium text-bolt-elements-textTertiary uppercase tracking-wider mb-2">Recommended for You</h4>
          <motion.div
            className={`rounded-lg p-4 border ${
              recommendedLesson.technology === 'AI Communication' ? 'bg-purple-500/5 border-purple-500/20' :
              recommendedLesson.technology === 'React' ? 'bg-blue-500/5 border-blue-500/20' :
              recommendedLesson.technology === 'TypeScript' ? 'bg-blue-500/5 border-blue-500/20' :
              recommendedLesson.technology === 'Tailwind CSS' ? 'bg-purple-500/5 border-purple-500/20' :
              'bg-green-500/5 border-green-500/20'
            }`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-start">
              <div className={`p-2 rounded-lg mr-3 ${
                recommendedLesson.technology === 'AI Communication' ? 'bg-purple-500/10 text-purple-500' :
                recommendedLesson.technology === 'React' ? 'bg-blue-500/10 text-blue-500' :
                recommendedLesson.technology === 'TypeScript' ? 'bg-blue-500/10 text-blue-500' :
                recommendedLesson.technology === 'Tailwind CSS' ? 'bg-purple-500/10 text-purple-500' :
                'bg-green-500/10 text-green-500'
              }`}>
                <div className={
                  recommendedLesson.technology === 'AI Communication' ? 'i-ph:robot text-xl' :
                  recommendedLesson.technology === 'React' ? 'i-ph:atom text-xl' :
                  recommendedLesson.technology === 'TypeScript' ? 'i-ph:code text-xl' :
                  recommendedLesson.technology === 'Tailwind CSS' ? 'i-ph:paint-brush text-xl' :
                  'i-ph:code text-xl'
                } />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-bolt-elements-textPrimary">{recommendedLesson.title}</h3>
                    <p className="text-sm text-bolt-elements-textSecondary mt-1">{recommendedLesson.description}</p>
                  </div>

                  <div className="flex items-center text-xs text-bolt-elements-textTertiary ml-4">
                    <div className="i-ph:clock mr-1" />
                    <span>{recommendedLesson.estimatedTime}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <div className={`px-2 py-0.5 rounded text-xs ${
                      recommendedLesson.difficulty === 'beginner' ? 'bg-green-500/10 text-green-500' :
                      recommendedLesson.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {recommendedLesson.difficulty}
                    </div>

                    {recommendedLesson.relatedFiles.length > 0 && (
                      <div className="ml-2 text-xs text-bolt-elements-textTertiary flex items-center">
                        <div className="i-ph:file-code mr-1" />
                        {recommendedLesson.relatedFiles.length} related {recommendedLesson.relatedFiles.length === 1 ? 'file' : 'files'}
                      </div>
                    )}
                  </div>

                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded transition-colors"
                    onClick={() => setSelectedLesson(recommendedLesson)}
                  >
                    Start Lesson
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lessons by technology */}
      {Object.entries(lessonsByTechnology).map(([technology, lessons]) => (
        <div key={technology} className="mb-6">
          <h4 className="text-xs font-medium text-bolt-elements-textTertiary uppercase tracking-wider mb-2 flex items-center">
            <div className={
              technology === 'AI Communication' ? 'i-ph:robot mr-1.5 text-purple-500' :
              technology === 'React' ? 'i-ph:atom mr-1.5 text-blue-500' :
              technology === 'TypeScript' ? 'i-ph:code mr-1.5 text-blue-500' :
              technology === 'Tailwind CSS' ? 'i-ph:paint-brush mr-1.5 text-purple-500' :
              'i-ph:code mr-1.5 text-green-500'
            } />
            {technology} Lessons
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {lessons.map(lesson => (
              <motion.div
                key={lesson.id}
                className={`rounded-lg p-3 border ${
                  completedLessons.has(lesson.id)
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-bolt-elements-background-depth-1 border-bolt-elements-borderColor'
                }`}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {completedLessons.has(lesson.id) ? (
                      <div className="i-ph:check-circle text-green-500 mr-2" />
                    ) : (
                      <div className={
                        lesson.technology === 'AI Communication' ? 'i-ph:robot text-purple-500 mr-2' :
                        lesson.category === 'component' ? 'i-ph:puzzle-piece text-blue-500 mr-2' :
                        lesson.category === 'hook' ? 'i-ph:hook text-blue-500 mr-2' :
                        lesson.category === 'state' ? 'i-ph:database text-blue-500 mr-2' :
                        lesson.category === 'styling' ? 'i-ph:paint-brush text-purple-500 mr-2' :
                        'i-ph:code text-green-500 mr-2'
                      } />
                    )}

                    <div>
                      <h5 className="font-medium text-bolt-elements-textPrimary flex items-center">
                        {lesson.title}
                        {completedLessons.has(lesson.id) && (
                          <span className="ml-2 text-xs text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">Completed</span>
                        )}
                      </h5>

                      <div className="flex items-center text-xs text-bolt-elements-textTertiary mt-0.5">
                        <span className="capitalize">{lesson.difficulty}</span>
                        <span className="mx-1">•</span>
                        <span>{lesson.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      completedLessons.has(lesson.id)
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    {completedLessons.has(lesson.id) ? 'Review' : 'Start'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {projectContext.microLessons.length === 0 && (
        <div className="bg-bolt-elements-background-depth-1 rounded-lg p-8 text-center">
          {isLoading ? (
            <>
              <div className="animate-spin i-ph:circle-notch w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">Generating Lessons...</h3>
              <p className="text-bolt-elements-textSecondary">
                We're analyzing your project files to create personalized micro-lessons.
                <br />
                This may take a moment as we examine your code structure and patterns.
              </p>
              <p className="text-bolt-elements-textTertiary text-sm mt-2">
                We're also creating lessons on how to effectively communicate with AI about your project.
              </p>
            </>
          ) : (
            <>
              <div className="bg-bolt-elements-background-depth-2 p-6 rounded-full mb-6">
                <div className="i-ph:book-open w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">No Lessons Available Yet</h3>
              <p className="text-bolt-elements-textSecondary max-w-md mx-auto">
                We need to analyze your project to create personalized micro-lessons about your code
                and how to effectively communicate with AI about your project.
              </p>
              <button
                className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center mx-auto"
                onClick={() => {
                  setIsLoading(true);
                  Promise.all([
                    AILearningService.generateMicroLessons(),
                    AICommunicationService.generateAICommunicationLessons()
                      .catch(error => {
                        console.error('Error generating AI communication lessons:', error);
                        return AICommunicationService.generateFallbackLessons();
                      })
                  ])
                    .then(() => {
                      toast.success('Generated micro-lessons');
                    })
                    .catch(error => {
                      console.error('Error generating micro-lessons:', error);
                      toast.error('Failed to generate some lessons. Using fallback content.');
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }}
              >
                <div className="i-ph:book mr-2" />
                Generate Lessons Now
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
