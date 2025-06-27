import { ENDPOINTS } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { IName } from "question-bank-interface";
import { useAuthenticatedFetch } from "./use-authenticated-fetch";
import { createAuthenticatedFetch } from "../authenticated-api-handler";

const fetchSubjects = async (authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>): Promise<{data: IName[], error: boolean}> => {
    const url = ENDPOINTS.SUBJECTS.LIST;
    return authenticatedFetch(url);
};

export function useSubjects() {
  const authenticatedFetch = useAuthenticatedFetch(); // ✅ Same pattern
  
  return useQuery<{data: IName[], error: boolean}, Error>({
    queryKey: ['subjects'],
    queryFn: () => fetchSubjects(authenticatedFetch),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}