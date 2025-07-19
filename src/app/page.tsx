"use client";

import { useState } from "react";
import { LoaderCircle, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateQuestionsAction } from "@/app/actions";
import { type GeneratedData } from "@/types";
import { GeneratedContent } from "@/components/generated-content";
import { Logo } from "@/components/logo";

export default function Home() {
  const [syllabus, setSyllabus] = useState("");
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!syllabus.trim()) {
      toast({
        title: "Syllabus is empty",
        description: "Please paste or type your syllabus content.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setGeneratedData(null);
    try {
      const result = await generateQuestionsAction(syllabus);
      if (result.success && result.data) {
        setGeneratedData(result.data);
      } else {
        throw new Error(result.error || "An unknown error occurred.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate questions.";
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setGeneratedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto p-4 md:p-8">
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-8 lg:sticky lg:top-8">
          <header>
            <Logo />
            <p className="text-muted-foreground mt-2">
              Instantly generate practice questions from your syllabus with the power of AI.
            </p>
          </header>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                Syllabus Input
              </CardTitle>
              <CardDescription>
                Paste your syllabus content below to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your syllabus here..."
                className="min-h-[300px] text-base resize-y"
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                disabled={isLoading}
              />
               <div className="text-sm text-muted-foreground mt-4 text-center">
                 Or upload a PDF (coming soon!)
                 <input type="file" disabled className="sr-only" />
               </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Wand2 />
                )}
                Generate Questions
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:mt-0 mt-8">
          <GeneratedContent isLoading={isLoading} data={generatedData} />
        </div>
      </main>
    </div>
  );
}
