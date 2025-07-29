'use client';
import { useExamPaperById } from '@/react-query-hooks/hooks/use-exam-papers';
import { useParams } from 'next/navigation';
import React from 'react';

const ExamPaperDetailsPage = () => {
  // Get parameters from the URL if needed
const params = useParams<{ id: string }>()
  console.log(params);

      const {
        data: examPapersRes,
        isLoading,
      } = useExamPaperById(params.id);
  if (isLoading) return <div>Loading...</div>;
  console.log('Exam Paper Details:', examPapersRes);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ExamPaperDetailsPage</h1>
    </div>
  );
};

export default ExamPaperDetailsPage;