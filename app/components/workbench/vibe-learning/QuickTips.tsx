import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore } from '~/lib/stores/projectContext';

interface QuickTipsProps {
  category?: 'terminal' | 'errors' | 'git' | 'npm' | 'general' | 'all';
}

interface Tip {
  id: string;
  category: 'terminal' | 'errors' | 'git' | 'npm' | 'general';
  title: string;
  description: string;
  command?: string;
  icon: string;
  tags: string[];
}

export const QuickTips: React.FC<QuickTipsProps> = ({ category = 'all' }) => {
  const [selectedCategory, setSelectedCategory] = useState<QuickTipsProps['category']>(category);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const projectContext = useStore(projectContextStore);
  
  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('vibe-learning-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('vibe-learning-favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const toggleFavorite = (tipId: string) => {
    setFavorites(prev => 
      prev.includes(tipId)
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };
  
  // Define all tips
  const allTips: Tip[] = [
    // Terminal tips
    {
      id: 'terminal-1',
      category: 'terminal',
      title: 'Stop a running process',
      description: 'Press Ctrl+C to stop a running process in the terminal.',
      command: 'Ctrl+C',
      icon: 'i-ph:terminal',
      tags: ['terminal', 'process', 'stop', 'control']
    },
    {
      id: 'terminal-2',
      category: 'terminal',
      title: 'Clear terminal',
      description: 'Clear the terminal screen to remove clutter.',
      command: 'clear',
      icon: 'i-ph:terminal',
      tags: ['terminal', 'clear', 'clean']
    },
    {
      id: 'terminal-3',
      category: 'terminal',
      title: 'List files and directories',
      description: 'Show all files and directories in the current location.',
      command: 'ls',
      icon: 'i-ph:terminal',
      tags: ['terminal', 'files', 'list', 'directory']
    },
    {
      id: 'terminal-4',
      category: 'terminal',
      title: 'Change directory',
      description: 'Navigate to a different directory.',
      command: 'cd directory_name',
      icon: 'i-ph:terminal',
      tags: ['terminal', 'directory', 'navigation']
    },
    
    // NPM tips
    {
      id: 'npm-1',
      category: 'npm',
      title: 'Install dependencies',
      description: 'Install all dependencies listed in package.json.',
      command: 'npm install',
      icon: 'i-ph:package',
      tags: ['npm', 'install', 'dependencies', 'packages']
    },
    {
      id: 'npm-2',
      category: 'npm',
      title: 'Start development server',
      description: 'Start the development server for your project.',
      command: 'npm run dev',
      icon: 'i-ph:package',
      tags: ['npm', 'development', 'server', 'start']
    },
    {
      id: 'npm-3',
      category: 'npm',
      title: 'Install a specific package',
      description: 'Add a new package to your project.',
      command: 'npm install package_name',
      icon: 'i-ph:package',
      tags: ['npm', 'install', 'package', 'dependency']
    },
    {
      id: 'npm-4',
      category: 'npm',
      title: 'Install a dev dependency',
      description: 'Add a development dependency to your project.',
      command: 'npm install --save-dev package_name',
      icon: 'i-ph:package',
      tags: ['npm', 'install', 'dev', 'development', 'dependency']
    },
    
    // Git tips
    {
      id: 'git-1',
      category: 'git',
      title: 'Initialize a repository',
      description: 'Create a new Git repository in the current directory.',
      command: 'git init',
      icon: 'i-ph:git-branch',
      tags: ['git', 'init', 'repository', 'start']
    },
    {
      id: 'git-2',
      category: 'git',
      title: 'Stage changes',
      description: 'Add changes to the staging area before committing.',
      command: 'git add .',
      icon: 'i-ph:git-branch',
      tags: ['git', 'add', 'stage', 'changes']
    },
    {
      id: 'git-3',
      category: 'git',
      title: 'Commit changes',
      description: 'Save staged changes with a descriptive message.',
      command: 'git commit -m "Your message here"',
      icon: 'i-ph:git-branch',
      tags: ['git', 'commit', 'save', 'message']
    },
    {
      id: 'git-4',
      category: 'git',
      title: 'Check repository status',
      description: 'See which files are modified, staged, or untracked.',
      command: 'git status',
      icon: 'i-ph:git-branch',
      tags: ['git', 'status', 'changes', 'track']
    },
    
    // Error handling tips
    {
      id: 'errors-1',
      category: 'errors',
      title: 'Read error messages carefully',
      description: 'Error messages usually tell you the file, line number, and what went wrong. Start by reading the message carefully.',
      icon: 'i-ph:bug',
      tags: ['errors', 'debug', 'troubleshoot', 'fix']
    },
    {
      id: 'errors-2',
      category: 'errors',
      title: 'Check for typos',
      description: 'Many errors are caused by simple typos in variable names, function calls, or import statements.',
      icon: 'i-ph:bug',
      tags: ['errors', 'typo', 'spelling', 'debug']
    },
    {
      id: 'errors-3',
      category: 'errors',
      title: 'Restart the development server',
      description: 'Sometimes, simply restarting the development server can fix strange issues.',
      command: 'Ctrl+C, then npm run dev',
      icon: 'i-ph:bug',
      tags: ['errors', 'restart', 'server', 'fix']
    },
    {
      id: 'errors-4',
      category: 'errors',
      title: 'Check browser console',
      description: 'For frontend issues, the browser console (F12) often contains helpful error messages.',
      icon: 'i-ph:bug',
      tags: ['errors', 'browser', 'console', 'debug']
    },
    
    // General tips
    {
      id: 'general-1',
      category: 'general',
      title: 'Save your work frequently',
      description: 'Get in the habit of saving your files regularly to avoid losing work.',
      command: 'Ctrl+S',
      icon: 'i-ph:info',
      tags: ['general', 'save', 'work', 'habit']
    },
    {
      id: 'general-2',
      category: 'general',
      title: 'Use comments',
      description: 'Add comments to explain complex code sections for yourself and others.',
      icon: 'i-ph:info',
      tags: ['general', 'comments', 'documentation', 'code']
    },
    {
      id: 'general-3',
      category: 'general',
      title: 'Follow naming conventions',
      description: 'Use consistent naming for variables, functions, and files to make your code more readable.',
      icon: 'i-ph:info',
      tags: ['general', 'naming', 'conventions', 'readability']
    },
    {
      id: 'general-4',
      category: 'general',
      title: 'Break down problems',
      description: 'When facing a complex task, break it down into smaller, manageable steps.',
      icon: 'i-ph:info',
      tags: ['general', 'problem-solving', 'approach', 'strategy']
    }
  ];
  
  // Filter tips based on category and search query
  const filteredTips = allTips.filter(tip => {
    // Filter by category
    if (selectedCategory !== 'all' && tip.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tip.title.toLowerCase().includes(query) ||
        tip.description.toLowerCase().includes(query) ||
        tip.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (tip.command && tip.command.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Sort tips: favorites first, then alphabetically
  const sortedTips = [...filteredTips].sort((a, b) => {
    // Favorites first
    if (favorites.includes(a.id) && !favorites.includes(b.id)) return -1;
    if (!favorites.includes(a.id) && favorites.includes(b.id)) return 1;
    
    // Then alphabetically by title
    return a.title.localeCompare(b.title);
  });
  
  // Group tips by category for display
  const tipsByCategory: Record<string, Tip[]> = {};
  
  if (selectedCategory === 'all') {
    // Group by category
    sortedTips.forEach(tip => {
      if (!tipsByCategory[tip.category]) {
        tipsByCategory[tip.category] = [];
      }
      tipsByCategory[tip.category].push(tip);
    });
  } else {
    // Just one category
    tipsByCategory[selectedCategory] = sortedTips;
  }
  
  // Get category display name
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'terminal': return 'Terminal Commands';
      case 'npm': return 'NPM & Package Management';
      case 'git': return 'Git Version Control';
      case 'errors': return 'Error Handling';
      case 'general': return 'General Tips';
      default: return category;
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'terminal': return 'i-ph:terminal';
      case 'npm': return 'i-ph:package';
      case 'git': return 'i-ph:git-branch';
      case 'errors': return 'i-ph:bug';
      case 'general': return 'i-ph:info';
      default: return 'i-ph:info';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
            <div className="i-ph:lightbulb text-amber-500 mr-2" />
            Quick Tips & Commands
          </h3>
          
          <div className="relative">
            <div className="i-ph:magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-bolt-elements-textTertiary" />
            <input
              type="text"
              placeholder="Search tips..."
              className="pl-9 pr-4 py-1.5 text-sm rounded-md bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-2'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            <div className="i-ph:list mr-1.5" />
            All Tips
          </button>
          
          <button
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center ${
              selectedCategory === 'terminal'
                ? 'bg-purple-500 text-white'
                : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-2'
            }`}
            onClick={() => setSelectedCategory('terminal')}
          >
            <div className="i-ph:terminal mr-1.5" />
            Terminal
          </button>
          
          <button
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center ${
              selectedCategory === 'npm'
                ? 'bg-red-500 text-white'
                : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-2'
            }`}
            onClick={() => setSelectedCategory('npm')}
          >
            <div className="i-ph:package mr-1.5" />
            NPM
          </button>
          
          <button
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center ${
              selectedCategory === 'git'
                ? 'bg-orange-500 text-white'
                : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-2'
            }`}
            onClick={() => setSelectedCategory('git')}
          >
            <div className="i-ph:git-branch mr-1.5" />
            Git
          </button>
          
          <button
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center ${
              selectedCategory === 'errors'
                ? 'bg-red-500 text-white'
                : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-2'
            }`}
            onClick={() => setSelectedCategory('errors')}
          >
            <div className="i-ph:bug mr-1.5" />
            Errors
          </button>
          
          <button
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center ${
              selectedCategory === 'general'
                ? 'bg-green-500 text-white'
                : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-2'
            }`}
            onClick={() => setSelectedCategory('general')}
          >
            <div className="i-ph:info mr-1.5" />
            General
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {Object.keys(tipsByCategory).length > 0 ? (
          Object.entries(tipsByCategory).map(([category, tips]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center">
                <div className={`${getCategoryIcon(category)} mr-2 text-blue-500`} />
                <h4 className="text-sm font-medium text-bolt-elements-textPrimary">{getCategoryName(category)}</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tips.map(tip => (
                  <motion.div
                    key={tip.id}
                    className={`p-3 rounded-lg border ${
                      favorites.includes(tip.id)
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-bolt-elements-background-depth-1 border-bolt-elements-borderColor'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className={`${tip.icon} text-lg mr-2 mt-0.5 ${
                          tip.category === 'terminal' ? 'text-purple-500' :
                          tip.category === 'npm' ? 'text-red-500' :
                          tip.category === 'git' ? 'text-orange-500' :
                          tip.category === 'errors' ? 'text-red-500' :
                          'text-green-500'
                        }`} />
                        <div>
                          <h5 className="font-medium text-bolt-elements-textPrimary">{tip.title}</h5>
                          <p className="text-sm text-bolt-elements-textSecondary mt-1">{tip.description}</p>
                          
                          {tip.command && (
                            <div className="mt-2 bg-bolt-elements-background-depth-2 rounded px-3 py-1.5 font-mono text-sm text-bolt-elements-textPrimary flex items-center justify-between">
                              <code>{tip.command}</code>
                              <button
                                className="text-blue-500 hover:text-blue-600 transition-colors"
                                onClick={() => navigator.clipboard.writeText(tip.command || '')}
                                title="Copy to clipboard"
                              >
                                <div className="i-ph:copy" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        className={`p-1.5 rounded-full transition-colors ${
                          favorites.includes(tip.id)
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary'
                        }`}
                        onClick={() => toggleFavorite(tip.id)}
                        title={favorites.includes(tip.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <div className={favorites.includes(tip.id) ? 'i-ph:star-fill' : 'i-ph:star'} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="i-ph:magnifying-glass-minus text-4xl mx-auto mb-2 text-bolt-elements-textTertiary" />
            <p className="text-bolt-elements-textSecondary">No tips found matching your search.</p>
            <p className="text-sm text-bolt-elements-textTertiary mt-1">Try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
