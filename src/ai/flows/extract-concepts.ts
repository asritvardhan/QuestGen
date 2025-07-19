// src/ai/flows/extract-concepts.ts
'use server';
/**
 * @fileOverview A flow for extracting key concepts and subtopics from a syllabus.
 *
 * - extractConceptsFromSyllabus - A function that handles the syllabus concept extraction process.
 * - ExtractConceptsInput - The input type for the extractConceptsFromSyllabus function.
 * - ExtractConceptsOutput - The return type for the extractConceptsFromSyllabus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractConceptsInputSchema = z.object({
  syllabusContent: z.string().describe('The text content of the syllabus.'),
});
export type ExtractConceptsInput = z.infer<typeof ExtractConceptsInputSchema>;

const ExtractConceptsOutputSchema = z.object({
  keyConcepts: z.array(z.string()).describe('The key concepts extracted from the syllabus.'),
  subtopics: z.array(z.string()).describe('The subtopics extracted from the syllabus.'),
});
export type ExtractConceptsOutput = z.infer<typeof ExtractConceptsOutputSchema>;

export async function extractConceptsFromSyllabus(input: ExtractConceptsInput): Promise<ExtractConceptsOutput> {
  return extractConceptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractConceptsPrompt',
  input: {schema: ExtractConceptsInputSchema},
  output: {schema: ExtractConceptsOutputSchema},
  prompt: `You are an expert educator. Your task is to extract the key concepts and subtopics from the given syllabus content.

Syllabus Content: {{{syllabusContent}}}

Extract key concepts and subtopics from the syllabus content. Ensure that the extracted concepts and subtopics are relevant to the syllabus.
Return the concepts and subtopics as arrays of strings.
`,
});

const extractConceptsFlow = ai.defineFlow(
  {
    name: 'extractConceptsFlow',
    inputSchema: ExtractConceptsInputSchema,
    outputSchema: ExtractConceptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
