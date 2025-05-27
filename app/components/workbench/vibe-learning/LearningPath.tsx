import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore } from '~/lib/stores/projectContext';
import { workbenchStore } from '~/lib/stores/workbench';

interface LearningPathProps {
  onSelectLesson: (lesson: Lesson) => void;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  duration: string; // e.g., "2 min"
  completed: boolean;
  locked: boolean;
  category: string;
  icon: string;
  relatedTechnologies: string[];
}

export const LearningPath: React.FC<LearningPathProps> = ({ onSelectLesson }) => {
  const projectContext = useStore(projectContextStore);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const [userXp, setUserXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const files = useStore(workbenchStore.files);

  // Generate lessons based on project context
  useEffect(() => {
    if (projectContext.summary.technologies.length === 0) return;
    
    setIsGenerating(true);
    
    // In a real implementation, we would call an AI service to generate
    // personalized lessons based on the project context and files
    
    // For now, we'll create sample lessons based on detected technologies
    const generatedLessons: Lesson[] = [];
    
    // Add React lessons if React is detected
    if (projectContext.summary.technologies.includes('React')) {
      generatedLessons.push(
        {
          id: 'react-1',
          title: 'React Components 101',
          description: 'Learn the basics of React components and how they work',
          difficulty: 'beginner',
          xpReward: 20,
          duration: '3 min',
          completed: false,
          locked: false,
          category: 'React',
          icon: 'i-ph:atom',
          relatedTechnologies: ['React']
        },
        {
          id: 'react-2',
          title: 'State Management',
          description: 'Master React state with useState and useReducer',
          difficulty: 'intermediate',
          xpReward: 30,
          duration: '5 min',
          completed: false,
          locked: true,
          category: 'React',
          icon: 'i-ph:atom',
          relatedTechnologies: ['React']
        },
        {
          id: 'react-3',
          title: 'React Hooks in Depth',
          description: 'Explore advanced React hooks and custom hooks',
          difficulty: 'advanced',
          xpReward: 50,
          duration: '8 min',
          completed: false,
          locked: true,
          category: 'React',
          icon: 'i-ph:atom',
          relatedTechnologies: ['React']
        }
      );
    }
    
    // Add TypeScript lessons if TypeScript is detected
    if (projectContext.summary.technologies.includes('TypeScript')) {
      generatedLessons.push(
        {
          id: 'ts-1',
          title: 'TypeScript Basics',
          description: 'Learn the fundamentals of TypeScript typing',
          difficulty: 'beginner',
          xpReward: 20,
          duration: '4 min',
          completed: false,
          locked: false,
          category: 'TypeScript',
          icon: 'i-ph:code',
          relatedTechnologies: ['TypeScript']
        },
        {
          id: 'ts-2',
          title: 'Interfaces & Types',
          description: 'Master TypeScript interfaces and custom types',
          difficulty: 'intermediate',
          xpReward: 35,
          duration: '6 min',
          completed: false,
          locked: true,
          category: 'TypeScript',
          icon: 'i-ph:code',
          relatedTechnologies: ['TypeScript']
        }
      );
    }
    
    // Add Tailwind lessons if Tailwind is detected
    if (projectContext.summary.technologies.includes('Tailwind CSS')) {
      generatedLessons.push(
        {
          id: 'tailwind-1',
          title: 'Tailwind Fundamentals',
          description: 'Learn the utility-first approach of Tailwind CSS',
          difficulty: 'beginner',
          xpReward: 15,
          duration: '3 min',
          completed: false,
          locked: false,
          category: 'CSS',
          icon: 'i-ph:paint-brush',
          relatedTechnologies: ['Tailwind CSS']
        },
        {
          id: 'tailwind-2',
          title: 'Responsive Design',
          description: 'Create responsive layouts with Tailwind breakpoints',
          difficulty: 'intermediate',
          xpReward: 25,
          duration: '4 min',
          completed: false,
          locked: true,
          category: 'CSS',
          icon: 'i-ph:paint-brush',
          relatedTechnologies: ['Tailwind CSS']
        }
      );
    }
    
    // Add general web development lessons
    generatedLessons.push(
      {
        id: 'web-1',
        title: 'Modern JavaScript',
        description: 'Essential JavaScript features for modern web development',
        difficulty: 'beginner',
        xpReward: 20,
        duration: '5 min',
        completed: false,
        locked: false,
        category: 'JavaScript',
        icon: 'i-ph:code',
        relatedTechnologies: ['JavaScript']
      },
      {
        id: 'web-2',
        title: 'Async Programming',
        description: 'Master promises, async/await, and handling asynchronous operations',
        difficulty: 'intermediate',
        xpReward: 40,
        duration: '7 min',
        completed: false,
        locked: true,
        category: 'JavaScript',
        icon: 'i-ph:code',
        relatedTechnologies: ['JavaScript']
      }
    );
    
    // Sort lessons by difficulty
    generatedLessons.sort((a, b) => {
      const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
    
    setLessons(generatedLessons);
    setIsGenerating(false);
  }, [projectContext]);
  
  // Simulate completing a lesson
  const completeLesson = (lessonId: string) => {
    setLessons(prevLessons => 
      prevLessons.map(lesson => {
        if (lesson.id === lessonId) {
          // Mark this lesson as completed
          return { ...lesson, completed: true };
        }
        
        // Unlock the next lesson in the same category if this one is completed
        if (lesson.locked && lesson.category === prevLessons.find(l => l.id === lessonId)?.category) {
          const currentIndex = prevLessons.findIndex(l => l.id === lessonId);
          const nextLessonIndex = prevLessons.findIndex(
            (l, index) => index > currentIndex && l.category === lesson.category && l.locked
          );
          
          if (nextLessonIndex === prevLessons.findIndex(l => l.id === lesson.id)) {
            return { ...lesson, locked: false };
          }
        }
        
        return lesson;
      })
    );
    
    // Award XP
    const completedLesson = lessons.find(l => l.id === lessonId);
    if (completedLesson) {
      const newXp = userXp + completedLesson.xpReward;
      setUserXp(newXp);
      
      // Level up if enough XP (100 XP per level)
      if (Math.floor(newXp / 100) > Math.floor(userXp / 100)) {
        setUserLevel(prevLevel => prevLevel + 1);
        // Here you could trigger a level-up celebration animation
      }
    }
  };
  
  // Get recommended lesson based on current file
  const getRecommendedLesson = () => {
    // In a real implementation, we would analyze the current file
    // and recommend a relevant lesson
    
    // For now, just return the first uncompleted, unlocked lesson
    return lessons.find(lesson => !lesson.completed && !lesson.locked);
  };
  
  const recommendedLesson = getRecommendedLesson();
  
  return (
    <div className="space-y-4">
      {/* User progress section */}
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
            {userLevel}
          </div>
          <div>
            <div className="text-sm font-medium text-bolt-elements-textPrimary">Level {userLevel}</div>
            <div className="w-32 h-2 bg-bolt-elements-background-depth-2 rounded-full mt-1">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${(userXp % 100)}%` }}
              />
            </div>
            <div className="text-xs text-bolt-elements-textTertiary mt-1">
              {userXp} XP • {100 - (userXp % 100)} XP to next level
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-amber-500">
              <div className="i-ph:flame text-lg" />
              <span className="font-medium ml-1">{streak}</span>
            </div>
            <div className="text-xs text-bolt-elements-textTertiary">Day streak</div>
          </div>
        </div>
      </div>
      
      {/* Recommended lesson */}
      {recommendedLesson && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-bolt-elements-textTertiary mb-2">RECOMMENDED FOR YOU</h4>
          <motion.div 
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/20"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-start">
              <div className={`${recommendedLesson.icon} text-2xl text-blue-500 mr-3 mt-1`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-bolt-elements-textPrimary">{recommendedLesson.title}</h3>
                  <div className="flex items-center text-xs">
                    <div className="i-ph:clock text-bolt-elements-textTertiary mr-1" />
                    <span className="text-bolt-elements-textTertiary">{recommendedLesson.duration}</span>
                  </div>
                </div>
                <p className="text-sm text-bolt-elements-textSecondary mt-1">{recommendedLesson.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center">
                    <div className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded">
                      {recommendedLesson.difficulty}
                    </div>
                    <div className="ml-2 flex items-center text-green-500 text-xs">
                      <div className="i-ph:star mr-1" />
                      <span>+{recommendedLesson.xpReward} XP</span>
                    </div>
                  </div>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition-colors"
                    onClick={() => onSelectLesson(recommendedLesson)}
                  >
                    Start Lesson
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Learning path */}
      <div>
        <h4 className="text-xs font-medium text-bolt-elements-textTertiary mb-2">YOUR LEARNING PATH</h4>
        
        {isGenerating ? (
          <div className="bg-bolt-elements-background-depth-1 rounded-lg p-8 flex flex-col items-center justify-center">
            <div className="i-ph:spinner animate-spin text-3xl text-blue-500 mb-3" />
            <p className="text-bolt-elements-textSecondary">Generating your personalized learning path...</p>
            <p className="text-xs text-bolt-elements-textTertiary mt-2">Based on your project technologies</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.length === 0 ? (
              <div className="bg-bolt-elements-background-depth-1 rounded-lg p-6 text-center">
                <p className="text-bolt-elements-textSecondary">No lessons available yet</p>
                <p className="text-xs text-bolt-elements-textTertiary mt-1">Add more code to your project to unlock lessons</p>
              </div>
            ) : (
              // Group lessons by category
              Object.entries(
                lessons.reduce((acc, lesson) => {
                  if (!acc[lesson.category]) {
                    acc[lesson.category] = [];
                  }
                  acc[lesson.category].push(lesson);
                  return acc;
                }, {} as Record<string, Lesson[]>)
              ).map(([category, categoryLessons]) => (
                <div key={category} className="mb-4">
                  <h5 className="text-sm font-medium text-bolt-elements-textPrimary mb-2 flex items-center">
                    {category === 'React' && <div className="i-ph:atom text-blue-500 mr-1.5" />}
                    {category === 'TypeScript' && <div className="i-ph:code text-blue-500 mr-1.5" />}
                    {category === 'CSS' && <div className="i-ph:paint-brush text-blue-500 mr-1.5" />}
                    {category === 'JavaScript' && <div className="i-ph:code text-blue-500 mr-1.5" />}
                    {category}
                  </h5>
                  <div className="space-y-2">
                    {categoryLessons.map((lesson) => (
                      <motion.div
                        key={lesson.id}
                        className={`rounded-lg p-3 border ${
                          lesson.locked
                            ? 'bg-bolt-elements-background-depth-1 border-bolt-elements-borderColor opacity-50 cursor-not-allowed'
                            : lesson.completed
                            ? 'bg-green-500/5 border-green-500/20 cursor-pointer'
                            : 'bg-bolt-elements-background-depth-1 border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-2 cursor-pointer'
                        }`}
                        whileHover={!lesson.locked ? { scale: 1.01 } : {}}
                        onClick={() => !lesson.locked && onSelectLesson(lesson)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {lesson.locked ? (
                              <div className="i-ph:lock text-bolt-elements-textTertiary mr-2" />
                            ) : lesson.completed ? (
                              <div className="i-ph:check-circle text-green-500 mr-2" />
                            ) : (
                              <div className={`${lesson.icon} text-blue-500 mr-2`} />
                            )}
                            <div>
                              <div className="text-sm font-medium text-bolt-elements-textPrimary">{lesson.title}</div>
                              <div className="text-xs text-bolt-elements-textTertiary flex items-center mt-0.5">
                                <span className="capitalize">{lesson.difficulty}</span>
                                <span className="mx-1">•</span>
                                <span>{lesson.duration}</span>
                                <span className="mx-1">•</span>
                                <div className="i-ph:star text-green-500 mr-0.5" />
                                <span className="text-green-500">+{lesson.xpReward} XP</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
