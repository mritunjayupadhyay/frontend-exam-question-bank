import { ENDPOINTS } from "@/config/api";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { IName } from "question-bank-interface";

const fetchSubjects = async (getToken: () => Promise<string | null>): Promise<{data: IName[], error: boolean}> => {
    try {
       const token = await getToken();
      const url = ENDPOINTS.SUBJECTS.LIST;
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

export function useSubjects() {
  const { getToken } = useAuth(); // Add this
    return useQuery<{data: IName[], error: boolean}, Error>({
        queryKey: ['subjects'],
        queryFn: () => fetchSubjects(getToken),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
}