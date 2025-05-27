import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Lesson } from './LearningPath';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: (lessonId: string) => void;
  onBack: () => void;
}

interface LessonStep {
  type: 'explanation' | 'quiz' | 'code-challenge' | 'completion';
  content: string;
  code?: string;
  options?: string[];
  correctAnswer?: number;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onComplete, onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [userCode, setUserCode] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // In a real implementation, these steps would be generated based on the lesson
  // and the user's project context
  const lessonSteps: LessonStep[] = React.useMemo(() => {
    // Generate steps based on lesson type
    if (lesson.id.startsWith('react')) {
      return [
        {
          type: 'explanation',
          content: `# ${lesson.title}\n\n${lesson.description}\n\nReact components are the building blocks of React applications. They are reusable pieces of code that return React elements describing what should appear on the screen.`
        },
        {
          type: 'explanation',
          content: '## Function Components\n\nThe simplest way to define a component is to write a JavaScript function:',
          code: `function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n\n// Usage\n<Welcome name="Sara" />`
        },
        {
          type: 'quiz',
          content: 'What does JSX allow you to do?',
          options: [
            'Write HTML directly in your JavaScript code',
            'Connect to a database from your component',
            'Skip the build process in React',
            'Avoid using props in components'
          ],
          correctAnswer: 0
        },
        {
          type: 'code-challenge',
          content: 'Create a simple Button component that accepts a label prop and displays it:',
          code: `function Button(props) {\n  // Your code here\n}`
        },
        {
          type: 'completion',
          content: `# Congratulations!\n\nYou've completed the "${lesson.title}" lesson and earned ${lesson.xpReward} XP!\n\nKey takeaways:\n- React components are reusable pieces of UI\n- Function components are the modern way to write components\n- Props allow you to pass data to components\n- JSX lets you write HTML-like syntax in JavaScript`
        }
      ];
    }
    
    if (lesson.id.startsWith('ts')) {
      return [
        {
          type: 'explanation',
          content: `# ${lesson.title}\n\n${lesson.description}\n\nTypeScript adds static typing to JavaScript, helping you catch errors early and making your code more robust.`
        },
        {
          type: 'explanation',
          content: '## Basic Types\n\nTypeScript provides several basic types:',
          code: `// Basic types\nlet isDone: boolean = false;\nlet decimal: number = 6;\nlet color: string = "blue";\nlet list: number[] = [1, 2, 3];\nlet x: [string, number] = ["hello", 10]; // Tuple`
        },
        {
          type: 'quiz',
          content: 'What is the main benefit of using TypeScript?',
          options: [
            'It makes your code run faster',
            'It catches type errors during development',
            'It reduces the amount of code you need to write',
            'It eliminates the need for testing'
          ],
          correctAnswer: 1
        },
        {
          type: 'code-challenge',
          content: 'Create an interface for a User object with id, name, and email properties:',
          code: `// Your code here\n\n// Example usage:\n// const user: User = {\n//   id: 1,\n//   name: "John",\n//   email: "john@example.com"\n// };`
        },
        {
          type: 'completion',
          content: `# Congratulations!\n\nYou've completed the "${lesson.title}" lesson and earned ${lesson.xpReward} XP!\n\nKey takeaways:\n- TypeScript adds static typing to JavaScript\n- Basic types include boolean, number, string, array, and tuple\n- Interfaces define the shape of objects\n- Type annotations help catch errors early`
        }
      ];
    }
    
    // Default lesson steps
    return [
      {
        type: 'explanation',
        content: `# ${lesson.title}\n\n${lesson.description}`
      },
      {
        type: 'explanation',
        content: '## Key Concepts\n\nHere are some important concepts to understand:',
        code: '// Sample code will appear here based on the lesson'
      },
      {
        type: 'quiz',
        content: 'Sample quiz question about the lesson content',
        options: [
          'Option A',
          'Option B',
          'Option C',
          'Option D'
        ],
        correctAnswer: 0
      },
      {
        type: 'completion',
        content: `# Congratulations!\n\nYou've completed the "${lesson.title}" lesson and earned ${lesson.xpReward} XP!`
      }
    ];
  }, [lesson]);
  
  const currentStep = lessonSteps[currentStepIndex];
  
  const handleNext = () => {
    if (currentStepIndex < lessonSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsCorrect(null);
    } else {
      onComplete(lesson.id);
    }
  };
  
  const handleAnswerSelect = (answerIndex: number) => {
    setUserAnswers([...userAnswers, answerIndex]);
    setIsCorrect(answerIndex === currentStep.correctAnswer);
  };
  
  const handleCodeSubmit = () => {
    // In a real implementation, we would validate the user's code
    // For now, just accept any non-empty code as correct
    setIsCorrect(userCode.trim().length > 0);
  };
  
  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'explanation':
        return (
          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {currentStep.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('#')) {
                  const level = paragraph.match(/^#+/)?.[0].length || 1;
                  const text = paragraph.replace(/^#+\s*/, '');
                  
                  switch (level) {
                    case 1:
                      return <h1 key={i} className="text-xl font-bold text-bolt-elements-textPrimary">{text}</h1>;
                    case 2:
                      return <h2 key={i} className="text-lg font-semibold text-bolt-elements-textPrimary">{text}</h2>;
                    case 3:
                      return <h3 key={i} className="text-base font-medium text-bolt-elements-textPrimary">{text}</h3>;
                    default:
                      return <h4 key={i} className="text-sm font-medium text-bolt-elements-textPrimary">{text}</h4>;
                  }
                }
                
                return <p key={i} className="text-bolt-elements-textSecondary">{paragraph}</p>;
              })}
            </div>
            
            {currentStep.code && (
              <div className="bg-bolt-elements-background-depth-2 rounded-md p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-bolt-elements-textPrimary">{currentStep.code}</pre>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        );
        
      case 'quiz':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Quiz Question</h3>
            <p className="text-bolt-elements-textSecondary">{currentStep.content}</p>
            
            <div className="space-y-2">
              {currentStep.options?.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    isCorrect === null
                      ? 'bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3'
                      : index === currentStep.correctAnswer
                      ? 'bg-green-500/20 border border-green-500/30'
                      : isCorrect === false && userAnswers[userAnswers.length - 1] === index
                      ? 'bg-red-500/20 border border-red-500/30'
                      : 'bg-bolt-elements-background-depth-2 opacity-70'
                  } ${isCorrect !== null ? 'cursor-default' : 'cursor-pointer'}`}
                  onClick={() => isCorrect === null && handleAnswerSelect(index)}
                  disabled={isCorrect !== null}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                      isCorrect !== null && index === currentStep.correctAnswer
                        ? 'bg-green-500 text-white'
                        : isCorrect === false && userAnswers[userAnswers.length - 1] === index
                        ? 'bg-red-500 text-white'
                        : 'border border-bolt-elements-borderColor'
                    }`}>
                      {isCorrect !== null && index === currentStep.correctAnswer && (
                        <div className="i-ph:check text-sm" />
                      )}
                      {isCorrect === false && userAnswers[userAnswers.length - 1] === index && (
                        <div className="i-ph:x text-sm" />
                      )}
                    </div>
                    <span className="text-bolt-elements-textPrimary">{option}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {isCorrect !== null && (
              <div className={`p-3 rounded-md ${
                isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
              }`}>
                <div className="flex items-center">
                  <div className={`${isCorrect ? 'i-ph:check-circle' : 'i-ph:x-circle'} ${
                    isCorrect ? 'text-green-500' : 'text-red-500'
                  } mr-2`} />
                  <span className={`font-medium ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect!'}
                  </span>
                </div>
                <p className="text-sm text-bolt-elements-textSecondary mt-1">
                  {isCorrect
                    ? 'Great job! You got it right.'
                    : `The correct answer is: ${currentStep.options?.[currentStep.correctAnswer || 0]}`
                  }
                </p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                onClick={handleNext}
                disabled={isCorrect === null}
              >
                {isCorrect ? 'Continue' : 'Try Again'}
              </button>
            </div>
          </div>
        );
        
      case 'code-challenge':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Code Challenge</h3>
            <p className="text-bolt-elements-textSecondary">{currentStep.content}</p>
            
            <div className="border border-bolt-elements-borderColor rounded-md overflow-hidden">
              <div className="bg-bolt-elements-background-depth-2 px-4 py-2 text-sm font-medium text-bolt-elements-textSecondary border-b border-bolt-elements-borderColor">
                Your Solution
              </div>
              <textarea
                className="w-full bg-bolt-elements-background-depth-1 p-4 font-mono text-sm text-bolt-elements-textPrimary min-h-32 focus:outline-none"
                value={userCode || currentStep.code || ''}
                onChange={(e) => setUserCode(e.target.value)}
                disabled={isCorrect !== null}
              />
            </div>
            
            {isCorrect !== null && (
              <div className={`p-3 rounded-md ${
                isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
              }`}>
                <div className="flex items-center">
                  <div className={`${isCorrect ? 'i-ph:check-circle' : 'i-ph:x-circle'} ${
                    isCorrect ? 'text-green-500' : 'text-red-500'
                  } mr-2`} />
                  <span className={`font-medium ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? 'Looks good!' : 'Try again!'}
                  </span>
                </div>
                <p className="text-sm text-bolt-elements-textSecondary mt-1">
                  {isCorrect
                    ? 'Your solution works correctly.'
                    : 'Your solution needs some adjustments.'
                  }
                </p>
              </div>
            )}
            
            <div className="flex justify-between">
              {isCorrect === null ? (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                  onClick={handleCodeSubmit}
                >
                  Submit Solution
                </button>
              ) : (
                <div></div> // Empty div for spacing
              )}
              
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                onClick={handleNext}
                disabled={isCorrect === null}
              >
                {isCorrect ? 'Continue' : 'Try Again'}
              </button>
            </div>
          </div>
        );
        
      case 'completion':
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="i-ph:confetti text-5xl text-amber-500 animate-bounce" />
            </div>
            
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {currentStep.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('#')) {
                  const level = paragraph.match(/^#+/)?.[0].length || 1;
                  const text = paragraph.replace(/^#+\s*/, '');
                  
                  switch (level) {
                    case 1:
                      return <h1 key={i} className="text-xl font-bold text-bolt-elements-textPrimary">{text}</h1>;
                    case 2:
                      return <h2 key={i} className="text-lg font-semibold text-bolt-elements-textPrimary">{text}</h2>;
                    default:
                      return <h3 key={i} className="text-base font-medium text-bolt-elements-textPrimary">{text}</h3>;
                  }
                }
                
                return <p key={i} className="text-bolt-elements-textSecondary">{paragraph}</p>;
              })}
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors"
                onClick={() => onComplete(lesson.id)}
              >
                Complete Lesson
              </button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="bg-bolt-elements-background-depth-1 rounded-lg p-6 relative">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-blue-200 w-full">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStepIndex + 1) / lessonSteps.length) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center mb-6 pt-2">
        <button
          className="text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary transition-colors flex items-center"
          onClick={onBack}
        >
          <div className="i-ph:arrow-left mr-1" />
          Back to Learning Path
        </button>
        
        <div className="text-sm text-bolt-elements-textTertiary">
          Step {currentStepIndex + 1} of {lessonSteps.length}
        </div>
      </div>
      
      <motion.div
        key={currentStepIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {renderStepContent()}
      </motion.div>
    </div>
  );
};
