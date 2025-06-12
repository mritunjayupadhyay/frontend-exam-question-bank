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
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/upload/basic-upload";
import { TiptapEditor } from "@/components/common/tiptap-editor";

const formSchema = z.object({
  questionText: z
    .string()
    .min(5)
    .refine((val) => {
      const textContent = val.replace(/<[^>]*>/g, "").trim();
      return textContent.length >= 2;
    }, "Question must contain at least 2 characters of actual content"),
});

export default function QuestionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  const questionText = form.watch("questionText");
  const textLength = questionText
    ? questionText.replace(/<[^>]*>/g, "").length
    : 0;
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Form {...form}>
        <div className="space-y-8">
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
          <FileUploader />
          <div className="flex gap-3">
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Submit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </div>
      </Form>
      {questionText && (
        <div className="mt-8 p-4 border rounded-lg bg-muted/50">
          <h3 className="text-sm font-medium mb-3">Preview</h3>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: questionText }}
          />
        </div>
      )}
    </div>
  );
}
