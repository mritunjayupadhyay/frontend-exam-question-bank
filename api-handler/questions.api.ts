// Simulated API function

import { ENDPOINTS } from "@/config/api";
import { createAuthenticatedFetch } from "@/react-query-hooks/authenticated-api-handler";
import { getQueryParams } from "@/utils/getQueryParams.util";
import { ICreateQuestionRequest, IQuestion, IQuestionFilter, IQuestionFullDetails } from "question-bank-interface";

export const fetchQuestion = async (
    id: string,
    authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<IQuestionFullDetails> => {
  try {
    const url = ENDPOINTS.QUESTIONS.FULL_INFO(id);
    const res = await authenticatedFetch(url);

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('Failed to fetch questions', { status: res.status, errorData });
        throw new Error(`Failed to fetch questions: ${res.status}`);
      }
      
      const data = await res.json();
      if (!data) {
        throw new Error('No data found');
      }
      if (data.error && data.data) {
        throw new Error(data.error);  
      }
      return data.data;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
}

export const fetchQuestions = async (
  filter: IQuestionFilter,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{data: IQuestion[], error: boolean}> => {
  const url = ENDPOINTS.QUESTIONS.LIST;
  const queryParams = getQueryParams(filter);
  return authenticatedFetch(queryParams ? `${url}?${queryParams}` : url);
};

export const createQuestion = async (
  payload: ICreateQuestionRequest,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{data: IQuestion, error: boolean}> => {
  const url = ENDPOINTS.QUESTIONS.CREATE;
  return authenticatedFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};

export const deleteQuestion = async (
  id: string,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{data: IQuestion, error: boolean}> => {
  const url = ENDPOINTS.QUESTIONS.DELETE(id);
  return authenticatedFetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}