import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { projectContextStore } from '~/lib/stores/projectContext';

interface FileStructureProps {
  // Add any props needed for this component
}

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  extension?: string;
  description?: string;
}

export const FileStructure: React.FC<FileStructureProps> = () => {
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const files = useStore(workbenchStore.files);
  const projectContext = useStore(projectContextStore);
  const [fileStructure, setFileStructure] = useState<FileNode>({ name: 'root', type: 'directory', children: [] });

  // Generate file structure from actual project files
  useEffect(() => {
    if (Object.keys(files).length === 0) {
      // If no files yet, use a sample structure
      setFileStructure({
        name: 'root',
        type: 'directory',
        children: [
          {
            name: 'src',
            type: 'directory',
            description: 'Contains the source code of your application',
            children: [
              {
                name: 'components',
                type: 'directory',
                description: 'Reusable UI components that make up your interface',
                children: [
                  {
                    name: 'Button.jsx',
                    type: 'file',
                    extension: 'jsx',
                    description: 'A reusable button component with various styles and states'
                  },
                  {
                    name: 'Navbar.jsx',
                    type: 'file',
                    extension: 'jsx',
                    description: 'The navigation bar component that appears at the top of your app'
                  }
                ]
              },
              {
                name: 'App.jsx',
                type: 'file',
                extension: 'jsx',
                description: 'The main component that serves as the entry point for your React application'
              }
            ]
          },
          {
            name: 'package.json',
            type: 'file',
            extension: 'json',
            description: 'Defines your project dependencies and scripts'
          }
        ]
      });
      return;
    }

    // Process actual files
    const root: FileNode = { name: 'root', type: 'directory', children: [] };
    const pathMap = new Map<string, FileNode>();
    pathMap.set('', root);

    // Sort files to process directories first
    const filePaths = Object.keys(files).sort();

    // First pass: create directory structure
    filePaths.forEach(filePath => {
      const dirent = files[filePath];
      if (!dirent) return;

      // Skip binary files
      if (dirent.type === 'file' && dirent.isBinary) return;

      // Split path into segments
      const segments = filePath.split('/');
      const fileName = segments.pop() || '';
      const dirPath = segments.join('/');

      // Get or create parent directory
      let parentDir = pathMap.get(dirPath);
      if (!parentDir) {
        // Create missing parent directories
        let currentPath = '';
        for (const segment of segments) {
          const nextPath = currentPath ? `${currentPath}/${segment}` : segment;
          let dir = pathMap.get(nextPath);

          if (!dir) {
            dir = {
              name: segment,
              type: 'directory',
              children: [],
              description: getDirectoryDescription(segment)
            };

            // Add to parent
            const parent = pathMap.get(currentPath);
            if (parent && parent.children) {
              parent.children.push(dir);
            }

            pathMap.set(nextPath, dir);
          }

          currentPath = nextPath;
        }

        parentDir = pathMap.get(dirPath);
        if (!parentDir) return; // Should never happen
      }

      // Create file node
      if (dirent.type === 'file') {
        const extension = fileName.split('.').pop() || '';
        const fileNode: FileNode = {
          name: fileName,
          type: 'file',
          extension,
          description: getFileDescription(fileName, extension, projectContext.summary.technologies)
        };

        if (!parentDir.children) parentDir.children = [];
        parentDir.children.push(fileNode);
      }
    });

    // Sort children alphabetically, with directories first
    const sortChildren = (node: FileNode) => {
      if (node.children) {
        node.children.sort((a, b) => {
          // Directories first
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          // Then alphabetically
          return a.name.localeCompare(b.name);
        });

        // Sort recursively
        node.children.forEach(child => {
          if (child.type === 'directory') {
            sortChildren(child);
          }
        });
      }
    };

    sortChildren(root);
    setFileStructure(root);
  }, [files, projectContext]);

  // Helper function to generate descriptions for files based on extension and name
  const getFileDescription = (fileName: string, extension: string, technologies: string[]): string => {
    // Check for specific filenames first
    if (fileName === 'package.json') {
      return 'Defines your project dependencies, scripts, and metadata';
    }
    if (fileName === 'tsconfig.json') {
      return 'Configuration for TypeScript compilation options';
    }
    if (fileName.includes('vite.config')) {
      return 'Configuration for the Vite build tool';
    }
    if (fileName === 'README.md') {
      return 'Documentation about your project, how to set it up and use it';
    }

    // Then check by extension
    switch (extension) {
      case 'js':
        return 'JavaScript file containing application logic';
      case 'jsx':
        return 'React component file using JSX syntax';
      case 'ts':
        return 'TypeScript file with type-safe JavaScript code';
      case 'tsx':
        return 'React component file using TypeScript and JSX';
      case 'css':
        return 'CSS stylesheet for styling your application';
      case 'scss':
      case 'sass':
        return 'SASS stylesheet with extended CSS features';
      case 'html':
        return 'HTML template file for your web application';
      case 'json':
        return 'JSON configuration or data file';
      case 'md':
        return 'Markdown documentation file';
      case 'svg':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'Image asset used in your application';
      default:
        return `File with .${extension} extension`;
    }
  };

  // Helper function to generate descriptions for directories
  const getDirectoryDescription = (dirName: string): string => {
    switch (dirName.toLowerCase()) {
      case 'src':
        return 'Contains the source code of your application';
      case 'components':
        return 'Reusable UI components that make up your interface';
      case 'pages':
        return 'Each file represents a different page or route in your application';
      case 'utils':
      case 'helpers':
        return 'Utility functions and helper code used throughout the application';
      case 'hooks':
        return 'Custom React hooks for reusing stateful logic';
      case 'assets':
        return 'Static assets like images, fonts, and other media';
      case 'styles':
      case 'css':
        return 'Stylesheets and styling-related files';
      case 'lib':
      case 'libs':
        return 'Library code and third-party integrations';
      case 'api':
        return 'API-related code for data fetching and backend communication';
      case 'tests':
      case '__tests__':
        return 'Test files for ensuring your code works correctly';
      case 'public':
        return 'Static assets that are served directly without processing';
      case 'dist':
      case 'build':
        return 'Compiled and bundled output files ready for deployment';
      case 'node_modules':
        return 'External dependencies installed from npm';
      default:
        return `Directory containing ${dirName} files`;
    }
  };

  const toggleNode = (node: FileNode, path: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });

    setSelectedNode(node);
  };

  const getFileIcon = (node: FileNode) => {
    if (node.type === 'directory') {
      return expandedNodes.has(node.name) ? 'i-ph:folder-open' : 'i-ph:folder';
    }

    switch (node.extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return 'i-ph:file-js';
      case 'html':
        return 'i-ph:file-html';
      case 'css':
      case 'scss':
      case 'sass':
        return 'i-ph:paint-brush';
      case 'json':
        return 'i-ph:brackets-curly';
      case 'md':
        return 'i-ph:file-text';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'ico':
        return 'i-ph:image';
      default:
        return 'i-ph:file';
    }
  };

  const getFileColor = (node: FileNode) => {
    if (node.type === 'directory') {
      return 'text-amber-500';
    }

    switch (node.extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return 'text-blue-500';
      case 'html':
        return 'text-orange-500';
      case 'css':
      case 'scss':
      case 'sass':
        return 'text-purple-500';
      case 'json':
        return 'text-green-500';
      case 'md':
        return 'text-gray-500';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'ico':
        return 'text-pink-500';
      default:
        return 'text-bolt-elements-textSecondary';
    }
  };

  const renderFileTree = (node: FileNode, path: string = '', level: number = 0) => {
    const isExpanded = expandedNodes.has(path || node.name);
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isSelected = selectedNode === node;

    return (
      <div key={currentPath} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center py-1 px-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-amber-500/10' : 'hover:bg-bolt-elements-background-depth-2'}`}
          onClick={() => toggleNode(node, currentPath)}
        >
          <div className={`${getFileIcon(node)} ${getFileColor(node)} mr-2`} />
          <span className="text-bolt-elements-textPrimary text-sm">{node.name}</span>
          {node.type === 'directory' && node.children && node.children.length > 0 && (
            <div className="ml-auto text-bolt-elements-textTertiary">
              <div className={`i-ph:caret-${isExpanded ? 'down' : 'right'} text-xs`} />
            </div>
          )}
        </div>

        {node.type === 'directory' && isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map(child => renderFileTree(child, currentPath, level + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 rounded-lg p-4 shadow-sm border border-amber-500/10">
      <div className="flex items-center mb-4">
        <div className="bg-amber-500 text-white p-2 rounded-lg mr-3">
          <div className="i-ph:tree-structure text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">
            File Structure
          </h3>
          <p className="text-sm text-bolt-elements-textSecondary">
            Understand how your project is organized
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-bolt-elements-background-depth-1 rounded-lg p-3 h-96 overflow-y-auto">
          {renderFileTree(fileStructure)}
        </div>

        <div className="col-span-2 bg-bolt-elements-background-depth-1 rounded-lg p-4 h-96 flex flex-col">
          {selectedNode ? (
            <motion.div
              key={selectedNode.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className={`${getFileIcon(selectedNode)} ${getFileColor(selectedNode)} text-2xl mr-3`} />
                <div>
                  <h3 className="text-lg font-medium text-bolt-elements-textPrimary">{selectedNode.name}</h3>
                  <p className="text-sm text-bolt-elements-textTertiary">
                    {selectedNode.type === 'file' ? 'File' : 'Directory'}
                    {selectedNode.extension && ` (.${selectedNode.extension})`}
                  </p>
                </div>
              </div>

              {selectedNode.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-1">Description</h4>
                  <p className="text-bolt-elements-textSecondary">{selectedNode.description}</p>
                </div>
              )}

              {selectedNode.type === 'directory' && selectedNode.children && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-1">Contents</h4>
                  <div className="bg-bolt-elements-background-depth-2 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNode.children.map(child => (
                        <div
                          key={child.name}
                          className="flex items-center p-2 rounded-md hover:bg-bolt-elements-background-depth-3 transition-colors cursor-pointer"
                          onClick={() => toggleNode(child, `${selectedNode.name}/${child.name}`)}
                        >
                          <div className={`${getFileIcon(child)} ${getFileColor(child)} mr-2`} />
                          <span className="text-bolt-elements-textPrimary text-sm">{child.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-1">Learning Tip</h4>
                <div className="bg-amber-500/10 text-amber-700 p-3 rounded-md text-sm">
                  {selectedNode.type === 'directory'
                    ? "Directories help organize your code into logical groups. Click on files to learn more about their purpose."
                    : "Understanding the purpose of each file helps you navigate and modify your project more effectively."}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="i-ph:folder-simple-dashed text-6xl text-amber-500/30 mb-4" />
              <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-1">Select a file or folder</h3>
              <p className="text-bolt-elements-textSecondary max-w-md">
                Click on any item in the file tree to see detailed information about it
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
