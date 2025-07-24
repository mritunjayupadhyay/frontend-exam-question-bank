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
import { IQuestionFilter } from "question-bank-interface";
import { questionsFilterState } from "@/rtk/slices/question.filter.slice";

const QuestionsPage = () => {
  const [showQuestion, setShowQuestion] = useState(false);
  // Redux store
  const { selectedQuestion } = useSelector(questionsState);
  const { className, subject } = useSelector(classSubjectState);
  const questionFilter = useSelector(questionsFilterState);
  const filter:IQuestionFilter = {
    ...questionFilter,
    classId: className?.id,
    subjectId: subject?.id,
  };
  

  useEffect(() => {
    if (className?.id && subject?.id) {
      setShowQuestion(true);
    }
  }, [className, subject]);

  // React Query
  const {
    data: questionsRes,
    isLoading,
    error,
    refetch,
    status,
  } = useQuestions(filter);

  const [open, setOpen] = useState(false);

  // if (isLoading) return <div>Loading...</div>;
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
            <Text type="section-header">Questions of {subject?.name} for Class {className?.name} </Text>
            <QuestionFilter />
            {isLoading ? <div>Loading...</div> : <QuestionList questions={questionsRes?.data || []} />}
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
