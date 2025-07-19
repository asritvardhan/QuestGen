// This is a server-side file.
'use server';

/**
 * @fileOverview Implements a bias and clarity check on generated questions using the Gemini Pro model.
 *
 * - performBiasClarityCheck - A function that takes a question as input and returns the revised question after a bias and clarity check.
 * - BiasClarityCheckInput - The input type for the performBiasClarityCheck function.
 * - BiasClarityCheckOutput - The return type for the performBiasClarityCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BiasClarityCheckInputSchema = z.object({
  question: z.string().describe('The question to check for bias and clarity.'),
});
export type BiasClarityCheckInput = z.infer<typeof BiasClarityCheckInputSchema>;

const BiasClarityCheckOutputSchema = z.object({
  revisedQuestion: z.string().describe('The revised question after bias and clarity check.'),
});
export type BiasClarityCheckOutput = z.infer<typeof BiasClarityCheckOutputSchema>;

export async function performBiasClarityCheck(input: BiasClarityCheckInput): Promise<BiasClarityCheckOutput> {
  return biasClarityCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'biasClarityCheckPrompt',
  input: {schema: BiasClarityCheckInputSchema},
  output: {schema: BiasClarityCheckOutputSchema},
  prompt: `You are an AI assistant specialized in identifying and mitigating bias and improving clarity in questions.

  Given the question below, please revise it to ensure it is unbiased, clear, and unambiguous. Return only the revised question.

  Question: {{{question}}}`,
});

const biasClarityCheckFlow = ai.defineFlow(
  {
    name: 'biasClarityCheckFlow',
    inputSchema: BiasClarityCheckInputSchema,
    outputSchema: BiasClarityCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
