import { ENDPOINTS } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { ILabelValue } from "question-bank-interface";

const fetchSubjects = async (): Promise<{data: ILabelValue[], error: boolean}> => {
    try {
      const url = ENDPOINTS.QUESTIONS.LIST;
      const res = await fetch(url);
      
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
    return useQuery<{data: ILabelValue[], error: boolean}, Error>({
        queryKey: ['questions'],
        queryFn: fetchSubjects,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
}