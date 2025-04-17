/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import QuestionFilter from "../../components/questions/question-filter";
import QuestionList from "../../components/questions/question-list";
import Text from "../../components/common/text";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useQuestions } from "@/react-query-hooks/hooks/use-questions";
import { useSelector } from "react-redux";
import { questionsState } from "@/rtk/slices/question.slice";
import QuestionView from "@/components/questions/question-view";

const QuestionsPage = () => {
  const { selectedQuestion } = useSelector(questionsState);

  const { data: questionsRes, isLoading, error, refetch, status } = useQuestions();

  const [open, setOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading questions</div>;

  const handleClick = () => {
    console.log("Clicked");
    refetch();
    // setOpen(!open);
  };

  return (
    <div
    onClick={() => handleClick()}
      className="flex flex-col items-start gap-4 p-4 flex-1 self-stretch rounded-xl bg-surfaceContainerLow"
      style={{ background: "var(--Schemes-Surface-Container-Low, #FBF8FD)" }}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="flex flex-col w-full items-start gap-4 flex-1 self-stretch">
          <Text type="section-header">Question List</Text>
          <QuestionFilter />
          <QuestionList questions={questionsRes?.data || []} />
          </div>
        </ResizablePanel>
        {selectedQuestion?.id ? <ResizableHandle /> : null}
        {selectedQuestion?.id ? <ResizablePanel>
          <QuestionView />
        </ResizablePanel> : null}
      </ResizablePanelGroup>
    </div>
  );
};

export default QuestionsPage;
