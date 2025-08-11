import { useAuthenticatedFetch } from "./use-authenticated-fetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchExamPaperSections,
  createExamPaperSection,
  fetchExamPaperSectionById,
  fetchExamPaperSectionWithQuestions,
  updateExamPaperSection,
  deleteExamPaperSection,
  IExamPaperSection,
  ICreateExamPaperSectionRequest,
  IExamPaperSectionWithQuestions
} from "@/api-handler/exam-papers.api";

export function useExamPaperSections(examPaperId: string) {
  const authenticatedFetch = useAuthenticatedFetch();
  
  return useQuery<{data: IExamPaperSection[], error: boolean}, Error>({
    queryKey: ['exam-paper-sections', examPaperId],
    queryFn: () => fetchExamPaperSections(examPaperId, authenticatedFetch),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!examPaperId,
  });
}

export function useExamPaperSectionById(sectionId: string) {
  const authenticatedFetch = useAuthenticatedFetch();
  
  return useQuery<IExamPaperSection, Error>({
    queryKey: ['exam-paper-section', sectionId],
    queryFn: () => fetchExamPaperSectionById(sectionId, authenticatedFetch),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!sectionId,
  });
}

export function useExamPaperSectionWithQuestions(sectionId: string) {
  const authenticatedFetch = useAuthenticatedFetch();
  
  return useQuery<IExamPaperSectionWithQuestions, Error>({
    queryKey: ['exam-paper-section-with-questions', sectionId],
    queryFn: () => fetchExamPaperSectionWithQuestions(sectionId, authenticatedFetch),
    staleTime: 1000 * 60 * 2, // 2 minutes for dynamic content
    refetchOnWindowFocus: false,
    enabled: !!sectionId,
  });
}

export function useCreateExamPaperSection(examPaperId: string) {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<IExamPaperSection, Error, ICreateExamPaperSectionRequest>({
    mutationFn: (data: ICreateExamPaperSectionRequest) => 
      createExamPaperSection(examPaperId, data, authenticatedFetch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-paper-sections', examPaperId] });
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] });
    },
  });
}

export function useUpdateExamPaperSection() {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<IExamPaperSection, Error, { sectionId: string; data: Partial<ICreateExamPaperSectionRequest> }>({
    mutationFn: ({ sectionId, data }) => 
      updateExamPaperSection(sectionId, data, authenticatedFetch),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam-paper-sections', data.examPaperId] });
      queryClient.invalidateQueries({ queryKey: ['exam-paper-section', data.id] });
      queryClient.invalidateQueries({ queryKey: ['exam-paper-section-with-questions', data.id] });
    },
  });
}

export function useDeleteExamPaperSection() {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<{success: boolean}, Error, { sectionId: string; examPaperId: string }>({
    mutationFn: ({ sectionId }) => deleteExamPaperSection(sectionId, authenticatedFetch),
    onSuccess: (_, { examPaperId }) => {
      queryClient.invalidateQueries({ queryKey: ['exam-paper-sections', examPaperId] });
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] });
    },
  });
}