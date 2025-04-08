import React from 'react';

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    difficulty: 'low' | 'medium' | 'hard';
    type: 'multiple-choice' | 'true-false';
    subject: string;
    topic: string;
    classes: string[];
  };
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold">{question.text}</h3>
      <p className="text-sm text-gray-600">Difficulty: {question.difficulty}</p>
      <p className="text-sm text-gray-600">Type: {question.type}</p>
      <p className="text-sm text-gray-600">Subject: {question.subject}</p>
      <p className="text-sm text-gray-600">Topic: {question.topic}</p>
      <p className="text-sm text-gray-600">Classes: {question.classes.join(', ')}</p>
    </div>
  );
};

export default QuestionCard;