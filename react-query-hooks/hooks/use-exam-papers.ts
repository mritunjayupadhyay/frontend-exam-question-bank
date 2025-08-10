import { IExamPaperWithType, IQuestionFilter } from "question-bank-interface";
import { useAuthenticatedFetch } from "./use-authenticated-fetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExamPaperById, fetchExamPapers, createExamPaper, ICreateExamPaperRequest } from "@/api-handler/exam-papers.api";

export function useExamPapers(filter: IQuestionFilter) {
  const authenticatedFetch = useAuthenticatedFetch(); // ✅ Clean and reusable
  
  return useQuery<{data: IExamPaperWithType[], error: boolean}, Error>({
    queryKey: ['exam-papers', filter],
    queryFn: () => fetchExamPapers(filter, authenticatedFetch),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!(filter.classId && filter.subjectId),
  }); 
}

export function useExamPaperById(id: string) {
  const authenticatedFetch = useAuthenticatedFetch(); // ✅ Clean and reusable
  
  return useQuery<IExamPaperWithType, Error>({
    queryKey: ['exam-paper', id],
    queryFn: () => fetchExamPaperById(id, authenticatedFetch),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}

export function useCreateExamPaper() {
  const authenticatedFetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  
  return useMutation<IExamPaperWithType, Error, ICreateExamPaperRequest>({
    mutationFn: (data: ICreateExamPaperRequest) => createExamPaper(data, authenticatedFetch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-papers'] });
    },
  });
}