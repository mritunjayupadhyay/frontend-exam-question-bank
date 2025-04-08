'use client';
import React from 'react';
import QuestionFilter from '../../components/questions/question-filter';
import QuestionList from '../../components/questions/question-list';

const QuestionsPage = () => {
  // const { data: questions, isLoading, error } = useQuery('questions', fetchQuestions);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading questions</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Questions</h1>
      <QuestionFilter />
      <QuestionList  />
    </div>
  );
};

export default QuestionsPage;