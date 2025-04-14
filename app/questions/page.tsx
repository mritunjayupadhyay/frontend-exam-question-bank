'use client';
import React from 'react';
import QuestionFilter from '../../components/questions/question-filter';
import QuestionList from '../../components/questions/question-list';
import { useQuestions } from '@/react-query-hooks/hooks/use-questions';

const QuestionsPage = () => {
  const { data: questionsRes, isLoading, error } = useQuestions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading questions</div>;

  if (questionsRes?.error) {
    return <div>Error: {questionsRes.error}</div>;
  }

  return (
    <div className="flex flex-col items-start gap-4 p-4 flex-1 self-stretch rounded-xl bg-surfaceContainerLow"
    style={{ background: "var(--Schemes-Surface-Container-Low, #FBF8FD)" }}

    >
      <h1 className="text-2xl font-bold mb-4">Questions</h1>
      <QuestionFilter />
      <QuestionList questions={questionsRes.data}  />
    </div>
  );
};

export default QuestionsPage;