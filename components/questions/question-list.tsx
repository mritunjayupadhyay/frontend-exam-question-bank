"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { IQuestion } from "question-bank-interface";
import { Badge } from "../ui/badge";
import { ComponentProps } from "react";
import Text from "../../components/common/text";

const QuestionList = ({ questions }: { questions: IQuestion[] }) => {
  console.log({ questions });

  const selectQuestion = (question: unknown) => {
    console.log(question);
  };
  const selectedQuestion = { selected: "1" };

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {questions.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all bg-white hover:bg-accent",
              selectedQuestion.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              selectQuestion({
                item,
              })
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                <Badge variant="label">Class: {item.className}</Badge>

                  <Badge variant="label">{item.subject}</Badge>
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selectedQuestion.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Badge variant="success">{item.marks}</Badge>
                </div>
              </div>
              
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
            <Text type="boldText">{item.questionText}</Text>
            </div>
            {[item.topic].length ? (
              <div className="flex items-center gap-2">
                {[item.topic, item.difficultyLevel].map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}

export default QuestionList;
