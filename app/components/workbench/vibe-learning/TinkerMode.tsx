import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { projectContextStore } from '~/lib/stores/projectContext';

interface TinkerModeProps {
  // Add any props needed for this component
}

interface CodeExample {
  title: string;
  description: string;
  code: string;
  output: string;
  language: string;
}

export const TinkerMode: React.FC<TinkerModeProps> = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [userCode, setUserCode] = useState('// Your code will appear here\n// Examples will be tailored to your project');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const projectContext = useStore(projectContextStore);
  const [codeExamples, setCodeExamples] = useState<CodeExample[]>([]);

  // Generate project-specific code examples based on technologies
  useEffect(() => {
    const technologies = projectContext.summary.technologies;
    const examples: CodeExample[] = [];

    // Add examples based on detected technologies
    if (technologies.includes('React')) {
      examples.push({
        title: "React Component",
        description: "Create a simple React component for your project",
        language: "jsx",
        code: `import React from 'react';

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

export default Welcome;

// Use the component
// <Welcome name="User" />`,
        output: "A heading with text 'Hello, User' will be rendered."
      });

      examples.push({
        title: "React Hook",
        description: "Create a custom React hook for state management",
        language: "jsx",
        code: `import { useState, useEffect } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Usage in a component:
// const { count, increment } = useCounter();`,
        output: "A custom hook that provides counter functionality to any component."
      });
    }

    if (technologies.includes('TypeScript')) {
      examples.push({
        title: "TypeScript Interface",
        description: "Define a TypeScript interface for your data",
        language: "typescript",
        code: `interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

// Use the interface
const currentUser: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  isActive: true,
  createdAt: new Date()
};`,
        output: "A strongly-typed User object that ensures all required properties are present."
      });
    }

    if (technologies.includes('Tailwind CSS')) {
      examples.push({
        title: "Tailwind Button",
        description: "Create a styled button with Tailwind CSS",
        language: "jsx",
        code: `<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>`,
        output: "A blue button with hover effect, white text, and rounded corners."
      });
    }

    // Add some default examples if we don't have enough project-specific ones
    if (examples.length < 2) {
      examples.push({
        title: "HTML Button",
        description: "Create a simple button with HTML",
        language: "html",
        code: `<button class="my-button">
  Click me!
</button>`,
        output: "A button with text 'Click me!' will appear."
      });

      examples.push({
        title: "CSS Styling",
        description: "Style a button with CSS",
        language: "css",
        code: `.my-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
        output: "The button will have a green background, white text, padding, and rounded corners."
      });
    }

    // Always include a JavaScript function example
    examples.push({
      title: "JavaScript Function",
      description: "Create a simple function in JavaScript",
      language: "javascript",
      code: `function sayHello(name) {
  return "Hello, " + name + "!";
}

// Call the function
sayHello("World");`,
      output: "Hello, World!"
    });

    setCodeExamples(examples);

    // Initialize with the first example
    if (examples.length > 0) {
      setUserCode(examples[0].code);
    }
  }, [projectContext]);

  const handleSelectExample = (index: number) => {
    if (index < codeExamples.length) {
      setSelectedExample(index);
      setUserCode(codeExamples[index].code);
      setOutput('');
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      if (codeExamples.length > 0 && selectedExample < codeExamples.length) {
        setOutput(codeExamples[selectedExample].output);
      } else {
        setOutput('Code executed successfully!');
      }
      setIsRunning(false);
    }, 1000);
  };

  const handleResetCode = () => {
    if (codeExamples.length > 0 && selectedExample < codeExamples.length) {
      setUserCode(codeExamples[selectedExample].code);
    }
    setOutput('');
  };

  return (
    <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-lg p-4 shadow-sm border border-green-500/10">
      <div className="flex items-center mb-4">
        <div className="bg-green-500 text-white p-2 rounded-lg mr-3">
          <div className="i-ph:wrench text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">
            Tinker Mode
          </h3>
          <p className="text-sm text-bolt-elements-textSecondary">
            Learn by experimenting with code
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-1 bg-bolt-elements-background-depth-1 rounded-lg p-3 overflow-hidden">
          <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-3">Examples</h4>
          <div className="space-y-2 overflow-y-auto max-h-64">
            {codeExamples.length > 0 ? (
              codeExamples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectExample(index)}
                  className={`w-full text-left p-2 rounded-md transition-colors ${selectedExample === index
                    ? 'bg-green-500 text-white'
                    : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-3'}`}
                >
                  <div className="font-medium">{example.title}</div>
                  <div className="text-xs opacity-80">{example.description}</div>
                </button>
              ))
            ) : (
              <div className="text-center p-4 text-bolt-elements-textTertiary">
                <div className="i-ph:code text-3xl mx-auto mb-2 opacity-50"></div>
                <p>Loading examples...</p>
                <p className="text-xs mt-2">Examples will be tailored to your project technologies</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2 flex flex-col">
          <div className="bg-bolt-elements-background-depth-1 rounded-lg p-3 mb-3 flex-1">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-bolt-elements-textPrimary">Code Editor</h4>
              <div className="text-xs text-bolt-elements-textTertiary">
                {codeExamples.length > 0 && selectedExample < codeExamples.length
                  ? codeExamples[selectedExample].language
                  : 'javascript'}
              </div>
            </div>
            <div className="relative">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-40 p-3 bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-green-500/50"
                spellCheck="false"
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <button
                  onClick={handleResetCode}
                  className="px-2 py-1 text-xs bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary rounded hover:bg-bolt-elements-background-depth-4 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleRunCode}
                  className={`px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center ${isRunning ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <div className="i-ph:circle-notch animate-spin mr-1" />
                      Running...
                    </>
                  ) : (
                    <>
                      <div className="i-ph:play mr-1" />
                      Run
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-bolt-elements-background-depth-1 rounded-lg p-3 flex-1">
            <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Output</h4>
            <div className="bg-bolt-elements-background-depth-2 rounded-md p-3 h-24 overflow-y-auto font-mono text-sm text-bolt-elements-textSecondary">
              {output ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {output}
                </motion.div>
              ) : (
                <div className="text-bolt-elements-textTertiary italic">Run your code to see the output here</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-3">
        <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Learning Tip</h4>
        <p className="text-sm text-bolt-elements-textSecondary">
          Try modifying the code and see how it changes the output. Experiment with different values, colors, or text to see what happens!
        </p>
      </div>
    </div>
  );
};
