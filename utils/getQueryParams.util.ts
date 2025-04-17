/**
 * Converts an object of filter parameters into URLSearchParams
 * Handles primitive values and arrays properly for API requests
 * 
 * @param filters Object containing filter parameters
 * @param arrayFormat How to format array parameters ('brackets' | 'repeat')
 * @returns URLSearchParams object ready to be used in fetch or axios
 */
export const getQueryParams = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, any>, 
    arrayFormat: 'brackets' | 'repeat' = 'brackets'
  ): URLSearchParams => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      // Skip undefined or null values
      if (value === undefined || value === null) {
        return;
      }
      
      // Handle empty arrays
      if (Array.isArray(value) && value.length === 0) {
        return;
      }
      
      // Handle arrays based on specified format
      if (Array.isArray(value)) {
        if (arrayFormat === 'brackets') {
          // Format: key[]=value1&key[]=value2
          value.forEach(item => {
            if (item !== undefined && item !== null) {
              queryParams.append(`${key}[]`, item.toString());
            }
          });
        } else {
          // Format: key=value1&key=value2
          value.forEach(item => {
            if (item !== undefined && item !== null) {
              queryParams.append(key, item.toString());
            }
          });
        }
      } 
      // Handle objects (convert to JSON string)
      else if (typeof value === 'object') {
        queryParams.append(key, JSON.stringify(value));
      } 
      // Handle boolean values properly
      else if (typeof value === 'boolean') {
        queryParams.append(key, value ? 'true' : 'false');
      }
      // Handle other primitive values
      else {
        queryParams.append(key, value.toString());
      }
    });
    
    return queryParams;
  }