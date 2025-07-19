'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically generating an answer key for a set of questions.
 *
 * - generateAnswerKey - A function that triggers the answer key generation process.
 * - GenerateAnswerKeyInput - The input type for the generateAnswerKey function, which is a list of questions.
 * - GenerateAnswerKeyOutput - The return type for the generateAnswerKey function, which is a string containing the answer key.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnswerKeyInputSchema = z.object({
  questions: z.array(z.string()).describe('A list of questions to generate an answer key for.'),
});
export type GenerateAnswerKeyInput = z.infer<typeof GenerateAnswerKeyInputSchema>;

const GenerateAnswerKeyOutputSchema = z.object({
  answerKey: z.string().describe('The generated answer key for the questions.'),
});
export type GenerateAnswerKeyOutput = z.infer<typeof GenerateAnswerKeyOutputSchema>;

export async function generateAnswerKey(input: GenerateAnswerKeyInput): Promise<GenerateAnswerKeyOutput> {
  return generateAnswerKeyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnswerKeyPrompt',
  input: {schema: GenerateAnswerKeyInputSchema},
  output: {schema: GenerateAnswerKeyOutputSchema},
  prompt: `You are an expert teacher. Generate an answer key for the following questions:\n\n{%#each questions %}{{{this}}}\n{%/each%}\n\nEnsure the answer key is clear, concise, and accurate.`,
});

const generateAnswerKeyFlow = ai.defineFlow(
  {
    name: 'generateAnswerKeyFlow',
    inputSchema: GenerateAnswerKeyInputSchema,
    outputSchema: GenerateAnswerKeyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
