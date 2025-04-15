import { IQuestion } from 'question-bank-interface';
import React from 'react';
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from "../ui/badge";
import { ComponentProps } from "react";
import Text from "../../components/common/text";
import { questionsState, selectQuestion } from "../../rtk/slices/question.slice";

interface QuestionCardProps {
  question: IQuestion;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { selectedQuestion } = useSelector(questionsState);
  const dispatch = useDispatch();

  const onSelectQuestion = (question: IQuestion) => {
    console.log("selectedQuestion", question);
    dispatch(selectQuestion(question)); 
  };
  return (
    <button
            key={question.id}
            className={cn(
              "flex flex-col questions-start gap-2 rounded-lg border p-3 text-left text-sm transition-all bg-white hover:bg-accent",
              selectedQuestion?.id === question.id && "bg-muted"
            )}
            onClick={() =>
                onSelectQuestion(question)
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex questions-center">
                <div className="flex questions-center gap-2">
                <Badge variant="label">Class: {question.className}</Badge>

                  <Badge variant="label">{question.subject}</Badge>
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selectedQuestion?.id === question.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Badge variant="success">{question.marks}</Badge>
                </div>
              </div>
              
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
            <Text type="boldText">
              {question.questionText.substring(0, 150)}
              </Text>
            </div>
            {[question.topic].length ? (
              <div className="flex questions-center gap-2">
                {[question.topic, question.difficultyLevel].map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
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
export default QuestionCard;