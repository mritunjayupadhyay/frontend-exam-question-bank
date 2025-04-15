import React from "react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { ComponentProps } from "react";
import Text from "../../components/common/text";
import { questionsState, selectQuestion } from "../../rtk/slices/question.slice";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const QuestionView: React.FC = () => {
  const { selectedQuestion } = useSelector(questionsState);
  const dispatch = useDispatch();

  const onSelectQuestion = () => {
    dispatch(selectQuestion(null)); 
  };

  if (!selectedQuestion) {
    return null;
  }

  return (
    <div className="w-full h-inherit flex flex-col justify-center items-center p-4 pr-0">
      <div className="h-12 w-full flex items-center justify-start">
        <Button variant="outline" size="icon" onClick={onSelectQuestion}>
          <ArrowLeft />
        </Button>
      </div>
      <div
        className={cn(
          "flex flex-col w-full questions-start gap-2 rounded-lg p-3 text-left text-sm transition-all bg-transparent hover:bg-accent"
        )}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex questions-center">
            <div className="flex questions-center gap-2">
              <Badge variant="label">Class: {selectedQuestion.className}</Badge>

              <Badge variant="label">{selectedQuestion.subject}</Badge>
            </div>
            <div className={cn("ml-auto text-xs")}>
              <Badge variant="success">{selectedQuestion.marks}</Badge>
            </div>
          </div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          <Text type="boldText">{selectedQuestion.questionText}</Text>
        </div>
        {[selectedQuestion.topic].length ? (
          <div className="flex questions-center gap-2">
            {[selectedQuestion.topic, selectedQuestion.difficultyLevel].map(
              (label) => (
                <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                  {label}
                </Badge>
              )
            )}
          </div>
        ) : null}
      </div>
    </div>
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
export default QuestionView;
