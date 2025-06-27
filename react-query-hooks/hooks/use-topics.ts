import { ENDPOINTS } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { IName } from "question-bank-interface";
import { createAuthenticatedFetch } from "../authenticated-api-handler";
import { useAuthenticatedFetch } from "./use-authenticated-fetch";

const fetchTopics = async (id: string, authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>): Promise<{data: IName[], error: boolean}> => {
 const url = ENDPOINTS.TOPICS.LIST(id);    
 return authenticatedFetch(url);
};

export function useTopics(id?: string) {
  const authenticatedFetch = useAuthenticatedFetch(); // ✅ Same pattern
  
  return useQuery<{data: IName[], error: boolean}, Error>({
    queryKey: ['topics', id],
    queryFn: () => fetchTopics(id!, authenticatedFetch),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}