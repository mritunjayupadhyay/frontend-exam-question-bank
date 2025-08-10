 
'use client';
import ExamPaperCard from '@/components/exam-papers/exam-papers-card';
import GetClassSubject from '@/components/questions/get-claas-subject';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExamPapers } from '@/react-query-hooks/hooks/use-exam-papers';
import { classSubjectState } from '@/rtk/slices/classSubject.slice';
import { IQuestionFilter } from 'question-bank-interface';
import React from 'react';
import { useSelector } from 'react-redux';

const ExamPaperPage = () => {

    const { className, subject } = useSelector(classSubjectState);
    const filter:IQuestionFilter = {
        classId: className?.id,
        subjectId: subject?.id,
      };


    const {
      data: examPapersRes,
      isLoading,
    } = useExamPapers(filter);

    if (isLoading) return <div>Loading...</div>;

    console.log('Exam Papers:', examPapersRes);
    if (!(className?.id && subject?.id)) {
      return <GetClassSubject />
    }

  return (
    <div
      className="flex flex-col items-start gap-4 p-4 flex-1 self-stretch rounded-xl bg-surfaceContainerLow"
      style={{ background: "var(--Schemes-Surface-Container-Low, #FBF8FD)" }}
    >
      <div className="flex flex-col w-full items-start gap-4 flex-1 self-stretch">
        <ScrollArea className="w-full" style={{ height: "calc(100svh - 260px)" }}>
      <div className="flex flex-col gap-2 pt-0">
        {(examPapersRes?.data || []).map((item) => (
          <ExamPaperCard key={item.id} examPaper={item} />
        ))}
      </div>
    </ScrollArea>
      </div>
    </div>
  );
};

export default ExamPaperPage;