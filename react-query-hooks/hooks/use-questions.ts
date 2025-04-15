'use client';
import { IQuestion } from 'question-bank-interface';
import { useQuery } from '@tanstack/react-query';

// Simulated API function
const fetchQuestions = async (): Promise<{data: IQuestion[], error: boolean}> => {
    try {
      const res = await fetch('http://localhost:8000/local/ex-p/questions/filter');
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('Failed to fetch questions', { status: res.status, errorData });
        throw new Error(`Failed to fetch questions: ${res.status}`);
      }
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  };

export function useQuestions() {
    return useQuery<{data: IQuestion[], error: boolean}, Error>({
        queryKey: ['questions'],
        queryFn: fetchQuestions,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
}