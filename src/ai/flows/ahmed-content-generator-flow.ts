'use server';
/**
 * @fileOverview A Genkit flow for generating performance marketing content (ad copies, strategy briefs, or taglines)
 * for a media buyer portfolio.
 *
 * - generateAhmedContent - A function that handles content generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AhmedContentGeneratorInputSchema = z.object({
  keywords: z.string().describe('Keywords, product features, or audience segments.'),
  contentType: z.enum(['ad_copy', 'strategy_brief', 'tagline']).describe('The type of marketing content to generate.'),
});
export type AhmedContentGeneratorInput = z.infer<typeof AhmedContentGeneratorInputSchema>;

const AhmedContentGeneratorOutputSchema = z.object({
  generatedContent: z.string().describe('The AI-generated marketing content.'),
});
export type AhmedContentGeneratorOutput = z.infer<typeof AhmedContentGeneratorOutputSchema>;

const adCopyPrompt = ai.definePrompt({
  name: 'adCopyPrompt',
  input: {
    schema: z.object({
      keywords: z.string(),
    }),
  },
  output: {
    schema: z.string(),
  },
  prompt: `Generate a high-converting ad copy for Facebook/Instagram. Use a professional yet persuasive tone focused on e-commerce scaling and unit economics. Focus on the benefits of Ahmed Sobhy's media buying systems.

Product/Keywords: {{{keywords}}}`,
});

const strategyBriefPrompt = ai.definePrompt({
  name: 'strategyBriefPrompt',
  input: {
    schema: z.object({
      keywords: z.string(),
    }),
  },
  output: {
    schema: z.string(),
  },
  prompt: `Generate a concise performance marketing strategy brief for expanding into new markets (like UAE or Egypt). Include testing phases, audience segmentation ideas, and scaling milestones.

Context: {{{keywords}}}`,
});

const taglinePrompt = ai.definePrompt({
  name: 'taglinePrompt',
  input: {
    schema: z.object({
      keywords: z.string(),
    }),
  },
  output: {
    schema: z.string(),
  },
  prompt: `Generate a powerful 1-sentence tagline for Ahmed Sobhy's media buying services. It should emphasize results, precision, and scaling e-commerce engines.

Keywords: {{{keywords}}}`,
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
      case 'ad_copy':
        const adResponse = await adCopyPrompt({ keywords: input.keywords });
        generatedText = adResponse.output;
        break;
      case 'strategy_brief':
        const stratResponse = await strategyBriefPrompt({ keywords: input.keywords });
        generatedText = stratResponse.output;
        break;
      case 'tagline':
        const taglineResponse = await taglinePrompt({ keywords: input.keywords });
        generatedText = taglineResponse.output;
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
