'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';
import QuestionSelection from '@/components/exam-papers/question-selection';
import { useExamPaperById } from '@/react-query-hooks/hooks/use-exam-papers';
import { useExamPaperSectionById, useExamPaperSectionWithQuestions } from '@/react-query-hooks/hooks/use-exam-paper-sections';

const AddQuestionsToSectionPage = () => {
  const params = useParams<{ id: string; sectionId: string }>();
  const router = useRouter();

  const { data: examPaper, isLoading: isLoadingExamPaper } = useExamPaperById(params.id);
  const { data: section, isLoading: isLoadingSection } = useExamPaperSectionById(params.sectionId);
  const { data: sectionWithQuestions } = useExamPaperSectionWithQuestions(params.sectionId);

  const existingQuestionIds = sectionWithQuestions?.questions?.map(q => q.questionId) || [];

  const handleSuccess = () => {
    router.push(`/exam-papers/${params.id}`);
  };

  const handleCancel = () => {
    router.push(`/exam-papers/${params.id}`);
  };

  if (isLoadingExamPaper || isLoadingSection) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!examPaper || !section) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Section Not Found</h2>
          <p className="text-muted-foreground mb-4">The section you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push(`/exam-papers/${params.id}`)}>
            Back to Exam Paper
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Exam Paper
            </Button>
            <div className="text-sm text-muted-foreground">
              {examPaper.title} → Section {section.sectionNumber}
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Add Questions to Section</h1>
            <p className="text-muted-foreground">
              Select questions from your question bank to add to this section
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Section Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Section {section.sectionNumber}: {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Marks per Question</p>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-lg font-semibold">{section.marksPerQuestion}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Questions to Answer</p>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold">{section.questionsToAnswer}</span>
                  <span className="text-muted-foreground">of {section.totalQuestions}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Section Marks</p>
                <Badge variant="success" className="text-base px-3 py-1">
                  {section.sectionMarks} marks
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Questions Added</p>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold">{existingQuestionIds.length}</span>
                  <span className="text-muted-foreground">questions</span>
                </div>
              </div>
            </div>
            
            {section.instructions && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Instructions:</span> {section.instructions}
                </p>
              </div>
            )}

            {/* Progress indicator */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Questions Added Progress</span>
                <span>{existingQuestionIds.length} / {section.totalQuestions}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${Math.min((existingQuestionIds.length / section.totalQuestions) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Selection */}
        <QuestionSelection
          sectionId={params.sectionId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          maxQuestions={section.totalQuestions}
          existingQuestionIds={existingQuestionIds}
        />
      </div>
    </div>
  );
};

export default AddQuestionsToSectionPage;