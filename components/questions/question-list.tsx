/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ScrollArea } from "../ui/scroll-area";
import { IQuestion } from "question-bank-interface";
import QuestionCard from "./question-card";

const QuestionList = ({ questions }: { questions: IQuestion[] }) => {
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {questions.map((item) => (
          <QuestionCard key={item.id} question={item} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default QuestionList;
