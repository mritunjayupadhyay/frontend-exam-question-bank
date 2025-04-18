'use client';
import { IQuestion, IQuestionFilter, IQuestionFullDetails } from 'question-bank-interface';
import { useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '@/config/api';
import { getQueryParams } from '@/utils/getQueryParams.util';

// Simulated API function
const fetchQuestions = async (filter: IQuestionFilter): Promise<{data: IQuestion[], error: boolean}> => {
    try {
      const url = ENDPOINTS.QUESTIONS.LIST;
      const queryParams = getQueryParams(filter);
      const res = await fetch(queryParams ? `${url}?${queryParams}` : url);
      
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

export function useQuestions(filter: IQuestionFilter) {
    return useQuery<{data: IQuestion[], error: boolean}, Error>({
        queryKey: ['questions', filter],
        queryFn: () => fetchQuestions(filter),
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