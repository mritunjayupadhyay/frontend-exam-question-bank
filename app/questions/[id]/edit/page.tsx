"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuestion } from "@/react-query-hooks/hooks/use-questions";
import QuestionEditForm from "../_components/QuestionEditForm";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;

  const { data: questionDetails, isLoading, error } = useQuestion(questionId);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error || !questionDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load question</p>
          <Button onClick={handleBack} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={handleBack}
            variant="outline"
            size="icon"
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Question</h1>
            <p className="text-muted-foreground">
              Update the question details and save your changes
            </p>
          </div>
        </div>
      </div>

      <QuestionEditForm questionDetails={questionDetails} />
    </div>
  );
}