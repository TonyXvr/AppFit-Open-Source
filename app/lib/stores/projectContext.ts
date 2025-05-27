import { atom, map } from 'nanostores';
import type { FileMap } from './files';
import { workbenchStore } from './workbench';

// Project context types
export interface ProjectSummary {
  name: string;
  description: string;
  type: string; // e.g., "React", "Node.js", "Vue", etc.
  mainFeatures: string[];
  technologies: string[];
  lastAnalyzed: string;
  architecture?: string; // Brief description of the project architecture
  complexity?: 'beginner' | 'intermediate' | 'advanced';
}

export interface MicroLesson {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown content
  codeExample?: string;
  relatedFiles: string[];
  relatedConcepts: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string; // e.g., "5 min"
  technology: string; // e.g., "React", "TypeScript", etc.
  category: 'component' | 'hook' | 'state' | 'styling' | 'api' | 'testing' | 'performance' | 'general';
  relevanceScore: number; // 0-100 score for how relevant this is to the current project
}

export interface ProjectConcept {
  id: string;
  name: string;
  description: string;
  examples: string[];
  relatedConcepts: string[];
  technology: string;
  usageInProject: {
    files: string[];
    examples: string[];
  };
  learnMoreUrl?: string;
}

export interface ProjectInsight {
  id: string;
  type: 'tip' | 'warning' | 'improvement' | 'pattern';
  title: string;
  description: string;
  relatedFiles: string[];
  impact: 'low' | 'medium' | 'high';
  solution?: string;
}

export interface FileRelationship {
  imports: string[];
  importedBy: string[];
  relatedFiles: string[];
  role: 'component' | 'utility' | 'config' | 'style' | 'test' | 'data' | 'hook' | 'page' | 'unknown';
  importance: 'critical' | 'high' | 'medium' | 'low';
}

export interface ProjectLearningContext {
  summary: ProjectSummary;
  keyFiles: string[]; // Important files in the project
  suggestedTopics: string[]; // Topics relevant to the project
  fileExplanations: Record<string, string>; // Explanations for specific files
  conceptExplanations: Record<string, string>; // Explanations for concepts used in the project
  fileRelationships: Record<string, FileRelationship>; // How files relate to each other
  microLessons: MicroLesson[];
  concepts: ProjectConcept[];
  insights: ProjectInsight[];
  codePatterns: Record<string, string[]>; // Patterns detected in the code
  learningPath?: string[]; // Suggested learning path (lesson IDs in recommended order)
}

// Default values
const defaultProjectSummary: ProjectSummary = {
  name: 'My Project',
  description: 'A project created with AppFit',
  type: 'Web Application',
  mainFeatures: [],
  technologies: [],
  lastAnalyzed: new Date().toISOString(),
};

const defaultProjectContext: ProjectLearningContext = {
  summary: defaultProjectSummary,
  keyFiles: [],
  suggestedTopics: [],
  fileExplanations: {},
  conceptExplanations: {},
  fileRelationships: {},
  microLessons: [],
  concepts: [],
  insights: [],
  codePatterns: {},
  learningPath: [],
};

// Create stores
export const projectContextStore = map<ProjectLearningContext>(defaultProjectContext);
export const isAnalyzingProject = atom<boolean>(false);

// Function to generate an explanation for a specific file
export function generateFileExplanation(filePath: string): string {
  if (!filePath) return '';

  const extension = filePath.split('.').pop()?.toLowerCase();
  const fileName = filePath.split('/').pop();

  let explanation = `<h2>${fileName}</h2>`;

  switch (extension) {
    case 'tsx':
    case 'jsx':
      explanation += `
        <p>This is a React component file that defines a UI element in your application.</p>
        <h3>Key Concepts:</h3>
        <ul>
          <li><strong>React Components</strong>: Reusable pieces of UI that can accept props and manage state</li>
          <li><strong>JSX</strong>: JavaScript XML syntax that allows you to write HTML-like code in JavaScript</li>
          <li><strong>Props</strong>: Data passed from parent to child components</li>
          <li><strong>State</strong>: Internal data that can change over time</li>
        </ul>
        <p>This file likely contains:</p>
        <ul>
          <li>Import statements at the top</li>
          <li>A component definition (function or class)</li>
          <li>JSX markup that defines the UI structure</li>
          <li>Event handlers and other logic</li>
        </ul>
      `;
      break;
    case 'ts':
      explanation += `
        <p>This is a TypeScript file that contains types, interfaces, or utility functions.</p>
        <h3>Key Concepts:</h3>
        <ul>
          <li><strong>TypeScript</strong>: A statically typed superset of JavaScript</li>
          <li><strong>Types</strong>: Definitions that describe the shape of data</li>
          <li><strong>Interfaces</strong>: Contracts that define the structure of objects</li>
          <li><strong>Type Safety</strong>: Catching errors at compile time rather than runtime</li>
        </ul>
      `;
      break;
    case 'js':
      explanation += `
        <p>This is a JavaScript file that contains functions, objects, or other logic for your application.</p>
        <h3>Key Concepts:</h3>
        <ul>
          <li><strong>Functions</strong>: Reusable blocks of code</li>
          <li><strong>Objects</strong>: Collections of related data and functionality</li>
          <li><strong>Modules</strong>: Encapsulated code that can be imported/exported</li>
        </ul>
      `;
      break;
    case 'css':
    case 'scss':
      explanation += `
        <p>This is a stylesheet file that defines the visual appearance of your application.</p>
        <h3>Key Concepts:</h3>
        <ul>
          <li><strong>Selectors</strong>: Target HTML elements to apply styles</li>
          <li><strong>Properties</strong>: Visual attributes like color, size, and layout</li>
          <li><strong>Responsive Design</strong>: Adapting layout for different screen sizes</li>
        </ul>
      `;
      break;
    case 'json':
      explanation += `
        <p>This is a JSON configuration file that stores structured data used by your application or its build tools.</p>
        <h3>Key Concepts:</h3>
        <ul>
          <li><strong>JSON</strong>: JavaScript Object Notation, a lightweight data format</li>
          <li><strong>Configuration</strong>: Settings that control how your application behaves</li>
          <li><strong>Dependencies</strong>: External libraries your project relies on</li>
        </ul>
      `;
      break;
    default:
      explanation += `
        <p>This file is part of your project structure. It may contain code, configuration, or assets used by your application.</p>
      `;
  }

  return explanation;
}

// Function to analyze the project and update the context
export async function analyzeProject() {
  isAnalyzingProject.set(true);

  try {
    // Get current files from workbenchStore
    const files = workbenchStore.files.get();

    // Extract file paths and content for analysis
    const fileEntries = Object.entries(files)
      .filter(([_, dirent]) => dirent?.type === 'file' && !dirent.isBinary)
      .map(([path, dirent]) => ({
        path,
        content: dirent?.type === 'file' ? dirent.content : '',
      }));

    // Generate file explanations for all files
    const fileExplanations: Record<string, string> = {};
    fileEntries.forEach(({ path }) => {
      fileExplanations[path] = generateFileExplanation(path);
    });

    // Generate file relationships
    const fileRelationships: Record<string, FileRelationship> = {};
    fileEntries.forEach(({ path, content }) => {
      // Default relationship structure
      const relationship: FileRelationship = {
        imports: [],
        importedBy: [],
        relatedFiles: [],
        role: 'unknown',
        importance: 'low'
      };

      // Determine file role based on path and content
      if (path.includes('/components/')) {
        relationship.role = 'component';
      } else if (path.includes('/hooks/')) {
        relationship.role = 'hook';
      } else if (path.includes('/pages/') || path.includes('/routes/')) {
        relationship.role = 'page';
      } else if (path.includes('/utils/') || path.includes('/lib/')) {
        relationship.role = 'utility';
      } else if (path.includes('/styles/') || path.endsWith('.css') || path.endsWith('.scss')) {
        relationship.role = 'style';
      } else if (path.includes('/test/') || path.includes('.test.') || path.includes('.spec.')) {
        relationship.role = 'test';
      } else if (path.includes('/data/') || path.includes('/api/')) {
        relationship.role = 'data';
      } else if (path.endsWith('.json') || path.includes('config')) {
        relationship.role = 'config';
      }

      // Determine importance
      if (keyFiles.includes(path)) {
        relationship.importance = 'critical';
      } else if (path.includes('index') || path.includes('main') || path.includes('App')) {
        relationship.importance = 'high';
      } else if (componentFiles.includes(path) || hookFiles.includes(path)) {
        relationship.importance = 'medium';
      }

      // Simple import detection (this is a basic implementation)
      const importMatches = content.match(/import .* from ['"](.*)['"];?/g) || [];
      const imports = importMatches.map(match => {
        const importPath = match.match(/from ['"](.*)['"];?/)?.[1] || '';
        // Convert relative imports to absolute paths (simplified)
        if (importPath.startsWith('.')) {
          const currentDir = path.split('/').slice(0, -1).join('/');
          return `${currentDir}/${importPath}`;
        }
        return importPath;
      });

      relationship.imports = imports;

      // Find related files based on naming patterns
      const baseName = path.split('/').pop()?.split('.')[0] || '';
      fileEntries.forEach(({ path: otherPath }) => {
        if (path !== otherPath && otherPath.includes(baseName)) {
          relationship.relatedFiles.push(otherPath);
        }
      });

      fileRelationships[path] = relationship;
    });

    // Update importedBy relationships
    Object.entries(fileRelationships).forEach(([path, relationship]) => {
      relationship.imports.forEach(importPath => {
        // Find the actual file that matches this import
        const matchingFile = Object.keys(fileRelationships).find(filePath =>
          filePath.includes(importPath) || importPath.includes(filePath)
        );

        if (matchingFile && fileRelationships[matchingFile]) {
          fileRelationships[matchingFile].importedBy.push(path);
        }
      });
    });

    // TODO: In a real implementation, we would call an AI service here
    // to analyze the project files and generate the context

    // For now, we'll create a simple analysis based on file extensions
    const fileTypes = new Set<string>();
    const technologies = new Set<string>();
    const keyFiles: string[] = [];
    const componentFiles: string[] = [];
    const hookFiles: string[] = [];
    const stateFiles: string[] = [];
    const styleFiles: string[] = [];
    const apiFiles: string[] = [];
    const testFiles: string[] = [];

    fileEntries.forEach(({ path, content }) => {
      // Extract file extension
      const extension = path.split('.').pop()?.toLowerCase() || '';

      if (extension) {
        fileTypes.add(extension);
      }

      // Identify key files
      if (path.includes('package.json')) {
        keyFiles.push(path);
        technologies.add('Node.js');
      }
      if (path.includes('tsconfig.json')) {
        keyFiles.push(path);
        technologies.add('TypeScript');
      }
      if (extension === 'jsx' || extension === 'tsx') {
        technologies.add('React');

        // Categorize React files
        if (content.includes('function') && content.includes('return') && content.includes('<')) {
          componentFiles.push(path);
        }
        if (content.includes('useState') || content.includes('useReducer')) {
          stateFiles.push(path);
        }
        if (content.includes('use') && content.includes('function') && !path.includes('test')) {
          hookFiles.push(path);
        }
      }
      if (path.includes('vite.config')) {
        keyFiles.push(path);
        technologies.add('Vite');
      }
      if (path.includes('tailwind.config')) {
        keyFiles.push(path);
        technologies.add('Tailwind CSS');
      }
      if (extension === 'css' || extension === 'scss' || path.includes('styles')) {
        styleFiles.push(path);
      }
      if (path.includes('api') || content.includes('fetch(') || content.includes('axios')) {
        apiFiles.push(path);
      }
      if (path.includes('test') || path.includes('spec') || content.includes('describe(') || content.includes('it(')) {
        testFiles.push(path);
      }

      // Add more key file detection logic here
    });

    // Create suggested topics based on technologies
    const suggestedTopics: string[] = [];
    if (technologies.has('React')) {
      suggestedTopics.push('React Components', 'React Hooks', 'State Management');
    }
    if (technologies.has('TypeScript')) {
      suggestedTopics.push('TypeScript Types', 'TypeScript Interfaces', 'Type Safety');
    }
    if (technologies.has('Tailwind CSS')) {
      suggestedTopics.push('Tailwind Utilities', 'Responsive Design', 'CSS Frameworks');
    }

    // Generate micro-lessons based on project analysis
    const microLessons: MicroLesson[] = [];

    // React component lessons
    if (technologies.has('React') && componentFiles.length > 0) {
      microLessons.push({
        id: 'react-components-101',
        title: 'React Components 101',
        description: 'Learn the basics of React components as used in your project',
        content: `# React Components in Your Project

React components are the building blocks of your UI. In your project, you're using functional components with JSX syntax.

## Key Concepts

- Components are reusable pieces of UI
- They accept props as inputs
- They return JSX elements
- Your project has ${componentFiles.length} component files

## Example from Your Project

Look at \`${componentFiles[0]?.split('/').pop() || 'YourComponent.tsx'}\` to see how components are structured in your codebase.`,
        codeExample: `// Basic React component structure
function MyComponent(props) {
  // State and hooks
  const [state, setState] = useState(initialValue);

  // Event handlers
  const handleClick = () => {
    // Do something
  };

  // Render JSX
  return (
    <div className="my-component">
      <h1>{props.title}</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}`,
        relatedFiles: componentFiles.slice(0, 3),
        relatedConcepts: ['JSX', 'Props', 'Functional Components'],
        difficulty: 'beginner',
        estimatedTime: '5 min',
        technology: 'React',
        category: 'component',
        relevanceScore: 95
      });
    }

    // React hooks lessons
    if (technologies.has('React') && hookFiles.length > 0) {
      microLessons.push({
        id: 'react-hooks-basics',
        title: 'React Hooks in Your Project',
        description: 'Understanding how hooks are used in your codebase',
        content: `# React Hooks in Your Project

Hooks let you use state and other React features without writing classes. Your project uses several hooks in ${hookFiles.length} files.

## Common Hooks in Your Project

- useState: For local component state
- useEffect: For side effects
- useContext: For accessing context

## Best Practices

- Only call hooks at the top level
- Only call hooks from React functions
- Create custom hooks for reusable logic`,
        codeExample: `// Example of hooks usage
import { useState, useEffect } from 'react';

function MyComponent() {
  // State hook
  const [count, setCount] = useState(0);

  // Effect hook
  useEffect(() => {
    document.title = \`Count: \${count}\`;

    // Cleanup function
    return () => {
      document.title = 'React App';
    };
  }, [count]); // Only re-run when count changes

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`,
        relatedFiles: hookFiles.slice(0, 3),
        relatedConcepts: ['useState', 'useEffect', 'Custom Hooks'],
        difficulty: 'intermediate',
        estimatedTime: '8 min',
        technology: 'React',
        category: 'hook',
        relevanceScore: 90
      });
    }

    // TypeScript lessons
    if (technologies.has('TypeScript')) {
      microLessons.push({
        id: 'typescript-in-react',
        title: 'TypeScript with React',
        description: 'How to use TypeScript effectively with React components',
        content: `# TypeScript in Your React Project

TypeScript adds static typing to JavaScript, making your code more robust and providing better tooling.

## Benefits in Your Project

- Catch errors during development
- Better IDE support and autocompletion
- Self-documenting code
- Type safety for props and state

## Common Patterns

- Typing component props
- Typing hooks
- Interface vs. Type aliases
- Generic types`,
        codeExample: `// TypeScript in React components
interface UserProps {
  name: string;
  age: number;
  isActive?: boolean; // Optional prop
}

// Function component with typed props
const UserProfile: React.FC<UserProps> = ({ name, age, isActive = false }) => {
  // Typed state
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div className={isActive ? 'active-user' : 'inactive-user'}>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
    </div>
  );
};`,
        relatedFiles: fileEntries
          .filter(({ path }) => path.endsWith('.tsx') || path.endsWith('.ts'))
          .map(({ path }) => path)
          .slice(0, 3),
        relatedConcepts: ['TypeScript Interfaces', 'Type Annotations', 'Generic Types'],
        difficulty: 'intermediate',
        estimatedTime: '10 min',
        technology: 'TypeScript',
        category: 'general',
        relevanceScore: 85
      });
    }

    // Tailwind CSS lessons
    if (technologies.has('Tailwind CSS')) {
      microLessons.push({
        id: 'tailwind-basics',
        title: 'Tailwind CSS in Your Project',
        description: 'How to use Tailwind CSS utility classes effectively',
        content: `# Tailwind CSS in Your Project

Tailwind CSS is a utility-first CSS framework that allows you to build designs directly in your markup.

## Key Concepts

- Utility-first approach
- Responsive design with breakpoints
- Component extraction for reusability
- JIT (Just-In-Time) compilation

## Common Patterns in Your Project

- Layout utilities (flex, grid)
- Spacing and sizing
- Colors and typography
- Responsive design`,
        codeExample: `// Tailwind CSS example
<div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <div className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
    User Profile
  </div>

  <div className="flex space-x-4">
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
      Edit
    </button>
    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
      Cancel
    </button>
  </div>
</div>`,
        relatedFiles: styleFiles.slice(0, 3),
        relatedConcepts: ['Utility Classes', 'Responsive Design', 'Component Extraction'],
        difficulty: 'beginner',
        estimatedTime: '6 min',
        technology: 'Tailwind CSS',
        category: 'styling',
        relevanceScore: 80
      });
    }

    // Generate project concepts
    const concepts: ProjectConcept[] = [];

    if (technologies.has('React')) {
      concepts.push({
        id: 'concept-components',
        name: 'React Components',
        description: 'Reusable, self-contained pieces of UI in React',
        examples: [
          'Functional components with hooks',
          'Component composition',
          'Conditional rendering'
        ],
        relatedConcepts: ['Props', 'JSX', 'Virtual DOM'],
        technology: 'React',
        usageInProject: {
          files: componentFiles.slice(0, 5),
          examples: ['Component files in your project use the functional component pattern with hooks']
        },
        learnMoreUrl: 'https://react.dev/learn/your-first-component'
      });

      concepts.push({
        id: 'concept-hooks',
        name: 'React Hooks',
        description: 'Functions that let you use React features in functional components',
        examples: [
          'useState for local state',
          'useEffect for side effects',
          'useContext for context API'
        ],
        relatedConcepts: ['State Management', 'Side Effects', 'Custom Hooks'],
        technology: 'React',
        usageInProject: {
          files: hookFiles.slice(0, 5),
          examples: ['Your project uses hooks for state management and side effects']
        },
        learnMoreUrl: 'https://react.dev/reference/react/hooks'
      });
    }

    if (technologies.has('TypeScript')) {
      concepts.push({
        id: 'concept-typescript',
        name: 'TypeScript Types',
        description: 'Static typing system for JavaScript',
        examples: [
          'Interface definitions',
          'Type annotations',
          'Generic types'
        ],
        relatedConcepts: ['Type Safety', 'Interfaces', 'Type Inference'],
        technology: 'TypeScript',
        usageInProject: {
          files: fileEntries
            .filter(({ path }) => path.endsWith('.ts') || path.endsWith('.tsx'))
            .map(({ path }) => path)
            .slice(0, 5),
          examples: ['Your project uses TypeScript for type safety and better developer experience']
        },
        learnMoreUrl: 'https://www.typescriptlang.org/docs/handbook/intro.html'
      });
    }

    // Generate project insights
    const insights: ProjectInsight[] = [];

    // Component structure insights
    if (componentFiles.length > 0) {
      insights.push({
        id: 'insight-component-structure',
        type: 'pattern',
        title: 'Component Structure Pattern',
        description: `Your project has ${componentFiles.length} React components. Most follow a consistent pattern with hooks at the top, followed by event handlers, and JSX at the bottom.`,
        relatedFiles: componentFiles.slice(0, 3),
        impact: 'medium'
      });
    }

    // State management insights
    if (stateFiles.length > 0) {
      insights.push({
        id: 'insight-state-management',
        type: 'tip',
        title: 'State Management Approach',
        description: `Your project primarily uses React's built-in state management with useState and useContext. For more complex state, consider using useReducer or a state management library.`,
        relatedFiles: stateFiles.slice(0, 3),
        impact: 'medium',
        solution: 'For complex state logic, refactor to useReducer or extract state into custom hooks for better organization.'
      });
    }

    // Code patterns
    const codePatterns: Record<string, string[]> = {};

    // Component patterns
    if (componentFiles.length > 0) {
      codePatterns['React Components'] = [
        'Functional components with hooks',
        'Props destructuring in parameters',
        'JSX with Tailwind classes'
      ];
    }

    // Hook patterns
    if (hookFiles.length > 0) {
      codePatterns['React Hooks'] = [
        'useState for local state',
        'useEffect for side effects',
        'Custom hooks for reusable logic'
      ];
    }

    // Create a learning path based on detected technologies and files
    const learningPath: string[] = [];

    // Start with basics
    if (technologies.has('React')) {
      learningPath.push('react-components-101');
    }

    // Add intermediate topics
    if (technologies.has('React') && hookFiles.length > 0) {
      learningPath.push('react-hooks-basics');
    }

    // Add TypeScript if present
    if (technologies.has('TypeScript')) {
      learningPath.push('typescript-in-react');
    }

    // Add styling
    if (technologies.has('Tailwind CSS')) {
      learningPath.push('tailwind-basics');
    }

    // Update the project context
    const currentContext = projectContextStore.get();
    projectContextStore.set({
      ...currentContext,
      summary: {
        ...currentContext.summary,
        technologies: Array.from(technologies),
        lastAnalyzed: new Date().toISOString(),
        complexity: componentFiles.length > 10 ? 'advanced' : componentFiles.length > 5 ? 'intermediate' : 'beginner',
        architecture: `${technologies.has('React') ? 'React-based ' : ''}${technologies.has('TypeScript') ? 'TypeScript ' : ''}application with ${componentFiles.length} components and ${hookFiles.length} custom hooks.`
      },
      keyFiles,
      suggestedTopics,
      microLessons,
      concepts,
      insights,
      codePatterns,
      learningPath,
      fileExplanations,
      fileRelationships
    });
  } catch (error) {
    console.error('Error analyzing project:', error);
  } finally {
    isAnalyzingProject.set(false);
  }
}

// Initialize the project context when the module is loaded
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    analyzeProject();
  }, 1000);
}
