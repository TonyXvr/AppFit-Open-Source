import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import {
  AppFitTutor,
  ExplainLikeIm8,
  TinkerMode,
  FileStructure,
  LearningPath,
  LessonView,
  QuickTips,
  ProjectCheatsheet,
  ContextualHelp,
  MicroLessons,
  ProjectConcepts,
  ProjectInsights,
  ProjectContext,
  type Lesson
} from './vibe-learning';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { projectContextStore, isAnalyzingProject, analyzeProject } from '~/lib/stores/projectContext';

interface VibeLearningProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

export const VibeLearning: React.FC<VibeLearningProps> = (/* { chatStarted, isStreaming } */) => {
  const [activeTab, setActiveTab] = useState('learning-path');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [streak, setStreak] = useState(1); // Learning streak
  const [xp, setXp] = useState(25); // Experience points
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const files = useStore(workbenchStore.files);
  const projectContext = useStore(projectContextStore);
  const analyzing = useStore(isAnalyzingProject);

  // Use effect to analyze project when files change
  useEffect(() => {
    if (Object.keys(files).length > 0) {
      analyzeProject();
    }
  }, [files]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Analyze the project with the current files
    analyzeProject().then(() => {
      setIsRefreshing(false);
      // Reward the user for refreshing
      setXp(prev => prev + 5);
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset selected lesson when changing tabs
    setSelectedLesson(null);
    // Reward the user for exploring different tabs
    if (value !== activeTab) {
      setXp(prev => prev + 2);
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleCompleteLesson = (_lessonId: string) => {
    // Award XP for completing the lesson
    if (selectedLesson) {
      // Increase streak when completing lessons
      setStreak(prev => prev + 1);
      // Award XP based on the lesson
      setXp(prev => prev + selectedLesson.xpReward);
    }

    // Reset selected lesson to return to learning path
    setSelectedLesson(null);
  };

  return (
    <motion.div
      className="flex flex-col h-full overflow-hidden bg-gradient-to-br from-bolt-elements-background-depth-1 to-bolt-elements-background-depth-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-bolt-elements-background-depth-1 border-b border-bolt-elements-borderColor px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="text-purple-500 mr-2 text-xl">
            <div className="i-ph:graduation-cap-fill" />
          </div>
          <div>
            <div className="text-base font-medium text-bolt-elements-textPrimary">Vibe Learning</div>
            <div className="text-xs text-bolt-elements-textTertiary">Learn as you build (Still in Prototype!)</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Streak counter */}
          <div className="flex items-center bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md">
            <div className="i-ph:flame mr-1" />
            <span className="text-xs font-medium">{streak} day streak</span>
          </div>

          {/* XP counter */}
          <div className="flex items-center bg-green-500/10 text-green-500 px-2 py-1 rounded-md">
            <div className="i-ph:star mr-1" />
            <span className="text-xs font-medium">{xp} XP</span>
          </div>

          <button
            className={`text-xs px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors flex items-center ${isRefreshing || analyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing || analyzing}
          >
            <div className={`i-ph:arrows-clockwise mr-1.5 ${isRefreshing || analyzing ? 'animate-spin' : ''}`} />
            {isRefreshing || analyzing ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* No project summary section at the top anymore */}

      <div className="flex-1 overflow-auto p-4">
        {selectedLesson ? (
          <LessonView
            lesson={selectedLesson}
            onComplete={handleCompleteLesson}
            onBack={() => setSelectedLesson(null)}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="bg-bolt-elements-background-depth-1 p-2 rounded-lg mb-6 shadow-sm">
              <TabsList className="w-full grid grid-cols-4 gap-2">
                <TabsTrigger
                  value="learning-path"
                  className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                >
                  <div className="i-ph:path text-lg mb-1" />
                  <span className="text-xs">Learning Path</span>
                </TabsTrigger>

                <TabsTrigger
                  value="micro-lessons"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                >
                  <div className="i-ph:graduation-cap text-lg mb-1" />
                  <span className="text-xs">Micro-Lessons</span>
                </TabsTrigger>

                <TabsTrigger
                  value="project-concepts"
                  className="data-[state=active]:bg-purple-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                >
                  <div className="i-ph:brain text-lg mb-1" />
                  <span className="text-xs">Concepts</span>
                </TabsTrigger>

                <TabsTrigger
                  value="project-insights"
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                >
                  <div className="i-ph:lightbulb text-lg mb-1" />
                  <span className="text-xs">Insights</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-2">
                <TabsList className="w-full grid grid-cols-4 gap-2">
                  <TabsTrigger
                    value="quick-tips"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                  >
                    <div className="i-ph:lightbulb-filament text-lg mb-1" />
                    <span className="text-xs">Quick Tips</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="project-cheatsheet"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                  >
                    <div className="i-ph:book-open text-lg mb-1" />
                    <span className="text-xs">Cheatsheet</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="contextual-help"
                    className="data-[state=active]:bg-teal-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                  >
                    <div className="i-ph:lifebuoy text-lg mb-1" />
                    <span className="text-xs">Help</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="appfit-tutor"
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                  >
                    <div className="i-ph:chalkboard-teacher text-lg mb-1" />
                    <span className="text-xs">AI Tutor</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="mt-2">
                <TabsList className="w-full grid grid-cols-4 gap-2">
                  <TabsTrigger
                    value="explain-like-8"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                  >
                    <div className="i-ph:smiley text-lg mb-1" />
                    <span className="text-xs">Explain Like I'm 8</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tinker-mode"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                  >
                    <div className="i-ph:wrench text-lg mb-1" />
                    <span className="text-xs">Tinker Mode</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="file-structure"
                    className="data-[state=active]:bg-amber-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                  >
                    <div className="i-ph:tree-structure text-lg mb-1" />
                    <span className="text-xs">File Structure</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="project-context"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex flex-col items-center py-2 px-1"
                  >
                    <div className="i-ph:info text-lg mb-1" />
                    <span className="text-xs">Project Context</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="learning-path">
                <LearningPath onSelectLesson={handleSelectLesson} />
              </TabsContent>

              <TabsContent value="micro-lessons">
                <MicroLessons />
              </TabsContent>

              <TabsContent value="project-concepts">
                <ProjectConcepts />
              </TabsContent>

              <TabsContent value="project-insights">
                <ProjectInsights />
              </TabsContent>

              <TabsContent value="quick-tips">
                <QuickTips />
              </TabsContent>

              <TabsContent value="project-cheatsheet">
                <ProjectCheatsheet />
              </TabsContent>

              <TabsContent value="contextual-help">
                <ContextualHelp />
              </TabsContent>

              <TabsContent value="appfit-tutor">
                <AppFitTutor />
              </TabsContent>

              <TabsContent value="explain-like-8">
                <ExplainLikeIm8 />
              </TabsContent>

              <TabsContent value="tinker-mode">
                <TinkerMode />
              </TabsContent>

              <TabsContent value="file-structure">
                <FileStructure />
              </TabsContent>

              <TabsContent value="project-context">
                <ProjectContext />
              </TabsContent>
            </motion.div>
          </Tabs>
        )}
      </div>
    </motion.div>
  );
};
