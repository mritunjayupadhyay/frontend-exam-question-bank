'use client';
import { IQuestion, IQuestionFullDetails } from 'question-bank-interface';
import { useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '@/config/api';

// Simulated API function
const fetchQuestions = async (): Promise<{data: IQuestion[], error: boolean}> => {
    try {
      const url = ENDPOINTS.QUESTIONS.LIST;
      const res = await fetch(url);
      
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

const fetchQuestion = async (id: string): Promise<IQuestionFullDetails> => {
  try {
    const url = ENDPOINTS.QUESTIONS.FULL_INFO(id);
    const res = await fetch(url);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('Failed to fetch questions', { status: res.status, errorData });
        throw new Error(`Failed to fetch questions: ${res.status}`);
      }
      
      const data = await res.json();
      if (!data) {
        throw new Error('No data found');
      }
      if (data.error && data.data) {
        throw new Error(data.error);  
      }
      return data.data;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
}

export function useQuestions() {
    return useQuery<{data: IQuestion[], error: boolean}, Error>({
        queryKey: ['questions'],
        queryFn: fetchQuestions,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
}

export function useQuestion(id?: string) {
    return useQuery<IQuestionFullDetails, Error>({
        queryKey: ['question', id],
        queryFn: () => fetchQuestion(id!),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        enabled: !!id // Only run the query when id exists
    });
}