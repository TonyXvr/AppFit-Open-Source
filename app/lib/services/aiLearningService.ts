import { projectContextStore } from '~/lib/stores/projectContext';
import type { MicroLesson, ProjectConcept, ProjectInsight } from '~/lib/stores/projectContext';
import { workbenchStore } from '~/lib/stores/workbench';

// This service handles AI-powered learning content generation
export class AILearningService {
  // Generate micro-lessons based on project files
  static async generateMicroLessons(): Promise<MicroLesson[]> {
    try {
      const projectContext = projectContextStore.get();
      const files = workbenchStore.files.get();

      // If we already have micro-lessons, return them
      if (projectContext.microLessons.length > 0) {
        return projectContext.microLessons;
      }

      // Get file contents for analysis
      const fileContents: Record<string, string> = {};
      Object.entries(files).forEach(([path, dirent]) => {
        if (dirent?.type === 'file' && !dirent.isBinary) {
          fileContents[path] = dirent.content;
        }
      });

      // In a real implementation, we would call an AI service here
      // For now, we'll create sample lessons based on detected technologies
      const microLessons: MicroLesson[] = [];
      const technologies = projectContext.summary.technologies;

      // Find React component files
      const componentFiles = Object.keys(fileContents).filter(path =>
        (path.endsWith('.jsx') || path.endsWith('.tsx')) &&
        fileContents[path].includes('function') &&
        fileContents[path].includes('return') &&
        fileContents[path].includes('<')
      );

      // Find files with hooks
      const hookFiles = Object.keys(fileContents).filter(path =>
        (path.endsWith('.jsx') || path.endsWith('.tsx')) &&
        (fileContents[path].includes('useState') ||
         fileContents[path].includes('useEffect') ||
         fileContents[path].includes('useContext'))
      );

      // Find TypeScript files
      const tsFiles = Object.keys(fileContents).filter(path =>
        path.endsWith('.ts') || path.endsWith('.tsx')
      );

      // Find CSS/styling files
      const styleFiles = Object.keys(fileContents).filter(path =>
        path.endsWith('.css') || path.endsWith('.scss') || path.includes('styles')
      );

      // Generate React component lessons if applicable
      if (technologies.includes('React') && componentFiles.length > 0) {
        // Extract a real component example from the project
        let componentExample = '';
        let componentName = '';

        for (const file of componentFiles) {
          const content = fileContents[file];
          const match = content.match(/function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*{[\s\S]*?return\s*\([\s\S]*?\);?\s*}/);

          if (match) {
            componentExample = match[0];
            componentName = match[1];
            break;
          }
        }

        // If we found a component, create a lesson based on it
        if (componentExample) {
          microLessons.push({
            id: 'react-components-101',
            title: 'React Components in Your Project',
            description: `Learn how ${componentName} and other components work in your codebase`,
            content: `# Understanding ${componentName} Component

React components are the building blocks of your UI. Let's look at how you're using them in your project.

## Key Concepts in Your Component

- Your \`${componentName}\` component is a functional component
- It returns JSX to render UI elements
- You have ${componentFiles.length} component files in your project

## Component Structure

Your components follow this general pattern:
1. Import statements
2. Function declaration with props
3. Hooks and state (useState, useEffect)
4. Helper functions and event handlers
5. Return statement with JSX

## Best Practices

- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use proper prop types for better type safety`,
            codeExample: componentExample.length > 500
              ? componentExample.substring(0, 500) + '\n// ... rest of component omitted for brevity'
              : componentExample,
            relatedFiles: componentFiles.slice(0, 3),
            relatedConcepts: ['JSX', 'Props', 'Functional Components'],
            difficulty: 'beginner',
            estimatedTime: '5 min',
            technology: 'React',
            category: 'component',
            relevanceScore: 95
          });
        }
      }

      // Generate React hooks lesson if applicable
      if (technologies.includes('React') && hookFiles.length > 0) {
        // Extract a real hooks example from the project
        let hooksExample = '';

        for (const file of hookFiles) {
          const content = fileContents[file];
          const match = content.match(/const\s+\[[^,]+,\s*[^\\]]+\]\s*=\s*useState\([^;]*\);/);

          if (match) {
            hooksExample = match[0];
            break;
          }
        }

        microLessons.push({
          id: 'react-hooks-basics',
          title: 'React Hooks in Your Project',
          description: 'Understanding how hooks are used in your codebase',
          content: `# React Hooks in Your Project

Hooks let you use state and other React features without writing classes. Your project uses several hooks in ${hookFiles.length} files.

## Hooks Found in Your Project

${hookFiles.map(file => `- ${file.split('/').pop()}`).join('\n').substring(0, 200)}${hookFiles.length > 5 ? '\n- ... and more' : ''}

## Common Hooks in Your Codebase

- useState: For local component state
- useEffect: For side effects
- useContext: For accessing context

## Best Practices

- Only call hooks at the top level
- Only call hooks from React functions
- Create custom hooks for reusable logic`,
          codeExample: hooksExample || `// Example of hooks usage
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

      // Generate TypeScript lesson if applicable
      if (technologies.includes('TypeScript') && tsFiles.length > 0) {
        // Extract a real TypeScript interface or type from the project
        let tsExample = '';

        for (const file of tsFiles) {
          const content = fileContents[file];
          const match = content.match(/(interface|type)\s+[A-Za-z0-9_]+(\s*extends\s+[A-Za-z0-9_]+)?\s*{[\s\S]*?}/);

          if (match) {
            tsExample = match[0];
            break;
          }
        }

        microLessons.push({
          id: 'typescript-in-react',
          title: 'TypeScript in Your Project',
          description: 'How TypeScript is used in your codebase',
          content: `# TypeScript in Your Project

TypeScript adds static typing to JavaScript, making your code more robust and providing better tooling.

## TypeScript Files in Your Project

You have ${tsFiles.length} TypeScript files in your project.

## Benefits in Your Project

- Catch errors during development
- Better IDE support and autocompletion
- Self-documenting code
- Type safety for props and state

## Common Patterns in Your Codebase

- Typing component props
- Typing hooks
- Interface vs. Type aliases
- Generic types`,
          codeExample: tsExample || `// TypeScript in React components
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
          relatedFiles: tsFiles.slice(0, 3),
          relatedConcepts: ['TypeScript Interfaces', 'Type Annotations', 'Generic Types'],
          difficulty: 'intermediate',
          estimatedTime: '10 min',
          technology: 'TypeScript',
          category: 'general',
          relevanceScore: 85
        });
      }

      // Generate Tailwind CSS lesson if applicable
      if (technologies.includes('Tailwind CSS') && styleFiles.length > 0) {
        // Extract a real Tailwind example from the project
        let tailwindExample = '';

        for (const file of componentFiles) {
          const content = fileContents[file];
          const match = content.match(/className="[^"]*flex[^"]*"/);

          if (match) {
            // Try to get a larger context
            const lineMatch = content.match(/.*className="[^"]*flex[^"]*".*\n?/);
            tailwindExample = lineMatch ? lineMatch[0] : match[0];
            break;
          }
        }

        microLessons.push({
          id: 'tailwind-basics',
          title: 'Tailwind CSS in Your Project',
          description: 'How Tailwind CSS utility classes are used in your codebase',
          content: `# Tailwind CSS in Your Project

Tailwind CSS is a utility-first CSS framework that allows you to build designs directly in your markup.

## Tailwind Usage in Your Project

You're using Tailwind CSS for styling components across your project.

## Key Concepts

- Utility-first approach
- Responsive design with breakpoints
- Component extraction for reusability
- JIT (Just-In-Time) compilation

## Common Patterns in Your Codebase

- Layout utilities (flex, grid)
- Spacing and sizing
- Colors and typography
- Responsive design`,
          codeExample: tailwindExample || `// Tailwind CSS example
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

      // Update the project context with the generated lessons
      const updatedContext = { ...projectContext, microLessons };
      projectContextStore.set(updatedContext);

      return microLessons;
    } catch (error) {
      console.error('Error generating micro-lessons:', error);
      return [];
    }
  }

  // Generate project concepts based on project files
  static async generateProjectConcepts(): Promise<ProjectConcept[]> {
    try {
      const projectContext = projectContextStore.get();
      const files = workbenchStore.files.get();

      // If we already have concepts, return them
      if (projectContext.concepts.length > 0) {
        return projectContext.concepts;
      }

      // Get file contents for analysis
      const fileContents: Record<string, string> = {};
      Object.entries(files).forEach(([path, dirent]) => {
        if (dirent?.type === 'file' && !dirent.isBinary) {
          fileContents[path] = dirent.content;
        }
      });

      // In a real implementation, we would call an AI service here
      // For now, we'll create sample concepts based on detected technologies
      const concepts: ProjectConcept[] = [];
      const technologies = projectContext.summary.technologies;

      // Find React component files
      const componentFiles = Object.keys(fileContents).filter(path =>
        (path.endsWith('.jsx') || path.endsWith('.tsx')) &&
        fileContents[path].includes('function') &&
        fileContents[path].includes('return') &&
        fileContents[path].includes('<')
      );

      // Find files with hooks
      const hookFiles = Object.keys(fileContents).filter(path =>
        (path.endsWith('.jsx') || path.endsWith('.tsx')) &&
        (fileContents[path].includes('useState') ||
         fileContents[path].includes('useEffect') ||
         fileContents[path].includes('useContext'))
      );

      // Find TypeScript files
      const tsFiles = Object.keys(fileContents).filter(path =>
        path.endsWith('.ts') || path.endsWith('.tsx')
      );

      // Generate React concepts if applicable
      if (technologies.includes('React')) {
        // Extract real examples from the project
        const componentExamples: string[] = [];

        for (const file of componentFiles.slice(0, 3)) {
          const content = fileContents[file];
          const match = content.match(/function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*{/);

          if (match) {
            componentExamples.push(`${match[1]} in ${file.split('/').pop()}`);
          }
        }

        concepts.push({
          id: 'concept-components',
          name: 'React Components',
          description: 'Reusable, self-contained pieces of UI in React',
          examples: componentExamples.length > 0
            ? componentExamples
            : [
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

        // Extract real hook examples from the project
        const hookExamples: string[] = [];

        for (const file of hookFiles.slice(0, 3)) {
          const content = fileContents[file];
          if (content.includes('useState')) {
            hookExamples.push(`useState in ${file.split('/').pop()}`);
          }
          if (content.includes('useEffect')) {
            hookExamples.push(`useEffect in ${file.split('/').pop()}`);
          }
          if (content.includes('useContext')) {
            hookExamples.push(`useContext in ${file.split('/').pop()}`);
          }
        }

        concepts.push({
          id: 'concept-hooks',
          name: 'React Hooks',
          description: 'Functions that let you use React features in functional components',
          examples: hookExamples.length > 0
            ? hookExamples
            : [
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

      // Generate TypeScript concepts if applicable
      if (technologies.includes('TypeScript')) {
        // Extract real TypeScript examples from the project
        const tsExamples: string[] = [];

        for (const file of tsFiles.slice(0, 3)) {
          const content = fileContents[file];
          if (content.includes('interface ')) {
            tsExamples.push(`Interface definitions in ${file.split('/').pop()}`);
          }
          if (content.includes('type ')) {
            tsExamples.push(`Type aliases in ${file.split('/').pop()}`);
          }
          if (content.includes('<') && content.includes('>')) {
            tsExamples.push(`Generic types in ${file.split('/').pop()}`);
          }
        }

        concepts.push({
          id: 'concept-typescript',
          name: 'TypeScript Types',
          description: 'Static typing system for JavaScript',
          examples: tsExamples.length > 0
            ? tsExamples
            : [
              'Interface definitions',
              'Type annotations',
              'Generic types'
            ],
          relatedConcepts: ['Type Safety', 'Interfaces', 'Type Inference'],
          technology: 'TypeScript',
          usageInProject: {
            files: tsFiles.slice(0, 5),
            examples: ['Your project uses TypeScript for type safety and better developer experience']
          },
          learnMoreUrl: 'https://www.typescriptlang.org/docs/handbook/intro.html'
        });
      }

      // Update the project context with the generated concepts
      const updatedContext = { ...projectContext, concepts };
      projectContextStore.set(updatedContext);

      return concepts;
    } catch (error) {
      console.error('Error generating project concepts:', error);
      return [];
    }
  }

  // Generate project insights based on project files
  static async generateProjectInsights(): Promise<ProjectInsight[]> {
    try {
      const projectContext = projectContextStore.get();
      const files = workbenchStore.files.get();

      // Always generate fresh insights when this method is called directly
      // (don't return existing insights)

      // Get file contents for analysis
      const fileContents: Record<string, string> = {};
      Object.entries(files).forEach(([path, dirent]) => {
        if (dirent?.type === 'file' && !dirent.isBinary) {
          fileContents[path] = dirent.content;
        }
      });

      console.log('Analyzing files for insights:', Object.keys(fileContents).length);

      // In a real implementation, we would call an AI service here
      // For now, we'll create sample insights based on detected patterns
      const insights: ProjectInsight[] = [];

      // Find React component files
      const componentFiles = Object.keys(fileContents).filter(path =>
        (path.endsWith('.jsx') || path.endsWith('.tsx')) &&
        fileContents[path].includes('function') &&
        fileContents[path].includes('return') &&
        fileContents[path].includes('<')
      );

      // Find files with state management
      const stateFiles = Object.keys(fileContents).filter(path =>
        (path.endsWith('.jsx') || path.endsWith('.tsx')) &&
        (fileContents[path].includes('useState') ||
         fileContents[path].includes('useReducer'))
      );

      // Find files with large components (potential code smell)
      const largeComponentFiles = componentFiles.filter(path =>
        fileContents[path].split('\n').length > 150
      );

      // Generate component structure insights
      if (componentFiles.length > 0) {
        insights.push({
          id: 'insight-component-structure-' + Date.now(),
          type: 'pattern',
          title: 'Component Structure Pattern',
          description: `Your project has ${componentFiles.length} React components. Most follow a consistent pattern with hooks at the top, followed by event handlers, and JSX at the bottom.`,
          relatedFiles: componentFiles.slice(0, 3),
          impact: 'medium'
        });
      }

      // Generate state management insights
      if (stateFiles.length > 0) {
        insights.push({
          id: 'insight-state-management-' + Date.now(),
          type: 'tip',
          title: 'State Management Approach',
          description: `Your project primarily uses React's built-in state management with useState and useContext. For more complex state, consider using useReducer or a state management library.`,
          relatedFiles: stateFiles.slice(0, 3),
          impact: 'medium',
          solution: 'For complex state logic, refactor to useReducer or extract state into custom hooks for better organization.'
        });
      }

      // Generate large component insights
      if (largeComponentFiles.length > 0) {
        insights.push({
          id: 'insight-large-components-' + Date.now(),
          type: 'improvement',
          title: 'Large Component Refactoring',
          description: `You have ${largeComponentFiles.length} components that are quite large (over 150 lines). Consider breaking these down into smaller, more focused components.`,
          relatedFiles: largeComponentFiles.slice(0, 3),
          impact: 'high',
          solution: 'Extract logical sections into separate components. Look for repeated patterns or UI elements that can be componentized.'
        });
      }

      // Generate performance insights if using useEffect
      const effectFiles = Object.keys(fileContents).filter(path =>
        fileContents[path].includes('useEffect') &&
        !fileContents[path].includes('}, []') &&
        !fileContents[path].includes('}, [')
      );

      if (effectFiles.length > 0) {
        insights.push({
          id: 'insight-effect-dependencies-' + Date.now(),
          type: 'warning',
          title: 'Missing useEffect Dependencies',
          description: `Some of your useEffect hooks might be missing dependency arrays, which can cause infinite render loops or stale closures.`,
          relatedFiles: effectFiles.slice(0, 3),
          impact: 'high',
          solution: 'Add dependency arrays to all useEffect hooks. Include all variables from the component scope that are used inside the effect.'
        });
      }

      // Add a general project insight
      insights.push({
        id: 'insight-project-overview-' + Date.now(),
        type: 'pattern',
        title: 'Project Structure Overview',
        description: `Your project contains ${Object.keys(fileContents).length} files. The codebase structure suggests a ${componentFiles.length > 10 ? 'medium-sized' : 'small'} application with ${componentFiles.length} React components.`,
        relatedFiles: Object.keys(fileContents).slice(0, 3),
        impact: 'low'
      });

      console.log('Generated insights:', insights.length);

      // Update the project context with the generated insights
      const updatedContext = {
        ...projectContext,
        insights: insights,
        lastAnalyzed: new Date().toISOString()
      };
      projectContextStore.set(updatedContext);

      return insights;
    } catch (error) {
      console.error('Error generating project insights:', error);
      return [];
    }
  }
}
