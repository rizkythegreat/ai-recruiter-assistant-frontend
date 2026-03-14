import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  timeout: 120000, // 2 minutes — LlamaParse can be slow
  headers: {
    Accept: "application/json",
  },
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
    const message =
      error?.response?.data?.detail ??
      error?.response?.data?.message ??
      error?.message ??
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
