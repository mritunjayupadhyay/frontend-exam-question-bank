'use client';
import { ICreateQuestionRequest, IQuestion, IQuestionFilter, IQuestionFullDetails } from 'question-bank-interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedFetch } from './use-authenticated-fetch';
import { createQuestion, deleteQuestion, fetchQuestion, fetchQuestions } from '@/api-handler/questions.api';

export function useQuestions(filter: IQuestionFilter) {
  const authenticatedFetch = useAuthenticatedFetch(); // ✅ Clean and reusable
  
  return useQuery<{data: IQuestion[], error: boolean}, Error>({
    queryKey: ['questions', filter],
    queryFn: () => fetchQuestions(filter, authenticatedFetch),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!(filter.classId && filter.subjectId),
  });
}

export function useQuestion(id?: string) {
    const authenticatedFetch = useAuthenticatedFetch(); // ✅ Clean and reusable

    return useQuery<IQuestionFullDetails, Error>({
        queryKey: ['question', id],
        queryFn: () => fetchQuestion(id!, authenticatedFetch),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        enabled: !!id // Only run the query when id exists
    });
}

export function useCreateQuestion() {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<{data: IQuestion, error: boolean}, Error, ICreateQuestionRequest>({
    mutationFn: (payload) => createQuestion(payload, authenticatedFetch),
    onSuccess: (response, variables) => {
      // Invalidate and refetch questions list
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      console.log('Question created successfully:', response.data, variables);
      // Optionally, you can also update the cache directly
     
    },
    onError: (error) => {
      console.error('Failed to create question:', error);
      // Handle error (show toast, etc.)
    },
  });
}

export function useDeleteQuestion() {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<{data: IQuestion, error: boolean}, Error, string>({
    mutationFn: (id) => deleteQuestion(id, authenticatedFetch),
    onSuccess: (response, id) => {
      // Invalidate and refetch questions list
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      console.log('Question deleted successfully:', id, response.data);
    },
    onError: (error) => {
      console.error('Failed to delete question:', error);
      // Handle error (show toast, etc.)
    },
  });
}