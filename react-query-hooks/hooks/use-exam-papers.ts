import { IExamPaper, IQuestionFilter } from "question-bank-interface";
import { useAuthenticatedFetch } from "./use-authenticated-fetch";
import { useQuery } from "@tanstack/react-query";
import { fetchExamPapers } from "@/api-handler/exam-papers.api";

export function useExamPapers(filter: IQuestionFilter) {
  const authenticatedFetch = useAuthenticatedFetch(); // ✅ Clean and reusable
  
  return useQuery<{data: IExamPaper[], error: boolean}, Error>({
    queryKey: ['exam-papers', filter],
    queryFn: () => fetchExamPapers(filter, authenticatedFetch),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    // enabled: !!(filter.classId && filter.subjectId),
  }); 
}