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
import { useFieldArray, useForm, FieldErrors } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { TiptapEditor } from "@/components/common/tiptap-editor";
import {
  DifficultyLevel,
  ICreateQuestionRequest,
  QuestionType,
  IQuestionFullDetails,
} from "question-bank-interface";
import { ChevronDown, ChevronUp, Plus, Trash2, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SearchableSelectSingle from "@/components/common/searchable-single-select";
import { Badge } from "@/components/ui/badge";
import { useTopics } from "@/react-query-hooks/hooks/use-topics";
import { useUpdateQuestion } from "@/react-query-hooks/hooks/use-questions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const questionOptionSchema = z.object({
  optionText: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean(),
});

const formSchema = z
  .object({
    questionText: z
      .string()
      .min(5)
      .refine((val) => {
        const textContent = val.replace(/<[^>]*>/g, "").trim();
        return textContent.length >= 2;
      }, "Question must contain at least 2 characters of actual content"),
    marks: z
      .number()
      .min(1, "Marks must be at least 1")
      .max(100, "Marks cannot exceed 100"),

    difficultyLevel: z.nativeEnum(DifficultyLevel, {
      required_error: "Please select a difficulty level",
    }),

    questionType: z.nativeEnum(QuestionType, {
      required_error: "Please select a question type",
    }),

    topicId: z
      .object({
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
      })
      .refine((data) => data.value.length > 0, {
        message: "Topic is required",
      }),
    options: z.array(questionOptionSchema).optional(),
  })
  .refine(
    (data) => {
      // If it's multiple choice, options are required and at least one must be correct
      if (data.questionType === QuestionType.MULTIPLE_CHOICE) {
        if (!data.options || data.options.length < 2) {
          return false;
        }
        return data.options.some((option) => option.isCorrect);
      }
      return true;
    },
    {
      message:
        "Multiple choice questions must have at least 2 options with at least one correct answer",
      path: ["options"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

interface QuestionEditFormProps {
  questionDetails: IQuestionFullDetails;
}

export default function QuestionEditForm({ questionDetails }: QuestionEditFormProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const updateQuestionMutation = useUpdateQuestion();

  // Initialize form with existing question data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: questionDetails.questionText || "",
      marks: questionDetails.marks || 1,
      difficultyLevel: (questionDetails.difficultyLevel as DifficultyLevel) || DifficultyLevel.LOW,
      questionType: (questionDetails.questionType as QuestionType) || QuestionType.DESCRIPTIVE,
      topicId: {
        label: questionDetails.topic || "",
        value: questionDetails.topic || "",
      },
      options: questionDetails.questionOptions?.map(option => ({
        optionText: option.optionText,
        isCorrect: option.isCorrect,
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const questionType = form.watch("questionType");
  const questionText = form.watch("questionText");
  const questionMarks = form.watch("marks");
  const difficultyLevel = form.watch("difficultyLevel");
  const topic = form.watch("topicId");

  const { data: topics, isLoading: isLoadingTopics, error: topicsError } = useTopics(questionDetails.subjectId);

  // Debug logging
  React.useEffect(() => {
    console.log("Topics debug:", {
      subjectId: questionDetails.subjectId,
      isLoadingTopics,
      topicsData: topics?.data,
      topicsLength: topics?.data?.length,
      questionTopicId: questionDetails.topicId,
      questionTopic: questionDetails.topic,
      topicsError,
      hasSubjectId: !!questionDetails.subjectId
    });
  }, [topics, isLoadingTopics, questionDetails.subjectId, questionDetails.topicId, questionDetails.topic, topicsError]);

  // Update the topic field when topics are loaded and we have the topic data
  React.useEffect(() => {
    if (topics?.data && questionDetails.topicId && questionDetails.topic) {
      const currentTopicValue = form.getValues("topicId");
      // Only update if the current value is empty or doesn't match
      if (!currentTopicValue.value || currentTopicValue.label !== questionDetails.topic) {
        form.setValue("topicId", {
          label: questionDetails.topic,
          value: questionDetails.topicId,
        });
      }
    }
  }, [topics, questionDetails.topicId, questionDetails.topic, form]);

  const addOption = () => {
    // Validate existing options before adding new one
    if (questionType === QuestionType.MULTIPLE_CHOICE) {
      const hasEmptyOptions = fields.some((_, index) => {
        const optionText = form.getValues(`options.${index}.optionText`);
        return !optionText || optionText.trim().length === 0;
      });
      
      if (hasEmptyOptions) {
        toast.error("Please fill all existing options before adding a new one.");
        return;
      }
    }
    
    append({ optionText: "", isCorrect: false });
  };

  const removeOption = (index: number) => {
    remove(index);
  };

  // Check for duplicate options
  const checkDuplicateOption = (currentIndex: number, value: string) => {
    if (!value || value.trim().length === 0) return false;
    
    const trimmedValue = value.trim().toLowerCase();
    return fields.some((_, index) => {
      if (index === currentIndex) return false;
      const optionText = form.getValues(`options.${index}.optionText`);
      return optionText && optionText.trim().toLowerCase() === trimmedValue;
    });
  };

  // Enhanced form validation before submit
  const validateForm = (): boolean => {
    // Validate question text
    const questionTextValue = form.getValues("questionText");
    if (!questionTextValue || questionTextValue.trim().length === 0) {
      toast.error("Question text is required.");
      return false;
    }

    // Validate topic selection
    const topicValue = form.getValues("topicId");
    if (!topicValue?.value || topicValue.value.trim().length === 0) {
      toast.error("Please select a topic for the question.");
      return false;
    }

    // Validate marks
    const marks = form.getValues("marks");
    if (!marks || marks < 1 || marks > 100) {
      toast.error("Marks must be between 1 and 100.");
      return false;
    }

    // MCQ specific validation
    if (questionType === QuestionType.MULTIPLE_CHOICE) {
      if (!fields.length || fields.length < 2) {
        toast.error("Multiple choice questions need at least 2 options.");
        return false;
      }
      
      // Check for empty options
      const hasEmptyOptions = fields.some((_, index) => {
        const optionText = form.getValues(`options.${index}.optionText`);
        return !optionText || optionText.trim().length === 0;
      });
      
      if (hasEmptyOptions) {
        toast.error("All option fields must be filled.");
        return false;
      }
      
      const hasCorrectAnswer = fields.some((_, index) => 
        form.getValues(`options.${index}.isCorrect`)
      );
      
      if (!hasCorrectAnswer) {
        toast.error("Please mark at least one option as correct.");
        return false;
      }

      // Check for duplicate options
      const optionTexts = fields.map((_, index) => 
        form.getValues(`options.${index}.optionText`).trim().toLowerCase()
      );
      const uniqueOptions = new Set(optionTexts);
      
      if (uniqueOptions.size !== optionTexts.length) {
        toast.error("Option texts must be unique.");
        return false;
      }
    }

    return true;
  };

  // Handle form validation errors
  const onInvalid = (errors: FieldErrors<FormValues>) => {
    console.log("Form validation errors:", errors);
    
    // Show specific error messages based on the first error encountered
    const errorKeys = Object.keys(errors) as (keyof FormValues)[];
    if (errorKeys.length > 0) {
      const firstError = errorKeys[0];
      const errorMessage = errors[firstError]?.message;
      
      switch (firstError) {
        case 'questionText':
          toast.error("Please enter a valid question text (minimum 2 characters).");
          break;
        case 'marks':
          toast.error("Please select valid marks (1-100).");
          break;
        case 'difficultyLevel':
          toast.error("Please select a difficulty level.");
          break;
        case 'questionType':
          toast.error("Please select a question type.");
          break;
        case 'topicId':
          toast.error("Please select a topic.");
          break;
        case 'options':
          toast.error(errorMessage || "Please check your answer options.");
          break;
        default:
          toast.error(errorMessage || "Please check all required fields.");
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = {
        ...values,
        options:
          values.questionType === QuestionType.MULTIPLE_CHOICE
            ? values.options
            : undefined,
      };
      
      // Additional client-side validation
      formSchema.parse(submitData);
      
      const payload: ICreateQuestionRequest = {
        questionText: submitData.questionText,
        marks: submitData.marks,
        difficultyLevel: submitData.difficultyLevel,
        questionType: submitData.questionType,
        subjectId: questionDetails.subjectId,
        topicId: submitData.topicId.value,
        classId: questionDetails.classId,
        options: submitData.options?.map((option) => ({
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        })),
      };
      
      console.log("Submitting payload:", payload);
      
      const result = await updateQuestionMutation.mutateAsync({
        id: questionDetails.id,
        payload
      });
      console.log("Question update result:", result);
      
      toast.success("Question has been updated successfully!", {
        style: {
          background: "var(--Extended-Colors-On-Success-Container, #00D16B1A)",
          color: "var(--Extended-Colors-On-Success, #007F41)",
          border: "1px solid var(--Extended-Colors-On-Success, #007F41)",
        },
      });
      
      // Navigate back to questions list or details
      router.push("/questions");
    } catch (error: unknown) {
      console.error("Error updating question:", error);
      
      // Handle different types of errors with more specific checking
      if (error && typeof error === 'object') {
        // Check for React Query mutation error
        if ('message' in error && typeof error.message === 'string') {
          toast.error(`Error: ${error.message}`);
        }
        // Check for fetch/axios style error
        else if ('response' in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          if (axiosError.response?.data?.message) {
            toast.error(`Server error: ${axiosError.response.data.message}`);
          } else {
            toast.error("Failed to update question. Please try again.");
          }
        }
        // Check for generic error object
        else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else if (error instanceof Error) {
        if (error.name === 'ZodError') {
          toast.error("Please check all required fields and try again.");
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.error("Failed to update question. Please try again.");
      }
    } finally {
      console.log("Finally block executing, setting isSubmitting to false");
      setIsSubmitting(false);
    }
  }

  // Auto-add options when switching to MCQ
  React.useEffect(() => {
    if (questionType === QuestionType.MULTIPLE_CHOICE && fields.length === 0) {
      // Add 2 default options without causing focus issues
      setTimeout(() => {
        append({ optionText: "", isCorrect: false });
        append({ optionText: "", isCorrect: false });
      }, 0);
    }
  }, [questionType, fields.length, append]);

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Question Configuration
                <Button
                  type="button"
                  variant="transparent"
                  size="sm"
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2"
                >
                  {open ? <ChevronDown /> : <ChevronUp />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {open ? (
                <div className="space-y-8">
                  <div>
                    <FormField
                      control={form.control}
                      name="marks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marks *</FormLabel>
                          <FormControl>
                            <div className="flex flex-wrap gap-2">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mark) => (
                                <Button
                                  key={mark}
                                  type="button"
                                  variant={
                                    field.value === mark
                                      ? "secondary"
                                      : "outline"
                                  }
                                  onClick={() => field.onChange(mark)}
                                >
                                  {mark}
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="difficultyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level *</FormLabel>
                          <FormControl>
                            <div className="flex flex-wrap gap-2">
                              {[
                                DifficultyLevel.LOW,
                                DifficultyLevel.MEDIUM,
                                DifficultyLevel.HARD,
                              ].map((difficulty) => (
                                <Button
                                  key={difficulty}
                                  type="button"
                                  variant={
                                    field.value === difficulty
                                      ? "secondary"
                                      : "outline"
                                  }
                                  onClick={() => field.onChange(difficulty)}
                                >
                                  {difficulty.toUpperCase()}
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Topic */}
                    <FormField
                      control={form.control}
                      name="topicId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic *</FormLabel>
                          <FormControl>
                            <div>
                              <SearchableSelectSingle
                                options={(topics?.data || []).map(
                                  (topic) => {
                                    console.log("Mapping topic:", topic);
                                    return {
                                      value: topic.id,
                                      label: topic.name,
                                    };
                                  }
                                )}
                                title="Select topic"
                                value={field.value.value}
                                onChange={(selectedTopic) => {
                                  console.log("Topic selected:", selectedTopic);
                                  field.onChange(selectedTopic);
                                }}
                                placeholder={
                                  isLoadingTopics
                                    ? "Loading topics..."
                                    : topicsError
                                    ? "Error loading topics"
                                    : "Select topic"
                                }
                                isLoading={isLoadingTopics}
                              />
                              {topicsError && (
                                <p className="text-sm text-red-500 mt-1">
                                  Error loading topics: {topicsError.message}
                                </p>
                              )}
                              {!isLoadingTopics && !topicsError && (!topics?.data || topics.data.length === 0) && (
                                <p className="text-sm text-yellow-600 mt-1">
                                  No topics found for this subject
                                </p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex questions-center gap-2">
                  <Badge variant="label">Class: {questionDetails.className}</Badge>
                  {difficultyLevel && (
                    <Badge variant="label">Difficulty: {difficultyLevel}</Badge>
                  )}
                  {topic.label && (
                    <Badge variant="label">Topic: {topic.label}</Badge>
                  )}
                  <Badge variant="label">Subject: {questionDetails.subject}</Badge>
                  {questionMarks && (
                    <Badge variant="success">Marks: {questionMarks}</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <div
              className="flex justify-between items-center"
              style={{ marginBottom: "0.5rem" }}
            >
              <FormLabel>Question Text</FormLabel>
              <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="question-type-switch"
                          checked={field.value === QuestionType.MULTIPLE_CHOICE}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? QuestionType.MULTIPLE_CHOICE
                                : QuestionType.DESCRIPTIVE
                            )
                          }
                        />
                        <Label htmlFor="question-type-switch">MCQ</Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write your question text here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Multiple Choice Options */}
          {questionType === QuestionType.MULTIPLE_CHOICE && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Answer Options
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Option
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-start gap-3 p-4 border rounded-lg"
                  >
                    <div className="flex-1 space-y-3">
                      <FormField
                        control={form.control}
                        name={`options.${index}.optionText`}
                        render={({ field }) => {
                          const isDuplicate = checkDuplicateOption(index, field.value);
                          return (
                            <FormItem>
                              <FormLabel>Option {index + 1}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter option text..."
                                  {...field}
                                  className={isDuplicate ? "border-red-300 focus:border-red-500" : ""}
                                />
                              </FormControl>
                              {isDuplicate && (
                                <p className="text-sm text-red-500">
                                  This option text is already used
                                </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name={`options.${index}.isCorrect`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Correct Answer</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No options added yet.</p>
                    <p className="text-sm">
                      Click &quot;Add Option&quot; to create answer choices.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {questionText && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: questionText }}
                />
                {questionType === QuestionType.MULTIPLE_CHOICE &&
                  fields.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {fields.map((field, index) => {
                        const optionText = form.watch(
                          `options.${index}.optionText`
                        );
                        const isCorrect = form.watch(
                          `options.${index}.isCorrect`
                        );
                        return (
                          <div
                            key={field.id}
                            className={`p-2 rounded border ${
                              isCorrect
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <span className="font-medium">
                              {String.fromCharCode(65 + index)}.
                            </span>{" "}
                            {optionText}
                            {isCorrect && (
                              <span className="ml-2 text-green-600 text-sm">
                                ✓ Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Question
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}