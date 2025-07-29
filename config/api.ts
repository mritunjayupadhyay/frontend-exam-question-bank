// config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/local';
export const ENDPOINTS = {
  QUESTIONS: {
    FULL_INFO: (id: string) => `${API_BASE_URL}/qs/questions/${id}/full`,
    LIST: `${API_BASE_URL}/qs/questions/filter`,
    CREATE: `${API_BASE_URL}/qs/questions`,
    DELETE: (id: string) => `${API_BASE_URL}/qs/questions/${id}`,
    // Add other endpoints here
  },
  EXAM_PAPERS: {
    LIST: `${API_BASE_URL}/ex-p/exam-papers/filter`,
    FULL_INFO: (id: string) => `${API_BASE_URL}/ex-p/exam-papers/${id}/full`,
    CREATE: `${API_BASE_URL}/ex-p/exam-papers`,
    DELETE: (id: string) => `${API_BASE_URL}/ex-p/exam-papers/${id}`,
  },
  SUBJECTS: {
    LIST: `${API_BASE_URL}/qs/subjects`,
  },
  TOPICS: {
    LIST: (id: string) => `${API_BASE_URL}/qs/topics/subject/${id}`,
  },
  CLASSES: {
    LIST: `${API_BASE_URL}/qs/classes`,
  }
};