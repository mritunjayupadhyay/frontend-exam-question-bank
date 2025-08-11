"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useCreateExamPaperSection, useUpdateExamPaperSection } from "@/react-query-hooks/hooks/use-exam-paper-sections";
import { ICreateExamPaperSectionRequest, IExamPaperSection } from "@/api-handler/exam-papers.api";

const formSchema = z.object({
  sectionNumber: z
    .number()
    .min(1, "Section number must be at least 1")
    .max(20, "Section number cannot exceed 20"),
    
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
    
  instructions: z
    .string()
    .max(500, "Instructions cannot exceed 500 characters")
    .optional(),
    
  marksPerQuestion: z
    .number()
    .min(1, "Marks per question must be at least 1")
    .max(50, "Marks per question cannot exceed 50"),
    
  questionsToAnswer: z
    .number()
    .min(1, "Questions to answer must be at least 1")
    .max(100, "Questions to answer cannot exceed 100"),
    
  totalQuestions: z
    .number()
    .min(1, "Total questions must be at least 1")
    .max(200, "Total questions cannot exceed 200"),
}).refine((data) => data.questionsToAnswer <= data.totalQuestions, {
  message: "Questions to answer cannot be more than total questions",
  path: ["questionsToAnswer"],
});

const DEFAULT_VALUES: FormValues = {
  sectionNumber: 1,
  title: "",
  instructions: "",
  marksPerQuestion: 1,
  questionsToAnswer: 1,
  totalQuestions: 1,
};

type FormValues = z.infer<typeof formSchema>;

interface ExamPaperSectionFormProps {
  examPaperId: string;
  section?: IExamPaperSection;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ExamPaperSectionForm({
  examPaperId,
  section,
  onSuccess,
  onCancel
}: ExamPaperSectionFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const createSectionMutation = useCreateExamPaperSection(examPaperId);
  const updateSectionMutation = useUpdateExamPaperSection();

  const isEditing = !!section;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: section ? {
      sectionNumber: section.sectionNumber,
      title: section.title,
      instructions: section.instructions || "",
      marksPerQuestion: section.marksPerQuestion,
      questionsToAnswer: section.questionsToAnswer,
      totalQuestions: section.totalQuestions,
    } : DEFAULT_VALUES,
  });

  const questionsToAnswer = form.watch("questionsToAnswer");
  const marksPerQuestion = form.watch("marksPerQuestion");
  const sectionMarks = questionsToAnswer * marksPerQuestion;

  const resetForm = React.useCallback(() => {
    form.reset(section ? {
      sectionNumber: section.sectionNumber,
      title: section.title,
      instructions: section.instructions || "",
      marksPerQuestion: section.marksPerQuestion,
      questionsToAnswer: section.questionsToAnswer,
      totalQuestions: section.totalQuestions,
    } : DEFAULT_VALUES);
  }, [form, section]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const payload: ICreateExamPaperSectionRequest = {
        sectionNumber: values.sectionNumber,
        title: values.title,
        instructions: values.instructions || undefined,
        marksPerQuestion: values.marksPerQuestion,
        questionsToAnswer: values.questionsToAnswer,
        totalQuestions: values.totalQuestions,
      };

      if (isEditing && section) {
        await updateSectionMutation.mutateAsync({
          sectionId: section.id,
          data: payload,
        });
        toast.success("Section has been updated successfully!");
      } else {
        await createSectionMutation.mutateAsync(payload);
        toast.success("Section has been created successfully!");
        resetForm();
      }
      
      onSuccess?.();
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} section. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? 'Edit Section' : 'Create New Section'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section Number and Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sectionNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter section number..."
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Multiple Choice Questions"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Instructions */}
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Answer any 10 questions from the following..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Question Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="marksPerQuestion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marks per Question *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter marks..."
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="questionsToAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Questions to Answer *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter count..."
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Questions *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter total..."
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section Summary */}
              {sectionMarks > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Section Summary:</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Total Section Marks:</span> {sectionMarks} marks</p>
                    <p><span className="font-medium">Question Pattern:</span> Answer {questionsToAnswer} out of {form.watch("totalQuestions")} questions</p>
                    <p><span className="font-medium">Each Question:</span> {marksPerQuestion} marks</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Section' : 'Create Section'
              )}
            </Button>
            
            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Form
              </Button>
            )}
            
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}