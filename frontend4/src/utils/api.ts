const API_URL = 'http://localhost:5000/api';

export const fetchWithCredentials = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unknown error occurred',
    }));
    throw new Error(error.message || 'An unknown error occurred');
  }

  return response.json();
};

export const authApi = {
  signup: (userData: { name: string; email: string; password: string }) => {
    return fetchWithCredentials('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: (credentials: { email: string; password: string }) => {
    return fetchWithCredentials('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  checkAuthStatus: () => {
    return fetchWithCredentials('/auth/me');
  },
  
  logout: () => {
    return fetchWithCredentials('/auth/logout', {
      method: 'POST',
    });
  },
};