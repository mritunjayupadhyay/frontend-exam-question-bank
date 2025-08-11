import { useAuthenticatedFetch } from "./use-authenticated-fetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchExamPaperQuestionsInSection,
  addQuestionToSection,
  addMultipleQuestionsToSection,
  removeQuestionFromSection,
  removeExamPaperQuestionById,
  updateExamPaperQuestion,
  IExamPaperQuestion,
  IAddQuestionToSectionRequest,
  IAddMultipleQuestionsToSectionRequest
} from "@/api-handler/exam-papers.api";

export function useExamPaperQuestionsInSection(sectionId: string) {
  const authenticatedFetch = useAuthenticatedFetch();
  
  return useQuery<{data: IExamPaperQuestion[], error: boolean}, Error>({
    queryKey: ['exam-paper-questions', sectionId],
    queryFn: () => fetchExamPaperQuestionsInSection(sectionId, authenticatedFetch),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: !!sectionId,
  });
}

export function useAddQuestionToSection(sectionId: string) {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<IExamPaperQuestion, Error, IAddQuestionToSectionRequest>({
    mutationFn: (data: IAddQuestionToSectionRequest) => 
      addQuestionToSection(sectionId, data, authenticatedFetch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-paper-questions', sectionId] });
      queryClient.invalidateQueries({ queryKey: ['exam-paper-section-with-questions', sectionId] });
    },
  });
}

export function useAddMultipleQuestionsToSection(sectionId: string) {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<{data: IExamPaperQuestion[], error: boolean}, Error, IAddMultipleQuestionsToSectionRequest>({
    mutationFn: (data: IAddMultipleQuestionsToSectionRequest) => 
      addMultipleQuestionsToSection(sectionId, data, authenticatedFetch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-paper-questions', sectionId] });
      queryClient.invalidateQueries({ queryKey: ['exam-paper-section-with-questions', sectionId] });
    },
  });
}

export function useRemoveQuestionFromSection(sectionId: string) {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<{success: boolean}, Error, string>({
    mutationFn: (questionId: string) => 
      removeQuestionFromSection(sectionId, questionId, authenticatedFetch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-paper-questions', sectionId] });
      queryClient.invalidateQueries({ queryKey: ['exam-paper-section-with-questions', sectionId] });
    },
  });
}

export function useRemoveExamPaperQuestionById() {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<{success: boolean}, Error, { examPaperQuestionId: string; sectionId: string }>({
    mutationFn: ({ examPaperQuestionId }) => 
      removeExamPaperQuestionById(examPaperQuestionId, authenticatedFetch),
    onSuccess: (_, { sectionId }) => {
      queryClient.invalidateQueries({ queryKey: ['exam-paper-questions', sectionId] });
      queryClient.invalidateQueries({ queryKey: ['exam-paper-section-with-questions', sectionId] });
    },
  });
}

export function useUpdateExamPaperQuestion() {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<IExamPaperQuestion, Error, { examPaperQuestionId: string; data: Partial<IAddQuestionToSectionRequest>; sectionId: string }>({
    mutationFn: ({ examPaperQuestionId, data }) => 
      updateExamPaperQuestion(examPaperQuestionId, data, authenticatedFetch),
    onSuccess: (_, { sectionId }) => {
      queryClient.invalidateQueries({ queryKey: ['exam-paper-questions', sectionId] });
      queryClient.invalidateQueries({ queryKey: ['exam-paper-section-with-questions', sectionId] });
    },
  });
}