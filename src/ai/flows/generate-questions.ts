'use server';

/**
 * @fileOverview Generates practice questions from a syllabus.
 *
 * - generateQuestions - A function that generates practice questions from a syllabus.
 * - GenerateQuestionsInput - The input type for the generateQuestions function.
 * - GenerateQuestionsOutput - The return type for the generateQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionsInputSchema = z.object({
  syllabus: z.string().describe('The syllabus content as text.'),
});
export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;

const QuestionSchema = z.object({
  type: z.enum(['MCQ', 'Short Answer', 'Long Answer']).describe('The type of question.'),
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).optional().describe('The multiple choice options, if applicable.'),
  correctAnswer: z.string().optional().describe('The correct answer for MCQs.'),
  bloomsTaxonomyLevel: z
    .enum(['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'])
    .describe('The Bloom\'s Taxonomy level of the question.'),
  learningOutcomes: z.string().describe('The learning outcome(s) addressed by the question.'),
});

const GenerateQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('The generated questions.'),
  answerKey: z.string().describe('The answer key for all questions.'),
});
export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

export async function generateQuestions(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  input: {schema: GenerateQuestionsInputSchema},
  output: {schema: GenerateQuestionsOutputSchema},
  prompt: `You are an experienced teacher creating a practice question paper based on the given syllabus.  Your goal is to create a variety of questions that will help students prepare for their exams.

  Syllabus:
  {{syllabus}}

  Instructions:
  1.  Generate a mix of question types: Multiple Choice Questions (MCQs), Short Answer questions, and Long Answer questions.
  2.  For each question, tag it with the appropriate Bloom's Taxonomy level (Remember, Understand, Apply, Analyze, Evaluate, Create) and the specific learning outcome(s) it addresses.
  3.  Ensure that the questions are clear, unbiased, and relevant to the syllabus content.
  4.  Provide a detailed answer key that includes the correct answers for all questions, including explanations or worked solutions where necessary.

  Output Format:
  Return the questions as a JSON array of question objects, and the answer key as a single string.
  Each question object should have the following keys:
  - type (string, either \"MCQ\", \"Short Answer\", or \"Long Answer\")
  - question (string)
  - options (array of strings, only for MCQs)
  - correctAnswer (string, only for MCQs)
  - bloomsTaxonomyLevel (string, from the Bloom's Taxonomy levels above)
  - learningOutcomes (string)

  Here is the JSON schema for the output:
  {{outputSchema}}
`,
});

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
