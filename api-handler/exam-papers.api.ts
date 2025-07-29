import { ENDPOINTS } from "@/config/api";
import { createAuthenticatedFetch } from "@/react-query-hooks/authenticated-api-handler";
import { getQueryParams } from "@/utils/getQueryParams.util";
import { IExamPaperWithType, IQuestionFilter } from "question-bank-interface";

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