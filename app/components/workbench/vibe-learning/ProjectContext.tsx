import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore, isAnalyzingProject, analyzeProject } from '~/lib/stores/projectContext';

interface ProjectContextProps {
  // Add any props needed
}

export const ProjectContext: React.FC<ProjectContextProps> = () => {
  const projectContext = useStore(projectContextStore);
  const isAnalyzing = useStore(isAnalyzingProject);
  
  const handleRefreshContext = async () => {
    await analyzeProject();
  };
  
  // Format the last analyzed date
  const formatLastAnalyzed = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return 'Unknown';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Project Context</h2>
        <button
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-1.5"
          onClick={handleRefreshContext}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="i-ph:spinner animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <div className="i-ph:arrows-clockwise" />
              Refresh Context
            </>
          )}
        </button>
      </div>
      
      {/* Project Summary */}
      <motion.div
        className="bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b border-bolt-elements-borderColor">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
            <div className="i-ph:info text-blue-500 mr-2" />
            Project Summary
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-bolt-elements-textSecondary mb-1">Project Name</h4>
              <p className="text-bolt-elements-textPrimary">{projectContext.summary.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-bolt-elements-textSecondary mb-1">Project Type</h4>
              <p className="text-bolt-elements-textPrimary">{projectContext.summary.type}</p>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-bolt-elements-textSecondary mb-1">Description</h4>
              <p className="text-bolt-elements-textPrimary">{projectContext.summary.description}</p>
            </div>
            {projectContext.summary.architecture && (
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-bolt-elements-textSecondary mb-1">Architecture</h4>
                <p className="text-bolt-elements-textPrimary">{projectContext.summary.architecture}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-bolt-elements-textSecondary mb-1">Complexity</h4>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  projectContext.summary.complexity === 'beginner' ? 'bg-green-100 text-green-800' :
                  projectContext.summary.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {projectContext.summary.complexity || 'Unknown'}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-bolt-elements-textSecondary mb-1">Last Analyzed</h4>
              <p className="text-bolt-elements-textPrimary">{formatLastAnalyzed(projectContext.summary.lastAnalyzed)}</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Technologies */}
      <motion.div
        className="bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="p-4 border-b border-bolt-elements-borderColor">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
            <div className="i-ph:code text-purple-500 mr-2" />
            Technologies
          </h3>
        </div>
        <div className="p-4">
          {projectContext.summary.technologies.length === 0 ? (
            <p className="text-bolt-elements-textSecondary">No technologies detected yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {projectContext.summary.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-purple-500/10 text-purple-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Main Features */}
      <motion.div
        className="bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="p-4 border-b border-bolt-elements-borderColor">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
            <div className="i-ph:star text-amber-500 mr-2" />
            Main Features
          </h3>
        </div>
        <div className="p-4">
          {projectContext.summary.mainFeatures.length === 0 ? (
            <p className="text-bolt-elements-textSecondary">No features detected yet.</p>
          ) : (
            <ul className="space-y-2 list-disc pl-5">
              {projectContext.summary.mainFeatures.map((feature, index) => (
                <li key={index} className="text-bolt-elements-textPrimary">
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
      
      {/* Key Files */}
      <motion.div
        className="bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="p-4 border-b border-bolt-elements-borderColor">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
            <div className="i-ph:file-code text-green-500 mr-2" />
            Key Files
          </h3>
        </div>
        <div className="p-4">
          {projectContext.keyFiles.length === 0 ? (
            <p className="text-bolt-elements-textSecondary">No key files detected yet.</p>
          ) : (
            <ul className="space-y-2">
              {projectContext.keyFiles.map((file, index) => (
                <li key={index} className="text-bolt-elements-textPrimary flex items-center">
                  <div className="i-ph:file-code text-bolt-elements-textTertiary mr-2" />
                  <span className="font-mono text-sm">{file}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
      
      {/* Suggested Topics */}
      <motion.div
        className="bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="p-4 border-b border-bolt-elements-borderColor">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
            <div className="i-ph:book-open text-blue-500 mr-2" />
            Suggested Learning Topics
          </h3>
        </div>
        <div className="p-4">
          {projectContext.suggestedTopics.length === 0 ? (
            <p className="text-bolt-elements-textSecondary">No suggested topics yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {projectContext.suggestedTopics.map((topic, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-500/10 text-blue-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
