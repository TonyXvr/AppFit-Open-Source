import { projectContextStore } from '~/lib/stores/projectContext';
import { workbenchStore } from '~/lib/stores/workbench';
import type { MicroLesson } from '~/lib/stores/projectContext';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('AICommunicationService');

/**
 * Service for generating AI communication lessons
 * Teaches users how to effectively communicate with AI about their project
 */
export class AICommunicationService {
  /**
   * Generates micro-lessons focused on AI communication skills
   * based on the user's project context
   */
  static async generateAICommunicationLessons(): Promise<MicroLesson[]> {
    try {
      const projectContext = projectContextStore.get();
      const files = workbenchStore.files.get();

      // Get file contents for analysis
      const fileContents: Record<string, string> = {};
      Object.entries(files).forEach(([path, dirent]) => {
        if (dirent?.type === 'file' && !dirent.isBinary) {
          fileContents[path] = dirent.content;
        }
      });

      // Prepare a sample of file contents for analysis
      // We limit the number of files to avoid exceeding token limits
      const fileEntries = Object.entries(fileContents);
      const sampleFiles = fileEntries.slice(0, 5).map(([path, content]) => {
        // Truncate content to avoid token limits
        const truncatedContent = content.length > 500 
          ? content.substring(0, 500) + '...' 
          : content;
        
        return {
          path,
          content: truncatedContent
        };
      });

      // Get API key from localStorage
      const apiKey = localStorage.getItem('openai_api_key') || '';
      if (!apiKey) {
        logger.error('No OpenAI API key found');
        throw new Error('OpenAI API key is required to generate AI communication lessons');
      }

      // Prepare the prompt for the AI
      const systemPrompt = `
You are an expert educator specializing in teaching people how to effectively communicate with AI systems.
Your task is to create a series of micro-lessons that will teach the user how to effectively communicate with AI about their programming project.

The lessons should:
1. Be tailored to the specific project the user is working on
2. Focus on practical communication techniques
3. Include specific examples using the user's actual code
4. Cover different aspects of AI communication (asking questions, requesting features, debugging, etc.)
5. Be organized in a logical progression from basic to advanced

For each lesson, provide:
- A unique ID
- A clear title
- A brief description
- Detailed content in markdown format
- Code examples where relevant
- Related files from the project
- Related concepts
- Difficulty level
- Estimated time to complete
- Technology category
- Relevance score (0-100)

Return your response as a JSON array of lesson objects with this structure:
[
  {
    "id": "ai-comm-lesson-1",
    "title": "Lesson Title",
    "description": "Brief description of the lesson",
    "content": "Markdown content with ## headers and bullet points",
    "codeExample": "Example code if applicable",
    "relatedFiles": ["file1.js", "file2.js"],
    "relatedConcepts": ["Concept 1", "Concept 2"],
    "difficulty": "beginner",
    "estimatedTime": "5 min",
    "technology": "AI Communication",
    "category": "general",
    "relevanceScore": 95
  }
]
`;

      const userPrompt = `
Here are some files from my project:

${sampleFiles.map(file => `
--- ${file.path} ---
${file.content}
`).join('\n\n')}

Project summary:
${projectContext.summary.description || 'A web application project'}
Technologies: ${projectContext.summary.technologies.join(', ')}

Based on this project, create 5-7 micro-lessons that will teach me how to effectively communicate with AI about this specific project. 
Include lessons on:
1. How to describe my project to AI
2. How to ask for specific features or functionality
3. How to get help with debugging issues
4. How to request code explanations
5. How to iterate on AI-generated code
6. Advanced prompting techniques for this specific project type
`;

      logger.info('Calling OpenAI API to generate AI communication lessons');
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.error('OpenAI API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to generate AI communication lessons');
      }

      const data = await response.json();
      const lessonsText = data.choices[0]?.message?.content || '[]';
      
      // Parse the JSON response
      let lessons: MicroLesson[] = [];
      try {
        // The response might include markdown code blocks, so we need to extract the JSON
        const jsonMatch = lessonsText.match(/```json\n([\s\S]*?)\n```/) || 
                          lessonsText.match(/```\n([\s\S]*?)\n```/) ||
                          [null, lessonsText];
        
        const jsonText = jsonMatch[1] || lessonsText;
        lessons = JSON.parse(jsonText);
        
        // Ensure each lesson has a unique ID and the correct category
        lessons = lessons.map((lesson, index) => ({
          ...lesson,
          id: lesson.id || `ai-comm-lesson-${Date.now()}-${index}`,
          technology: 'AI Communication',
          category: lesson.category || 'general'
        }));
      } catch (error) {
        logger.error('Error parsing lessons JSON:', error);
        logger.debug('Raw lessons text:', lessonsText);
        throw new Error('Failed to parse lessons from AI response');
      }

      // Add the AI communication lessons to the existing micro-lessons
      const existingLessons = projectContext.microLessons || [];
      
      // Filter out any existing AI communication lessons
      const filteredLessons = existingLessons.filter(
        lesson => lesson.technology !== 'AI Communication'
      );
      
      // Combine the filtered existing lessons with the new AI communication lessons
      const updatedLessons = [...filteredLessons, ...lessons];
      
      // Update the project context with the combined lessons
      const updatedContext = { 
        ...projectContext, 
        microLessons: updatedLessons 
      };
      projectContextStore.set(updatedContext);

      logger.info(`Generated ${lessons.length} AI communication lessons`);
      return lessons;
    } catch (error) {
      logger.error('Error generating AI communication lessons:', error);
      throw error;
    }
  }

  /**
   * Generates fallback AI communication lessons when API calls fail
   * or when no API key is available
   */
  static generateFallbackLessons(): MicroLesson[] {
    const lessons: MicroLesson[] = [
      {
        id: 'ai-comm-basics',
        title: 'Basics of Communicating with AI',
        description: 'Learn the fundamentals of effective AI communication',
        content: `# Basics of Communicating with AI

## Key Principles

- **Be specific**: Clearly state what you want the AI to do
- **Provide context**: Include relevant information about your project
- **Use examples**: Show examples of what you're looking for
- **Break down complex requests**: Ask one thing at a time
- **Iterate**: Refine your requests based on AI responses

## Example Prompt Structure

1. Start with a clear goal
2. Provide context about your project
3. Specify the format you want the response in
4. Include any constraints or requirements
5. Ask for explanations when needed`,
        codeExample: `// Example of a well-structured prompt
"I'm working on a React application that uses Tailwind CSS for styling.
I need a component that displays a user profile with:
- Username
- Profile picture
- Bio
- List of recent activities

Please provide the code in TypeScript and include comments explaining key parts.
Make sure it follows React best practices and is responsive."`,
        relatedFiles: [],
        relatedConcepts: ['Prompt Engineering', 'Context Setting', 'Specificity'],
        difficulty: 'beginner',
        estimatedTime: '5 min',
        technology: 'AI Communication',
        category: 'general',
        relevanceScore: 100
      },
      {
        id: 'ai-comm-project-description',
        title: 'Describing Your Project to AI',
        description: 'How to effectively explain your project to get better AI assistance',
        content: `# Describing Your Project to AI

## Why Project Description Matters

A clear project description helps the AI understand:
- The purpose and goals of your application
- The technologies and frameworks you're using
- The target audience and use cases
- The current state and challenges

## Elements of a Good Project Description

1. **Project purpose**: What problem does it solve?
2. **Tech stack**: List main technologies (React, Node.js, etc.)
3. **Key features**: What are the main capabilities?
4. **Current status**: Is it in planning, development, or maintenance?
5. **Specific challenges**: What are you struggling with?

## Template for Project Description

\`\`\`
I'm working on [project type] that [main purpose].
It uses [key technologies] and is intended for [target users].
The main features include [feature list].
Currently, I'm working on [current focus] and facing challenges with [specific issues].
\`\`\``,
        relatedFiles: [],
        relatedConcepts: ['Project Context', 'Technical Communication', 'Requirements Specification'],
        difficulty: 'beginner',
        estimatedTime: '7 min',
        technology: 'AI Communication',
        category: 'general',
        relevanceScore: 95
      },
      {
        id: 'ai-comm-code-requests',
        title: 'Requesting Code from AI',
        description: 'How to ask for code that meets your specific requirements',
        content: `# Requesting Code from AI

## Effective Code Requests

When asking AI to generate code for your project:

- **Specify the language and framework**: "Write this in TypeScript using React hooks"
- **Describe functionality clearly**: What should the code do?
- **Mention coding style**: Do you prefer certain patterns or conventions?
- **Include integration points**: How will this code connect to existing code?
- **Set constraints**: Performance requirements, browser compatibility, etc.

## Example Structure

1. Start with what you're trying to accomplish
2. Specify technical requirements
3. Mention any existing code it needs to work with
4. Ask for comments or explanations if needed
5. Request tests if appropriate

## Common Pitfalls

- Being too vague about requirements
- Not providing enough context about your project
- Asking for too much complex functionality at once
- Not specifying important constraints`,
        codeExample: `// Poor request:
"Give me a login form"

// Better request:
"I need a React login form component that:
- Uses React hooks and TypeScript
- Has fields for email and password
- Validates email format and password strength
- Shows appropriate error messages
- Handles form submission with a loading state
- Matches our existing Tailwind CSS styling
- Is accessible (follows WCAG guidelines)

Here's our current button styling for reference:
\`<button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>\`"`,
        relatedFiles: [],
        relatedConcepts: ['Code Generation', 'Requirements Specification', 'Technical Constraints'],
        difficulty: 'intermediate',
        estimatedTime: '8 min',
        technology: 'AI Communication',
        category: 'general',
        relevanceScore: 90
      },
      {
        id: 'ai-comm-debugging',
        title: 'Debugging with AI Assistance',
        description: 'How to effectively get help with debugging issues',
        content: `# Debugging with AI Assistance

## Effective Debugging Requests

When asking AI for help with debugging:

- **Describe the expected behavior**: What should happen?
- **Describe the actual behavior**: What's happening instead?
- **Include relevant code**: Share the problematic code
- **Include error messages**: Copy exact error text
- **Mention environment details**: Browser, Node version, etc.
- **List what you've tried**: Previous debugging attempts

## Template for Debugging Requests

\`\`\`
I'm encountering an issue with [feature/component].

Expected behavior: [what should happen]
Actual behavior: [what's happening instead]
Error message: [exact error text]

Here's the relevant code:
[code snippet]

I've already tried:
- [debugging attempt 1]
- [debugging attempt 2]

My environment:
- [framework/library] version: [version]
- Browser/Node.js version: [version]
\`\`\`

## Interpreting AI Debugging Suggestions

- Test one suggestion at a time
- Understand the suggestion before implementing it
- Report back with results for further assistance`,
        relatedFiles: [],
        relatedConcepts: ['Debugging', 'Error Analysis', 'Problem Description'],
        difficulty: 'intermediate',
        estimatedTime: '10 min',
        technology: 'AI Communication',
        category: 'general',
        relevanceScore: 85
      },
      {
        id: 'ai-comm-code-explanation',
        title: 'Requesting Code Explanations',
        description: 'How to ask AI to explain code in your project',
        content: `# Requesting Code Explanations

## Getting Effective Code Explanations

When asking AI to explain code:

- **Specify the level of detail** you need
- **Highlight specific parts** you don't understand
- **Ask about specific concepts** rather than just "explain this"
- **Request different perspectives** (e.g., how it works vs. why it's designed this way)
- **Ask for analogies** for complex concepts

## Example Requests

Instead of:
"Explain this code"

Try:
"Can you explain this React useEffect hook? Specifically:
- Why is the dependency array empty?
- What would happen if I added 'count' to the dependencies?
- How does this compare to componentDidMount in class components?"

## Levels of Explanation

You can request different levels of explanation:
- **High-level overview**: How it fits into the project
- **Functional explanation**: What it does and how
- **Line-by-line breakdown**: Detailed explanation of each part
- **Conceptual explanation**: The principles and patterns used`,
        relatedFiles: [],
        relatedConcepts: ['Code Comprehension', 'Technical Learning', 'Knowledge Transfer'],
        difficulty: 'intermediate',
        estimatedTime: '7 min',
        technology: 'AI Communication',
        category: 'general',
        relevanceScore: 80
      },
      {
        id: 'ai-comm-iterative-development',
        title: 'Iterative Development with AI',
        description: 'How to effectively iterate on AI-generated code',
        content: `# Iterative Development with AI

## The Iteration Process

Effective iteration with AI involves:

1. **Start with a clear request**: Initial code generation
2. **Evaluate the response**: Review the generated code
3. **Provide specific feedback**: What works and what doesn't
4. **Request targeted improvements**: Focus on specific aspects
5. **Refine gradually**: Make incremental changes

## Effective Feedback Patterns

When providing feedback on AI-generated code:

- **Be specific about issues**: "The form validation isn't working correctly when..."
- **Explain your reasoning**: "This approach won't work because our API requires..."
- **Acknowledge what works**: "The UI layout is perfect, but the state management needs work"
- **Provide examples**: "I need something more like this: [example]"
- **Ask for alternatives**: "Can you suggest a different approach to handling this?"

## Example Iteration Conversation

1. Initial request: "Create a user profile component"
2. Feedback: "This looks good, but we need to add form validation and error handling"
3. Refinement: "The validation works, but can we make the error messages more user-friendly?"
4. Final polish: "Now let's optimize the performance by memoizing expensive calculations"`,
        relatedFiles: [],
        relatedConcepts: ['Iterative Development', 'Feedback Loops', 'Code Refinement'],
        difficulty: 'advanced',
        estimatedTime: '12 min',
        technology: 'AI Communication',
        category: 'general',
        relevanceScore: 75
      },
      {
        id: 'ai-comm-advanced-prompting',
        title: 'Advanced AI Prompting Techniques',
        description: 'Advanced strategies for getting the best results from AI',
        content: `# Advanced AI Prompting Techniques

## Role-Based Prompting

Ask the AI to adopt a specific perspective:
- "As an experienced React developer, review this component..."
- "As a security expert, identify potential issues in this code..."
- "As a UX designer, suggest improvements to this form..."

## Chain-of-Thought Prompting

Guide the AI through a reasoning process:
- "First, analyze the current architecture..."
- "Then, identify the performance bottlenecks..."
- "Finally, suggest optimizations based on your findings..."

## Comparative Prompting

Ask for multiple approaches:
- "Show me three different ways to implement this feature..."
- "Compare class-based vs. hooks-based implementation for this component..."
- "What are the trade-offs between these state management approaches?"

## Constraint-Based Prompting

Set specific constraints:
- "Design this component using only functional components and hooks"
- "Optimize this function for readability rather than performance"
- "Implement this feature without adding any new dependencies"

## Template-Based Prompting

Provide a template for the AI to follow:
- "Please structure your response like this:
  1. Problem analysis
  2. Proposed solution
  3. Implementation steps
  4. Potential challenges"`,
        relatedFiles: [],
        relatedConcepts: ['Prompt Engineering', 'AI Collaboration', 'Technical Communication'],
        difficulty: 'advanced',
        estimatedTime: '15 min',
        technology: 'AI Communication',
        category: 'general',
        relevanceScore: 70
      }
    ];

    return lessons;
  }
}
