import { ENDPOINTS } from "@/config/api";
import { createAuthenticatedFetch } from "@/react-query-hooks/authenticated-api-handler";
import { getQueryParams } from "@/utils/getQueryParams.util";
import { IExamPaperWithType, IQuestionFilter, IName } from "question-bank-interface";

export interface ICreateExamPaperRequest {
  title: string;
  durationMinutes: number;
  examTypeId: string;
  classId: string;
  subjectId: string;
  totalMarks: number;
}

export const fetchExamPapers = async (
  filter: IQuestionFilter,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{data: IExamPaperWithType[], error: boolean}> => {
  const url = ENDPOINTS.EXAM_PAPERS.LIST;
  const queryParams = getQueryParams(filter);
  return authenticatedFetch(queryParams ? `${url}?${queryParams}` : url);
};

export const fetchExamPaperById = async (
  id: string,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<IExamPaperWithType> => {
  const url = ENDPOINTS.EXAM_PAPERS.FULL_INFO(id);
  return authenticatedFetch(url);
}

export const createExamPaper = async (
  data: ICreateExamPaperRequest,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<IExamPaperWithType> => {
  const url = ENDPOINTS.EXAM_PAPERS.CREATE;
  return authenticatedFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export const fetchExamTypes = async (
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{data: IName[], error: boolean}> => {
  const url = ENDPOINTS.EXAM_TYPES.LIST;
  return authenticatedFetch(url);
}