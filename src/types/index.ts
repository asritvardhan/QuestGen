import { type GenerateQuestionsOutput } from '@/ai/flows/generate-questions';

export type Question = GenerateQuestionsOutput['questions'][number];
export type GeneratedData = GenerateQuestionsOutput;
