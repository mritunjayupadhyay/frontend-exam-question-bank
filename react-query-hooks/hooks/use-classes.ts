import { ENDPOINTS } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { IName } from "question-bank-interface";
import { useAuthenticatedFetch } from "./use-authenticated-fetch";
import { createAuthenticatedFetch } from "../authenticated-api-handler";

const fetchClasses = async (authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>): Promise<{data: IName[], error: boolean}> => {
    const url = ENDPOINTS.CLASSES.LIST;
    return authenticatedFetch(url);
};

export function useClasses() {
  const authenticatedFetch = useAuthenticatedFetch(); // ✅ Same pattern
  
  return useQuery<{data: IName[], error: boolean}, Error>({
    queryKey: ['classes'],
    queryFn: () => fetchClasses(authenticatedFetch),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}