'use client';
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ExamPaperPage Page</h1>
    </div>
  );
};

export default ExamPaperPage;