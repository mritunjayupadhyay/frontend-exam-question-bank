'use client';
import React from 'react';
import QuestionForm from '../_components/questionForm';


const QuestionsCreatePage = () => {

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Question Create</h1>
      <QuestionForm />
    </div>
  );
};

export default QuestionsCreatePage;