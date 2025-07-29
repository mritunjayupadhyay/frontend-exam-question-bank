import { IExamPaperWithType, IQuestionFilter } from "question-bank-interface";
import { useAuthenticatedFetch } from "./use-authenticated-fetch";
import { useQuery } from "@tanstack/react-query";
import { fetchExamPaperById, fetchExamPapers } from "@/api-handler/exam-papers.api";

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