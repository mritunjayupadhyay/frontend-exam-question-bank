/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { TiptapEditor } from "@/components/common/tiptap-editor";
import {
  DifficultyLevel,
  ICreateQuestionRequest,
  QuestionType,
} from "question-bank-interface";
import { ChevronDown, ChevronUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SearchableSelectSingle from "@/components/common/searchable-single-select";
import { Badge } from "@/components/ui/badge";
import { useSubjects } from "@/react-query-hooks/hooks/use-subjects";
import { useClasses } from "@/react-query-hooks/hooks/use-classes";
import { useTopics } from "@/react-query-hooks/hooks/use-topics";
import { useCreateQuestion } from "@/react-query-hooks/hooks/use-questions";
import { useSelector } from "react-redux";
import { classSubjectState } from "@/rtk/slices/classSubject.slice";
import GetClassSubject from "@/components/questions/get-claas-subject";
import { toast } from "sonner";

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

const DEFAULT_VALUES: FormValues = {
  questionText: "",
  marks: 1,
  difficultyLevel: DifficultyLevel.LOW,
  questionType: QuestionType.DESCRIPTIVE,
  topicId: {
    label: "",
    value: "",
  },
  options: [],
};

type FormValues = z.infer<typeof formSchema>;

export default function QuestionForm() {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // const { data: subjects, isLoading: isLoadingSubjects } = useSubjects();
  // const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const [editorKey, setEditorKey] = React.useState(0);
  const { className, subject } = useSelector(classSubjectState);

  const createQuestionMutation = useCreateQuestion();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: "",
      marks: 1,
      difficultyLevel: DifficultyLevel.LOW,
      questionType: QuestionType.DESCRIPTIVE,
      topicId: {
        label: "",
        value: "",
      },
      options: [],
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
  // const subject = form.watch("subjectId");
  const topic = form.watch("topicId");

  const { data: topics, isLoading: isLoadingTopics } = useTopics(subject?.id);

  const addOption = () => {
    append({ optionText: "", isCorrect: false });
  };

  const removeOption = (index: number) => {
    remove(index);
  };

  // Selective reset function - only reset question content, keep configuration
  const resetForm = React.useCallback(() => {
    // Only reset question text and options
    form.setValue("questionText", "");
    
    // Clear all options
    fields.forEach((_, index) => remove(index));
    
    // Clear all options first
    while (fields.length > 0) {
      remove(0);
    }
    
    // If it's MCQ, add default options back immediately
    // if (questionType === QuestionType.MULTIPLE_CHOICE) {
    //   append({ optionText: "", isCorrect: false });
    //   append({ optionText: "", isCorrect: false });
    // }
    
    // Force TiptapEditor to re-render with empty content
    setEditorKey(prev => prev + 1);
  }, [form, fields, remove, append, questionType]);

  // Form validation before submit
  const validateForm = (): boolean => {
    if (!(className?.id && subject?.id)) {
      toast.error("Please select a class and subject first.");
      return false;
    }

    if (questionType === QuestionType.MULTIPLE_CHOICE) {
      if (!fields.length || fields.length < 2) {
        toast.error("Multiple choice questions need at least 2 options.");
        return false;
      }
      
      const hasCorrectAnswer = fields.some((_, index) => 
        form.getValues(`options.${index}.isCorrect`)
      );
      
      if (!hasCorrectAnswer) {
        toast.error("Please mark at least one option as correct.");
        return false;
      }
    }

    return true;
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
      formSchema.parse(submitData);
      const payload: ICreateQuestionRequest = {
        questionText: submitData.questionText,
        marks: submitData.marks,
        difficultyLevel: submitData.difficultyLevel,
        questionType: submitData.questionType,
        subjectId: subject?.id as string,
        topicId: submitData.topicId.value,
        classId: className?.id as string,
        options: submitData.options?.map((option) => ({
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        })),
      };
      await createQuestionMutation.mutateAsync(payload);
      toast.success("Question has been created successfully!");
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error("Failed to create question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Auto-add options when switching to MCQ
  React.useEffect(() => {
    if (questionType === QuestionType.MULTIPLE_CHOICE && fields.length === 0) {
      // Add 2 default options
      append({ optionText: "", isCorrect: false });
      append({ optionText: "", isCorrect: false });
    }
  }, [questionType, fields.length, append]);

  if (!(className?.id && subject?.id)) {
    return <GetClassSubject />;
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    {/* Marks */}

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
                    {subject?.id ? (
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
                                    (topic) => ({
                                      value: topic.id,
                                      label: topic.name,
                                    })
                                  )}
                                  title="Select topic"
                                  value={field.value.value}
                                  onChange={field.onChange}
                                  placeholder={
                                    isLoadingTopics
                                      ? "Loading topics..."
                                      : "Select topic"
                                  }
                                  isLoading={isLoadingTopics}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : null}

                    {/* Question Type */}
                  </div>
                </div>
              ) : (
                <div className="flex questions-center gap-2">
                  {className.name && (
                    <Badge variant="label">Class: {className.name}</Badge>
                  )}
                  {difficultyLevel && (
                    <Badge variant="label">Difficulty: {difficultyLevel}</Badge>
                  )}
                  {topic.label && (
                    <Badge variant="label">Topic: {topic.label}</Badge>
                  )}
                  {subject.name && (
                    <Badge variant="label">Subject: {subject.name}</Badge>
                  )}
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
                          id="airplane-mode"
                          checked={field.value === QuestionType.MULTIPLE_CHOICE}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? QuestionType.MULTIPLE_CHOICE
                                : QuestionType.DESCRIPTIVE
                            )
                          }
                        />
                        <Label htmlFor="airplane-mode">MCQ</Label>
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
                      key={editorKey}
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Option {index + 1}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter option text..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
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
                              <FormDescription>
                                Mark this option as correct
                              </FormDescription>
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
                "Create Question"
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
