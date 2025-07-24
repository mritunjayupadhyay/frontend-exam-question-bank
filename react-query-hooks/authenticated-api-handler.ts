export const createAuthenticatedFetch = (getToken: () => Promise<string | null>) => {
  return async (url: string, options: RequestInit = {}) => {
    const makeRequest = async (token: string) => {
      return fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    };

    // First attempt with current token
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication token not available');
    }
    
    let response = await makeRequest(token);
    
    // 🔥 KEY FIX: Retry with fresh token on auth errors
    if (response.status === 401 || response.status === 403) {
      console.warn('Auth failed, retrying with fresh token...', {
        url,
        status: response.status,
        originalToken: token.substring(0, 20) + '...'
      });
      
      // Get fresh token and retry once
      const freshToken = await getToken();
      if (!freshToken) {
        throw new Error('Failed to refresh authentication token');
      }
      
      if (freshToken !== token) {
        console.info('Got new token, retrying request');
        response = await makeRequest(freshToken);
      }
    }
    
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