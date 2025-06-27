import { useAuth } from '@clerk/nextjs';
import { createAuthenticatedFetch } from '../authenticated-api-handler';

export const useAuthenticatedFetch = () => {
  const { getToken } = useAuth();
  return createAuthenticatedFetch(getToken);
};