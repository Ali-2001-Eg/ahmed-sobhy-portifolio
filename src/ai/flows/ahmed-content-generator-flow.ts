'use server';
/**
 * @fileOverview A Genkit flow for generating compelling content (project descriptions, taglines, or 'About Me' section)
 * for a portfolio based on keywords or prompts.
 *
 * - generateAhmedContent - A function that handles content generation.
 * - AhmedContentGeneratorInput - The input type for the generateAhmedContent function.
 * - AhmedContentGeneratorOutput - The return type for the generateAhmedContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AhmedContentGeneratorInputSchema = z.object({
  keywords: z.string().describe('Keywords or a brief prompt to guide content generation.'),
  contentType: z.enum(['project_description', 'tagline', 'about_me_section']).describe('The type of content to generate (e.g., project description, tagline, about me section).'),
});
export type AhmedContentGeneratorInput = z.infer<typeof AhmedContentGeneratorInputSchema>;

const AhmedContentGeneratorOutputSchema = z.object({
  generatedContent: z.string().describe('The AI-generated content.'),
});
export type AhmedContentGeneratorOutput = z.infer<typeof AhmedContentGeneratorOutputSchema>;

// --- Individual Prompt Definitions ---

const projectDescriptionPrompt = ai.definePrompt({
  name: 'projectDescriptionPrompt',
  input: {
    schema: z.object({
      keywords: z.string(),
    }),
  },
  output: {
    schema: z.string(), // The output is just the generated string
  },
  prompt: `Generate a compelling and concise project description for a professional portfolio. Focus on the key features, technologies used, and the impact or problem it solves. The description should be suitable for a professional audience, highlight Ahmed Sobhy's contribution, and be around 100-150 words.

Keywords/Prompt: {{{keywords}}}`,
});

const taglinePrompt = ai.definePrompt({
  name: 'taglinePrompt',
  input: {
    schema: z.object({
      keywords: z.string(),
    }),
  },
  output: {
    schema: z.string(), // The output is just the generated string
  },
  prompt: `Generate a catchy, professional, and concise tagline (1-2 sentences) for Ahmed Sobhy's portfolio or a specific project. It should highlight his expertise, a key benefit, or the project's core value.

Keywords/Prompt: {{{keywords}}}`,
});

const aboutMeSectionPrompt = ai.definePrompt({
  name: 'aboutMeSectionPrompt',
  input: {
    schema: z.object({
      keywords: z.string(),
    }),
  },
  output: {
    schema: z.string(), // The output is just the generated string
  },
  prompt: `Generate an engaging 'About Me' section content for Ahmed Sobhy's professional portfolio. Focus on his professional background, career journey, key skills, and expertise. Maintain a professional and personable tone. The content should be around 150-250 words and reflect a developer named Ahmed Sobhy.

Keywords/Prompt: {{{keywords}}}`,
});


export async function generateAhmedContent(
  input: AhmedContentGeneratorInput
): Promise<AhmedContentGeneratorOutput> {
  return ahmedContentGeneratorFlow(input);
}

const ahmedContentGeneratorFlow = ai.defineFlow(
  {
    name: 'ahmedContentGeneratorFlow',
    inputSchema: AhmedContentGeneratorInputSchema,
    outputSchema: AhmedContentGeneratorOutputSchema,
  },
  async (input) => {
    let generatedText: string | undefined;

    switch (input.contentType) {
      case 'project_description':
        const projectDescResponse = await projectDescriptionPrompt({ keywords: input.keywords });
        generatedText = projectDescResponse.output;
        break;
      case 'tagline':
        const taglineResponse = await taglinePrompt({ keywords: input.keywords });
        generatedText = taglineResponse.output;
        break;
      case 'about_me_section':
        const aboutMeResponse = await aboutMeSectionPrompt({ keywords: input.keywords });
        generatedText = aboutMeResponse.output;
        break;
      default:
        throw new Error(`Unsupported content type: ${input.contentType}`);
    }

    if (!generatedText) {
      throw new Error('Failed to generate content.');
    }

    return { generatedContent: generatedText };
  }
);
