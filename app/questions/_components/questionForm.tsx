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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/upload/basic-upload";
import { TiptapEditor } from "@/components/common/tiptap-editor";
import { DifficultyLevel, QuestionType } from "question-bank-interface";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

    subjectId: z.string().min(1, "Subject is required"),

    topicId: z.string().min(1, "Topic is required"),

    classId: z.string().min(1, "Class is required"),
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

export default function QuestionForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: "",
      marks: 1,
      difficultyLevel: undefined,
      questionType: undefined,
      subjectId: "",
      topicId: "",
      classId: "",
      options: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const questionType = form.watch("questionType");
  const questionText = form.watch("questionText");

  // Mock data for dropdowns - replace with actual data from your API
  const subjects = [
    { id: "sub1", name: "Mathematics" },
    { id: "sub2", name: "Science" },
    { id: "sub3", name: "English" },
  ];

  const topics = [
    { id: "topic1", name: "Algebra" },
    { id: "topic2", name: "Geometry" },
    { id: "topic3", name: "Physics" },
  ];

  const classes = [
    { id: "class1", name: "Grade 10" },
    { id: "class2", name: "Grade 11" },
    { id: "class3", name: "Grade 12" },
  ];

  const addOption = () => {
    append({ optionText: "", isCorrect: false });
  };

  const removeOption = (index: number) => {
    remove(index);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    const submitData = {
      ...values,
      options:
        values.questionType === QuestionType.MULTIPLE_CHOICE
          ? values.options
          : undefined,
    };
    console.log(submitData);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Form {...form}>
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
                          variant={field.value === mark ? "secondary" : "outline"}
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
                      {[DifficultyLevel.LOW, DifficultyLevel.MEDIUM, DifficultyLevel.HARD].map((difficulty) => (
                        <Button
                          key={difficulty}
                          type="button"
                          variant={field.value === difficulty ? "secondary" : "outline"}
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

            {/* Question Type */}
            <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type *</FormLabel>
                  
                    <FormControl>
                      <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" 
          checked={field.value === QuestionType.MULTIPLE_CHOICE}
        onCheckedChange={(checked) => field.onChange(checked ? QuestionType.MULTIPLE_CHOICE : QuestionType.DESCRIPTIVE)} 
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
                <FormLabel>Question Text</FormLabel>
                <FormControl>
                  <TiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write your question text here..."
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Classification Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subject */}
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Subject category</FormDescription>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Specific topic</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Class */}
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Target class/grade</FormDescription>
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
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Submit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                // Clear the options array
                fields.forEach((_, index) => remove(index));
              }}
            >
              Reset Form
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
