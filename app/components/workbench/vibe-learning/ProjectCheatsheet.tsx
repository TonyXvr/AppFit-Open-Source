import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore } from '~/lib/stores/projectContext';
import { workbenchStore } from '~/lib/stores/workbench';

interface ProjectCheatsheetProps {
  // Add any props needed
}

interface CheatsheetItem {
  id: string;
  title: string;
  description: string;
  code?: string;
  category: string;
  relevance: number; // 0-100 score for how relevant this is to the current project
}

export const ProjectCheatsheet: React.FC<ProjectCheatsheetProps> = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cheatsheetItems, setCheatsheetItems] = useState<CheatsheetItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const projectContext = useStore(projectContextStore);
  const files = useStore(workbenchStore.files);
  
  // Generate cheatsheet items based on project context
  useEffect(() => {
    if (projectContext.summary.technologies.length === 0) return;
    
    setIsGenerating(true);
    
    // In a real implementation, we would call an AI service to generate
    // project-specific cheatsheet items based on the project context and files
    
    // For now, we'll create sample items based on detected technologies
    const generatedItems: CheatsheetItem[] = [];
    
    // React items
    if (projectContext.summary.technologies.includes('React')) {
      generatedItems.push(
        {
          id: 'react-1',
          title: 'Create a functional component',
          description: 'Basic structure for a React functional component with props.',
          code: `import React from 'react';\n\ninterface Props {\n  name: string;\n}\n\nconst MyComponent: React.FC<Props> = ({ name }) => {\n  return (\n    <div>\n      <h1>Hello, {name}!</h1>\n    </div>\n  );\n};\n\nexport default MyComponent;`,
          category: 'React',
          relevance: 90
        },
        {
          id: 'react-2',
          title: 'useState hook',
          description: 'Manage state in a functional component.',
          code: `import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}`,
          category: 'React',
          relevance: 85
        },
        {
          id: 'react-3',
          title: 'useEffect hook',
          description: 'Perform side effects in functional components.',
          code: `import { useState, useEffect } from 'react';\n\nfunction DataFetcher() {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  \n  useEffect(() => {\n    // This runs after render and when dependencies change\n    fetchData()\n      .then(result => setData(result))\n      .finally(() => setLoading(false));\n    \n    // Optional cleanup function\n    return () => {\n      // Cleanup code here (runs before component unmounts)\n    };\n  }, []); // Empty dependency array = run once after initial render\n  \n  if (loading) return <p>Loading...</p>;\n  return <div>{/* Render data */}</div>;\n}`,
          category: 'React',
          relevance: 80
        }
      );
    }
    
    // TypeScript items
    if (projectContext.summary.technologies.includes('TypeScript')) {
      generatedItems.push(
        {
          id: 'ts-1',
          title: 'Basic types',
          description: 'Common TypeScript type annotations.',
          code: `// Basic types\nlet isDone: boolean = false;\nlet decimal: number = 6;\nlet color: string = "blue";\nlet list: number[] = [1, 2, 3];\nlet tuple: [string, number] = ["hello", 10];\n\n// Object type\ninterface User {\n  id: number;\n  name: string;\n  email?: string; // Optional property\n}\n\n// Function type\nfunction greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}`,
          category: 'TypeScript',
          relevance: 90
        },
        {
          id: 'ts-2',
          title: 'Interfaces vs. Types',
          description: 'Understanding the difference between interfaces and type aliases.',
          code: `// Interface (can be extended, better for objects)\ninterface User {\n  id: number;\n  name: string;\n}\n\n// Extending an interface\ninterface Employee extends User {\n  department: string;\n}\n\n// Type alias (more flexible, can use unions)\ntype ID = string | number;\n\ntype Animal = {\n  name: string;\n  species: string;\n};\n\n// Intersection types\ntype Pet = Animal & {\n  owner: string;\n};`,
          category: 'TypeScript',
          relevance: 85
        }
      );
    }
    
    // Tailwind CSS items
    if (projectContext.summary.technologies.includes('Tailwind CSS')) {
      generatedItems.push(
        {
          id: 'tailwind-1',
          title: 'Common Tailwind classes',
          description: 'Frequently used Tailwind CSS utility classes.',
          code: `<!-- Spacing -->\n<div class="p-4 m-2">Padding and margin</div>\n\n<!-- Flexbox -->\n<div class="flex items-center justify-between">\n  Flexbox container\n</div>\n\n<!-- Grid -->\n<div class="grid grid-cols-3 gap-4">\n  Grid container\n</div>\n\n<!-- Colors -->\n<div class="bg-blue-500 text-white hover:bg-blue-600">\n  Colors and hover\n</div>\n\n<!-- Responsive design -->\n<div class="text-sm md:text-base lg:text-lg">\n  Responsive text\n</div>`,
          category: 'Tailwind CSS',
          relevance: 90
        },
        {
          id: 'tailwind-2',
          title: 'Tailwind button styles',
          description: 'Common button styles using Tailwind CSS.',
          code: `<!-- Primary button -->\n<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">\n  Primary Button\n</button>\n\n<!-- Secondary button -->\n<button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">\n  Secondary Button\n</button>\n\n<!-- Disabled button -->\n<button class="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">\n  Disabled Button\n</button>`,
          category: 'Tailwind CSS',
          relevance: 85
        }
      );
    }
    
    // JavaScript items (always include)
    generatedItems.push(
      {
        id: 'js-1',
        title: 'Array methods',
        description: 'Common JavaScript array methods for data manipulation.',
        code: `// Filter array elements\nconst filtered = array.filter(item => item.value > 10);\n\n// Map array elements\nconst mapped = array.map(item => item.name);\n\n// Find an element\nconst found = array.find(item => item.id === 42);\n\n// Check if any element matches\nconst hasMatch = array.some(item => item.isActive);\n\n// Check if all elements match\nconst allMatch = array.every(item => item.isValid);\n\n// Reduce array to a single value\nconst sum = array.reduce((total, item) => total + item.value, 0);`,
        category: 'JavaScript',
        relevance: 80
      },
      {
        id: 'js-2',
        title: 'Async/await',
        description: 'Working with asynchronous code using async/await.',
        code: `// Async function declaration\nasync function fetchData() {\n  try {\n    // Await promises\n    const response = await fetch('https://api.example.com/data');\n    \n    // Check if request was successful\n    if (!response.ok) {\n      throw new Error(\`HTTP error! status: \${response.status}\`);\n    }\n    \n    // Parse JSON response\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n    throw error; // Re-throw to handle in calling code\n  }\n}\n\n// Using the async function\nfetchData()\n  .then(data => console.log(data))\n  .catch(error => console.error(error));`,
        category: 'JavaScript',
        relevance: 75
      }
    );
    
    // Project-specific items based on file analysis
    const fileExtensions = new Set<string>();
    Object.keys(files).forEach(path => {
      const extension = path.split('.').pop()?.toLowerCase();
      if (extension) fileExtensions.add(extension);
    });
    
    if (fileExtensions.has('tsx') || fileExtensions.has('jsx')) {
      generatedItems.push({
        id: 'project-1',
        title: 'Project component structure',
        description: 'Typical component structure for this project.',
        code: `// Based on your project structure\nimport React from 'react';\nimport { useStore } from '@nanostores/react';\n\ninterface ComponentProps {\n  // Your typical props here\n}\n\nexport const YourComponent: React.FC<ComponentProps> = (props) => {\n  // State and hooks\n  \n  // Event handlers\n  \n  return (\n    <div className="your-typical-classes">\n      {/* Component content */}\n    </div>\n  );\n};`,
        category: 'Project-Specific',
        relevance: 95
      });
    }
    
    // Sort by relevance
    generatedItems.sort((a, b) => b.relevance - a.relevance);
    
    setCheatsheetItems(generatedItems);
    setIsGenerating(false);
  }, [projectContext, files]);
  
  // Get all categories from items
  const categories = ['all', ...new Set(cheatsheetItems.map(item => item.category))];
  
  // Filter items by selected category
  const filteredItems = selectedCategory === 'all'
    ? cheatsheetItems
    : cheatsheetItems.filter(item => item.category === selectedCategory);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-bolt-elements-textPrimary flex items-center">
          <div className="i-ph:book-open text-blue-500 mr-2" />
          Project Cheatsheet
        </h3>
        
        <button
          className={`text-xs px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors flex items-center ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={() => {
            setIsGenerating(true);
            // In a real implementation, this would regenerate the cheatsheet
            setTimeout(() => setIsGenerating(false), 1000);
          }}
          disabled={isGenerating}
        >
          <div className={`i-ph:arrows-clockwise mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Refresh'}
        </button>
      </div>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-2'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>
      
      {isGenerating ? (
        <div className="bg-bolt-elements-background-depth-1 rounded-lg p-8 flex flex-col items-center justify-center">
          <div className="i-ph:spinner animate-spin text-3xl text-blue-500 mb-3" />
          <p className="text-bolt-elements-textSecondary">Generating project-specific cheatsheet...</p>
          <p className="text-xs text-bolt-elements-textTertiary mt-2">Analyzing your project files and technologies</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <motion.div
                key={item.id}
                className="bg-bolt-elements-background-depth-1 rounded-lg border border-bolt-elements-borderColor overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-bolt-elements-textPrimary">{item.title}</h4>
                      <p className="text-sm text-bolt-elements-textSecondary mt-1">{item.description}</p>
                    </div>
                    <div className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded">
                      {item.category}
                    </div>
                  </div>
                </div>
                
                {item.code && (
                  <div className="border-t border-bolt-elements-borderColor">
                    <div className="bg-bolt-elements-background-depth-2 px-4 py-2 text-xs flex justify-between items-center">
                      <span className="text-bolt-elements-textTertiary">Code Example</span>
                      <button
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                        onClick={() => navigator.clipboard.writeText(item.code || '')}
                        title="Copy to clipboard"
                      >
                        <div className="i-ph:copy" />
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm font-mono text-bolt-elements-textPrimary">
                      {item.code}
                    </pre>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="i-ph:book text-4xl mx-auto mb-2 text-bolt-elements-textTertiary" />
              <p className="text-bolt-elements-textSecondary">No cheatsheet items available.</p>
              <p className="text-sm text-bolt-elements-textTertiary mt-1">Try selecting a different category or refreshing.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
