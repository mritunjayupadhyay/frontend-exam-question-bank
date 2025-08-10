import { IName } from "question-bank-interface";
import { useAuthenticatedFetch } from "./use-authenticated-fetch";
import { useQuery } from "@tanstack/react-query";
import { fetchExamTypes } from "@/api-handler/exam-papers.api";

export function useExamTypes() {
  const authenticatedFetch = useAuthenticatedFetch();
  
  return useQuery<{data: IName[], error: boolean}, Error>({
    queryKey: ['exam-types'],
    queryFn: () => fetchExamTypes(authenticatedFetch),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}