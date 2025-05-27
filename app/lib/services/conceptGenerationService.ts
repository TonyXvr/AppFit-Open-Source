import { projectContextStore } from '~/lib/stores/projectContext';
import { workbenchStore } from '~/lib/stores/workbench';
import type { ProjectConcept } from '~/lib/stores/projectContext';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('ConceptGenerationService');

interface ConceptGenerationResponse {
  concepts: ProjectConcept[];
}

export class ConceptGenerationService {
  /**
   * Analyzes project files and generates relevant programming concepts
   * using AI to provide personalized learning content
   */
  static async generateProjectConcepts(): Promise<ProjectConcept[]> {
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
      const sampleFiles = fileEntries.slice(0, 10).map(([path, content]) => {
        // Truncate content to avoid token limits
        const truncatedContent = content.length > 1000 
          ? content.substring(0, 1000) + '...' 
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
        throw new Error('OpenAI API key is required to generate concepts');
      }

      // Prepare the prompt for the AI
      const systemPrompt = `
You are an expert programming educator. Analyze the provided code files and identify key programming concepts used in this project.
For each concept, provide:
1. A name for the concept
2. A brief description (1-2 sentences)
3. Examples of how it's used in the project
4. Related concepts
5. A URL to learn more about the concept

Focus on concepts that are actually used in the code, not just general programming concepts.
Group concepts by technology (React, TypeScript, CSS frameworks, etc.).

Return your response as a JSON array of concept objects with this structure:
[
  {
    "id": "unique-id-for-concept",
    "name": "Concept Name",
    "description": "Brief description of the concept",
    "examples": ["Example 1", "Example 2"],
    "relatedConcepts": ["Related Concept 1", "Related Concept 2"],
    "technology": "Technology Name",
    "usageInProject": {
      "files": ["file1.js", "file2.js"],
      "examples": ["How it's used in the project"]
    },
    "learnMoreUrl": "https://example.com/learn-more"
  }
]
`;

      const userPrompt = `
Here are some files from my project:

${sampleFiles.map(file => `
--- ${file.path} ---
${file.content}
`).join('\n\n')}

Based on these files, identify the key programming concepts used in this project.
`;

      logger.info('Calling OpenAI API to generate concepts');
      
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
          temperature: 0.2,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.error('OpenAI API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to generate concepts');
      }

      const data = await response.json();
      const conceptsText = data.choices[0]?.message?.content || '[]';
      
      // Parse the JSON response
      let concepts: ProjectConcept[] = [];
      try {
        // The response might include markdown code blocks, so we need to extract the JSON
        const jsonMatch = conceptsText.match(/```json\n([\s\S]*?)\n```/) || 
                          conceptsText.match(/```\n([\s\S]*?)\n```/) ||
                          [null, conceptsText];
        
        const jsonText = jsonMatch[1] || conceptsText;
        concepts = JSON.parse(jsonText);
        
        // Ensure each concept has a unique ID
        concepts = concepts.map((concept, index) => ({
          ...concept,
          id: concept.id || `concept-${Date.now()}-${index}`
        }));
      } catch (error) {
        logger.error('Error parsing concepts JSON:', error);
        logger.debug('Raw concepts text:', conceptsText);
        throw new Error('Failed to parse concepts from AI response');
      }

      // Update the project context with the generated concepts
      const updatedContext = { 
        ...projectContext, 
        concepts: [...concepts] 
      };
      projectContextStore.set(updatedContext);

      logger.info(`Generated ${concepts.length} project concepts`);
      return concepts;
    } catch (error) {
      logger.error('Error generating project concepts:', error);
      throw error;
    }
  }
}
