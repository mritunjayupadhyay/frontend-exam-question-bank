import { ENDPOINTS } from "@/config/api";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { IName } from "question-bank-interface";

const fetchTopics = async (id: string, getToken: () => Promise<string | null>): Promise<{data: IName[], error: boolean}> => {
    try {
       const token = await getToken();
      const url = ENDPOINTS.TOPICS.LIST(id);
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('Failed to fetch questions', { status: res.status, errorData });
        throw new Error(`Failed to fetch questions: ${res.status}`);
      }
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
};

export function useTopics(id?: string) {
   const { getToken } = useAuth(); // Add this
    return useQuery<{data: IName[], error: boolean}, Error>({
        queryKey: ['subject', id],
        queryFn: () => fetchTopics(id!, getToken),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        enabled: !!id // Only run the query when id exists
    });
}