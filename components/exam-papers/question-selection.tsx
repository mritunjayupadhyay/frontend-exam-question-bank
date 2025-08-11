"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useQuestions } from "@/react-query-hooks/hooks/use-questions";
import { useAddMultipleQuestionsToSection } from "@/react-query-hooks/hooks/use-exam-paper-questions";
import { useSelector } from "react-redux";
import { classSubjectState } from "@/rtk/slices/classSubject.slice";
import GetClassSubject from "@/components/questions/get-claas-subject";
import { IQuestion } from "question-bank-interface";
import { IAddQuestionToSectionRequest } from "@/api-handler/exam-papers.api";

interface QuestionSelectionProps {
  sectionId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  maxQuestions?: number;
  existingQuestionIds?: string[];
}

export default function QuestionSelection({
  sectionId,
  onSuccess,
  onCancel,
  maxQuestions,
  existingQuestionIds = []
}: QuestionSelectionProps) {
  const [selectedQuestions, setSelectedQuestions] = React.useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { className, subject } = useSelector(classSubjectState);
  const addMultipleQuestionsMutation = useAddMultipleQuestionsToSection(sectionId);

  // Use the questions hook with filters
  const { data: questionsData, isLoading: isLoadingQuestions } = useQuestions({
    classId: className?.id || "",
    subjectId: subject?.id || "",
  });

  // Filter out already added questions and apply search
  const availableQuestions = React.useMemo(() => {
    const questions = questionsData?.data || [];
    return questions.filter(question => {
      const isNotAdded = !existingQuestionIds.includes(question.id);
      const matchesSearch = searchTerm === "" || 
        question.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.topic.toLowerCase().includes(searchTerm.toLowerCase());
      return isNotAdded && matchesSearch;
    });
  }, [questionsData?.data, existingQuestionIds, searchTerm]);

  const handleQuestionToggle = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      if (maxQuestions && newSelected.size >= maxQuestions) {
        toast.error(`You can only select up to ${maxQuestions} questions for this section.`);
        return;
      }
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSelectAll = () => {
    const questionsToSelect = maxQuestions 
      ? availableQuestions.slice(0, maxQuestions - selectedQuestions.size)
      : availableQuestions;
    
    const newSelected = new Set(selectedQuestions);
    questionsToSelect.forEach(question => {
      if (!newSelected.has(question.id)) {
        newSelected.add(question.id);
      }
    });
    setSelectedQuestions(newSelected);
  };

  const handleDeselectAll = () => {
    setSelectedQuestions(new Set());
  };

  const handleSubmit = async () => {
    if (selectedQuestions.size === 0) {
      toast.error("Please select at least one question.");
      return;
    }

    setIsSubmitting(true);

    try {
      const questionsToAdd: IAddQuestionToSectionRequest[] = Array.from(selectedQuestions).map((questionId, index) => ({
        questionId,
        questionNumber: existingQuestionIds.length + index + 1,
        isOptional: false,
      }));

      await addMultipleQuestionsMutation.mutateAsync({ questions: questionsToAdd });
      toast.success(`Successfully added ${selectedQuestions.size} questions to the section.`);
      onSuccess?.();
    } catch (error) {
      console.error("Error adding questions:", error);
      toast.error("Failed to add questions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!(className?.id && subject?.id)) {
    return <GetClassSubject />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Questions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Choose questions from your question bank to add to this section
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">
                Selected: {selectedQuestions.size}
                {maxQuestions && ` / ${maxQuestions}`}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions by content or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={availableQuestions.length === 0 || (maxQuestions && selectedQuestions.size >= maxQuestions)}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                  disabled={selectedQuestions.size === 0}
                >
                  Deselect All
                </Button>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span>Found: {availableQuestions.length} questions</span>
                {existingQuestionIds.length > 0 && (
                  <span className="text-muted-foreground">
                    ({existingQuestionIds.length} already added)
                  </span>
                )}
              </div>
              {maxQuestions && (
                <div className="text-muted-foreground">
                  Can select {maxQuestions - selectedQuestions.size} more questions
                </div>
              )}
            </div>
          </div>

          {/* Class and Subject Info */}
          <div className="flex items-center gap-2">
            <Badge variant="label">Class: {className.name}</Badge>
            <Badge variant="label">Subject: {subject.name}</Badge>
          </div>

          {/* Questions List */}
          {isLoadingQuestions ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading questions...
              </div>
            </div>
          ) : availableQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No questions available{searchTerm && " matching your search"}.</p>
              {existingQuestionIds.length > 0 && (
                <p className="text-sm mt-2">
                  ({existingQuestionIds.length} questions already added to this section)
                </p>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[60vh] lg:h-96">
              <div className="space-y-3">
                {availableQuestions.map((question: IQuestion) => (
                  <div
                    key={question.id}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={`question-${question.id}`}
                      checked={selectedQuestions.has(question.id)}
                      onCheckedChange={() => handleQuestionToggle(question.id)}
                      disabled={maxQuestions && !selectedQuestions.has(question.id) && selectedQuestions.size >= maxQuestions}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{question.questionType}</Badge>
                          <Badge variant="outline">{question.difficultyLevel}</Badge>
                          <Badge variant="success">{question.marks} marks</Badge>
                        </div>
                      </div>
                      <div 
                        className="prose prose-sm max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: question.questionText }}
                      />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Topic: {question.topic}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              onClick={handleSubmit}
              disabled={selectedQuestions.size === 0 || isSubmitting}
              className="flex items-center gap-2 flex-1 sm:flex-none"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding Questions...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add {selectedQuestions.size} Question{selectedQuestions.size !== 1 ? 's' : ''}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex items-center gap-2"
                size="lg"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}