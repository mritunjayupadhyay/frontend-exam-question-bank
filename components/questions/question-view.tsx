import React from "react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import Text from "../../components/common/text";
import {
  questionsState,
  selectQuestion,
} from "../../rtk/slices/question.slice";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useDeleteQuestion, useQuestion } from "@/react-query-hooks/hooks/use-questions";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

const QuestionView: React.FC = () => {
  const { selectedQuestion } = useSelector(questionsState);

  const { data: questionDetails, isLoading } = useQuestion(
    selectedQuestion?.id
  );
    const deleteQuestionMutation = useDeleteQuestion();
  
  console.log("questionDetails", {
    isLoading,
    questionDetails,
    id: questionDetails?.id,
  });

  const dispatch = useDispatch();

  const onSelectQuestion = () => {
    dispatch(selectQuestion(null));
  };

  const deleteQuestion = (id: string) => {
    // Implement delete logic here
    console.log("Delete question with ID:", id);
    deleteQuestionMutation.mutate(id);
    dispatch(selectQuestion(null));
  }

  if (!selectedQuestion) {
    return null;
  }

  return (
    <div className="w-full h-inherit flex flex-col justify-center items-center p-4 pr-0">
      <div className="h-12 w-full flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={onSelectQuestion}
          style={{ background: "transparent" }}
        >
          <ArrowLeft />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="link"
          size="icon"
          onClick={onSelectQuestion}
        >
          <Text type="lightText">Edit</Text>
        </Button>
        <Button
            variant="destructive"
          size="sm"
          onClick={() => deleteQuestion(selectedQuestion.id)}
        >
          <Text className="text-sm text-white">Delete</Text>
        </Button>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col w-full questions-start gap-2 rounded-lg p-3 text-left text-sm transition-all bg-transparent hover:bg-accent"
        )}
      >
        <div className="flex questions-center gap-2 items-end">
          <Text type="lightText" className="text-lg">
            Class:
          </Text>
          <Text type="boldText">{selectedQuestion.className}</Text>
        </div>
        <div className="flex questions-center gap-2 items-end">
          <Text type="lightText" className="text-lg">
            Subject:
          </Text>
          <Text type="boldText">{selectedQuestion.subject}</Text>
        </div>
        <div className="flex questions-center gap-2 items-end">
          <Text type="lightText" className="text-lg">
            Topic:
          </Text>
          <Text type="boldText">{selectedQuestion.topic}</Text>
        </div>
        <div className="flex questions-center gap-2 items-end">
          <Text type="lightText" className="text-lg">
            Difficulty:
          </Text>
          <Text type="boldText">{selectedQuestion.difficultyLevel}</Text>
        </div>
        <div className="flex questions-center gap-2 items-end">
          <Text type="lightText" className="text-lg">
            Question Type:
          </Text>
          <Text type="boldText">{selectedQuestion.questionType}</Text>
        </div>
        <div className="flex questions-center gap-2 items-end">
          <Text type="lightText" className="text-lg">
            Total Marks:
          </Text>
          <Text type="boldText">{selectedQuestion.marks}</Text>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground pt-4">
          <Text type="boldText">{selectedQuestion.questionText}</Text>
        </div>
        {isLoading === false && questionDetails?.id ? (
          <div className="flex flex-col gap-2">
            <div className="flex questions-center gap-2 ">
              {(questionDetails.questionImages || []).map((image) => (
                <Image
                  key={image.id}
                  src={image.imageUrl}
                  alt=""
                  width={300}
                  height={200}
                />
              ))}
            </div>
            <div className="flex flex-col questions-center gap-4 pt-4">
              {(questionDetails.questionOptions || []).length > 0 ? (
                <Text type="lightText" className="text-base">
                  These are options:
                </Text>
              ) : null}

              {(questionDetails.questionOptions || []).map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox id={option.id} checked={option.isCorrect} />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.optionText}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuestionView;
