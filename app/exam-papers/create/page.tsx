'use client';
import React from 'react';
import ExamPaperForm from '@/components/exam-papers/exam-paper-form';

const ExamPaperCreatePage = () => {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create Exam Paper</h1>
        <p className="text-muted-foreground">
          Create a new exam paper with title, duration, and type configuration.
        </p>
      </div>
      <ExamPaperForm />
    </div>
  );
};

export default ExamPaperCreatePage;