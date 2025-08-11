import { ENDPOINTS } from "@/config/api";
import { createAuthenticatedFetch } from "@/react-query-hooks/authenticated-api-handler";
import { getQueryParams } from "@/utils/getQueryParams.util";
import { IExamPaperWithType, IQuestionFilter, IName, IQuestionFullDetails } from "question-bank-interface";

export interface ICreateExamPaperRequest {
  title: string;
  durationMinutes: number;
  examTypeId: string;
  classId: string;
  subjectId: string;
  totalMarks: number;
}

export interface IExamPaperSection {
  id: string;
  examPaperId: string;
  sectionNumber: number;
  title: string;
  instructions?: string;
  marksPerQuestion: number;
  questionsToAnswer: number;
  totalQuestions: number;
  sectionMarks: number;
  createdAt: string;
}

export interface ICreateExamPaperSectionRequest {
  sectionNumber: number;
  title: string;
  instructions?: string;
  marksPerQuestion: number;
  questionsToAnswer: number;
  totalQuestions: number;
}

export interface IExamPaperQuestion {
  id: string;
  sectionId: string;
  questionId: string;
  questionNumber: number;
  isOptional: boolean;
  createdAt: string;
  question?: IQuestionFullDetails;
}

export interface IExamPaperSectionWithQuestions extends IExamPaperSection {
  questions: IExamPaperQuestion[];
}

export interface IAddQuestionToSectionRequest {
  questionId: string;
  questionNumber: number;
  isOptional?: boolean;
}

export interface IAddMultipleQuestionsToSectionRequest {
  questions: IAddQuestionToSectionRequest[];
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

// Exam Paper Sections API handlers
export const fetchExamPaperSections = async (
  examPaperId: string,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{data: IExamPaperSection[], error: boolean}> => {
  const url = ENDPOINTS.EXAM_PAPER_SECTIONS.LIST(examPaperId);
  return authenticatedFetch(url);
}

export const createExamPaperSection = async (
  examPaperId: string,
  data: ICreateExamPaperSectionRequest,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<IExamPaperSection> => {
  const url = ENDPOINTS.EXAM_PAPER_SECTIONS.CREATE(examPaperId);
  return authenticatedFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export const fetchExamPaperSectionById = async (
  sectionId: string,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<IExamPaperSection> => {
  const url = ENDPOINTS.EXAM_PAPER_SECTIONS.GET_BY_ID(sectionId);
  return authenticatedFetch(url);
}

export const fetchExamPaperSectionWithQuestions = async (
  sectionId: string,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<IExamPaperSectionWithQuestions> => {
  const url = ENDPOINTS.EXAM_PAPER_SECTIONS.GET_WITH_QUESTIONS(sectionId);
  return authenticatedFetch(url);
}

export const updateExamPaperSection = async (
  sectionId: string,
  data: Partial<ICreateExamPaperSectionRequest>,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<IExamPaperSection> => {
  const url = ENDPOINTS.EXAM_PAPER_SECTIONS.UPDATE(sectionId);
  return authenticatedFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export const deleteExamPaperSection = async (
  sectionId: string,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{success: boolean}> => {
  const url = ENDPOINTS.EXAM_PAPER_SECTIONS.DELETE(sectionId);
  return authenticatedFetch(url, {
    method: 'DELETE',
  });
}

// Exam Paper Questions API handlers
export const fetchExamPaperQuestionsInSection = async (
  sectionId: string,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{data: IExamPaperQuestion[], error: boolean}> => {
  const url = ENDPOINTS.EXAM_PAPER_QUESTIONS.LIST_IN_SECTION(sectionId);
  return authenticatedFetch(url);
}

export const addQuestionToSection = async (
  sectionId: string,
  data: IAddQuestionToSectionRequest,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<IExamPaperQuestion> => {
  const url = ENDPOINTS.EXAM_PAPER_QUESTIONS.ADD_TO_SECTION(sectionId);
  return authenticatedFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export const addMultipleQuestionsToSection = async (
  sectionId: string,
  data: IAddMultipleQuestionsToSectionRequest,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{data: IExamPaperQuestion[], error: boolean}> => {
  const url = ENDPOINTS.EXAM_PAPER_QUESTIONS.ADD_MULTIPLE_TO_SECTION(sectionId);
  return authenticatedFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export const removeQuestionFromSection = async (
  sectionId: string,
  questionId: string,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{success: boolean}> => {
  const url = ENDPOINTS.EXAM_PAPER_QUESTIONS.REMOVE_FROM_SECTION(sectionId, questionId);
  return authenticatedFetch(url, {
    method: 'DELETE',
  });
}

export const removeExamPaperQuestionById = async (
  examPaperQuestionId: string,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<{success: boolean}> => {
  const url = ENDPOINTS.EXAM_PAPER_QUESTIONS.REMOVE_BY_ID(examPaperQuestionId);
  return authenticatedFetch(url, {
    method: 'DELETE',
  });
}

export const updateExamPaperQuestion = async (
  examPaperQuestionId: string,
  data: Partial<IAddQuestionToSectionRequest>,
  authenticatedFetch: ReturnType<typeof createAuthenticatedFetch>
): Promise<IExamPaperQuestion> => {
  const url = ENDPOINTS.EXAM_PAPER_QUESTIONS.UPDATE_IN_SECTION(examPaperQuestionId);
  return authenticatedFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}