"use server";

import { generateQuestions } from "@/ai/flows/generate-questions";

export async function generateQuestionsAction(syllabus: string) {
  try {
    const result = await generateQuestions({ syllabus });
    if (!result || !result.questions || result.questions.length === 0) {
      throw new Error("The AI returned an empty or invalid result. Please try refining your syllabus.");
    }
    return { success: true, data: result };
  } catch (e: any) {
    console.error("Error generating questions:", e);
    // Prefer returning a specific error message from the caught error if available
    const errorMessage = e?.message || "An unexpected error occurred while communicating with the AI. Please try again later.";
    return { success: false, error: errorMessage };
  }
}
