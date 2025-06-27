import { ENDPOINTS } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { IName } from "question-bank-interface";
import { useAuthenticatedFetch } from "./use-authenticated-fetch";
import { createAuthenticatedFetch } from "../authenticated-api-handler";

// const fetchSubjects = async (): Promise<{data: IName[], error: boolean}> => {
//     try {
//       const url = ENDPOINTS.CLASSES.LIST;
//       const res = await fetch(url);
      
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => null);
//         console.error('Failed to fetch questions', { status: res.status, errorData });
//         throw new Error(`Failed to fetch questions: ${res.status}`);
//       }
      
//       const data = await res.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//       throw error;
//     }
// };

// export function useClasses() {
//     return useQuery<{data: IName[], error: boolean}, Error>({
//         queryKey: ['classes'],
//         queryFn: fetchSubjects,
//         staleTime: 1000 * 60 * 5, // 5 minutes
//         refetchOnWindowFocus: false,
//     });
// }

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