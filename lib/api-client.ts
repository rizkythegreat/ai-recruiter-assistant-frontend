import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  timeout: 120000, // 2 minutes — LlamaParse can be slow
  headers: {
    Accept: 'application/json'
  }
});

// Request interceptor — attach any future auth token here
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — normalise error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error?.response?.data;

    if (errorData) {
      // Jika detail adalah object, keep sebagai object
      if (typeof errorData.detail === 'object' && errorData.detail !== null) {
        return Promise.reject({
          status: error.response.status,
          ...errorData.detail // Spread object detail (duplicates, message, etc)
        });
      }

      // Jika detail adalah string atau tidak ada
      const message =
        errorData.detail ?? errorData.message ?? error.message ?? 'An unexpected error occurred.';

      return Promise.reject(new Error(message));
    }

    return Promise.reject(new Error(error.message ?? 'Network error'));
  }
);

export default apiClient;
