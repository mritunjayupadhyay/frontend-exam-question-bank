/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
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
import { classSubjectState } from "@/rtk/slices/classSubject.slice";
import QuestionView from "@/components/questions/question-view";
import GetClassSubject from "@/components/questions/get-claas-subject";

const QuestionsPage = () => {
  const [showQuestion, setShowQuestion] = useState(false);
  // Redux store
  const { selectedQuestion } = useSelector(questionsState);
  const { classId, subjectId } = useSelector(classSubjectState);

  useEffect(() => {
    if (classId && subjectId) {
      setShowQuestion(true);
    }
  }, [classId, subjectId]);

  // React Query
  const {
    data: questionsRes,
    isLoading,
    error,
    refetch,
    status,
  } = useQuestions();

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
          {showQuestion ? <div className="flex flex-col w-full items-start gap-4 flex-1 self-stretch">
            <Text type="section-header">Question List</Text>
            <QuestionFilter />
            <QuestionList questions={questionsRes?.data || []} />
          </div> : <GetClassSubject />}
        </ResizablePanel>
        {selectedQuestion?.id ? <ResizableHandle /> : null}
        {selectedQuestion?.id ? (
          <ResizablePanel>
            <QuestionView />
          </ResizablePanel>
        ) : null}
      </ResizablePanelGroup>
    </div>
  );
};

export default QuestionsPage;
