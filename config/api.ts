// config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/local';
export const ENDPOINTS = {
  QUESTIONS: {
    FULL_INFO: (id: string) => `${API_BASE_URL}/qs/questions/${id}/full`,
    LIST: `${API_BASE_URL}/qs/questions/filter`,
    CREATE: `${API_BASE_URL}/qs/questions`,
    UPDATE: (id: string) => `${API_BASE_URL}/qs/questions/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/qs/questions/${id}`,
    // Add other endpoints here
  },
  EXAM_PAPERS: {
    LIST: `${API_BASE_URL}/ex-p/exam-papers/filter`,
    FULL_INFO: (id: string) => `${API_BASE_URL}/ex-p/exam-papers/${id}/full`,
    SHORT_DETAILS: (id: string) => `${API_BASE_URL}/ex-p/exam-papers/${id}/short-details`,
    CREATE: `${API_BASE_URL}/ex-p/exam-papers`,
    UPDATE: (id: string) => `${API_BASE_URL}/ex-p/exam-papers/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/ex-p/exam-papers/${id}`,
  },
  EXAM_PAPER_SECTIONS: {
    LIST: (examPaperId: string) => `${API_BASE_URL}/ex-p/exam-papers/${examPaperId}/sections`,
    CREATE: (examPaperId: string) => `${API_BASE_URL}/ex-p/exam-papers/${examPaperId}/sections`,
    GET_BY_ID: (sectionId: string) => `${API_BASE_URL}/ex-p/exam-papers/sections/${sectionId}`,
    GET_WITH_QUESTIONS: (sectionId: string) => `${API_BASE_URL}/ex-p/exam-papers/sections/${sectionId}/with-questions`,
    UPDATE: (sectionId: string) => `${API_BASE_URL}/ex-p/exam-papers/sections/${sectionId}`,
    DELETE: (sectionId: string) => `${API_BASE_URL}/ex-p/exam-papers/sections/${sectionId}`,
  },
  EXAM_PAPER_QUESTIONS: {
    LIST_IN_SECTION: (sectionId: string) => `${API_BASE_URL}/ex-p/exam-papers/sections/${sectionId}/questions`,
    ADD_TO_SECTION: (sectionId: string) => `${API_BASE_URL}/ex-p/exam-papers/sections/${sectionId}/questions`,
    ADD_MULTIPLE_TO_SECTION: (sectionId: string) => `${API_BASE_URL}/ex-p/exam-papers/sections/${sectionId}/questions/bulk`,
    REMOVE_FROM_SECTION: (sectionId: string, questionId: string) => `${API_BASE_URL}/ex-p/exam-papers/sections/${sectionId}/questions/${questionId}`,
    REMOVE_BY_ID: (examPaperQuestionId: string) => `${API_BASE_URL}/ex-p/exam-papers/exam-paper-questions/${examPaperQuestionId}`,
    UPDATE_IN_SECTION: (examPaperQuestionId: string) => `${API_BASE_URL}/ex-p/exam-papers/exam-paper-questions/${examPaperQuestionId}`,
  },
  SUBJECTS: {
    LIST: `${API_BASE_URL}/qs/subjects`,
  },
  TOPICS: {
    LIST: (id: string) => `${API_BASE_URL}/qs/topics/subject/${id}`,
  },
  CLASSES: {
    LIST: `${API_BASE_URL}/qs/classes`,
  },
  EXAM_TYPES: {
    LIST: `${API_BASE_URL}/ex-p/exam-types`,
  }
};