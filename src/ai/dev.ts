import { config } from 'dotenv';
config();

import '@/ai/flows/extract-concepts.ts';
import '@/ai/flows/bias-clarity-check.ts';
import '@/ai/flows/generate-answer-key.ts';
import '@/ai/flows/generate-questions.ts';