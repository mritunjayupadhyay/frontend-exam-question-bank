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
import { RotateCcw } from "lucide-react";
import SearchableSelectSingle from "@/components/common/searchable-single-select";
import { useCreateExamPaper } from "@/react-query-hooks/hooks/use-exam-papers";
import { useSelector } from "react-redux";
import { classSubjectState } from "@/rtk/slices/classSubject.slice";
import GetClassSubject from "@/components/questions/get-claas-subject";
import { toast } from "sonner";
import { ICreateExamPaperRequest } from "@/api-handler/exam-papers.api";
import { useExamTypes } from "@/react-query-hooks/hooks/use-exam-types";



const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters"),
  
  durationMinutes: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(300, "Duration cannot exceed 5 hours"),

  examTypeId: z
    .object({
      label: z.string().min(1, "Label is required"),
      value: z.string().min(1, "Value is required"),
    })
    .refine((data) => data.value.length > 0, {
      message: "Exam type is required",
    }),
    
  totalMarks: z
    .number()
    .min(1, "Total marks must be at least 1")
    .max(1000, "Total marks cannot exceed 1000"),
});

const DEFAULT_VALUES: FormValues = {
  title: "",
  durationMinutes: 120,
  examTypeId: {
    label: "",
    value: "",
  },
  totalMarks: 100,
};

type FormValues = z.infer<typeof formSchema>;

export default function ExamPaperForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { className, subject } = useSelector(classSubjectState);
  const { data: examTypes, isLoading: isLoadingExamTypes } = useExamTypes();
  console.log("Exam Types:", examTypes);

  const createExamPaperMutation = useCreateExamPaper();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });


  // Selective reset function
  const resetForm = React.useCallback(() => {
    form.reset(DEFAULT_VALUES);
  }, [form]);

  // Form validation before submit
  const validateForm = (): boolean => {
    if (!(className?.id && subject?.id)) {
      toast.error("Please select a class and subject first.");
      return false;
    }
    return true;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: ICreateExamPaperRequest = {
        title: values.title,
        durationMinutes: values.durationMinutes,
        examTypeId: values.examTypeId.value,
        subjectId: subject?.id as string,
        classId: className?.id as string,
        totalMarks: values.totalMarks,
      };
      
      await createExamPaperMutation.mutateAsync(payload);
      toast.success("Exam paper has been created successfully!");
      resetForm();
    } catch (error) {
      console.error("Error creating exam paper:", error);
      toast.error("Failed to create exam paper. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!(className?.id && subject?.id)) {
    return <GetClassSubject />;
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Paper Title *</FormLabel>
                <FormControl>
                  <Input
                  variant="white-background"
                    placeholder="Enter exam paper title..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Exam Type */}
            <FormField
              control={form.control}
              name="examTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Type *</FormLabel>
                  <FormControl>
                    <SearchableSelectSingle
                      options={(examTypes?.data || []).map(
                        (examType) => {
                          console.log("Exam Type:", examType);
                          return {
                            label: examType.name,
                            value: examType.id,
                            isSelected: examType.id === field.value.value,
                          };
                        }
                      )}
                      title="Select exam type"
                      value={field.value.value}
                      onChange={field.onChange}
                      placeholder={
                        isLoadingExamTypes
                          ? "Loading exam types..."
                          : "Select exam type"
                      }
                      isLoading={isLoadingExamTypes}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes) *</FormLabel>
                  <FormControl>
                    <Input
                    variant="white-background"
                      type="number"
                      placeholder="Enter duration in minutes..."
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Marks */}
            <FormField
              control={form.control}
              name="totalMarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Marks *</FormLabel>
                  <FormControl>
                    <Input
                    variant="white-background"
                      type="number"
                      placeholder="Enter total marks..."
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Exam Paper"
              )}
            </Button>
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
          </div>
        </form>
      </Form>
    </div>
  );
}