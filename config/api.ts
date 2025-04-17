// config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/local';
export const ENDPOINTS = {
  QUESTIONS: {
    FULL_INFO: (id: string) => `${API_BASE_URL}/qs/questions/${id}/full`,
    LIST: `${API_BASE_URL}/qs/questions/filter`,
    // Add other endpoints here
  }
};