export const createAuthenticatedFetch = (getToken: () => Promise<string | null>) => {
  return async (url: string, options: RequestInit = {}) => {
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication token not available');
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error', { 
        url, 
        status: response.status, 
        errorData 
      });
      throw new Error(`API Error: ${response.status} - ${errorData?.message || 'Unknown error'}`);
    }
    
    return response.json();
  };
};