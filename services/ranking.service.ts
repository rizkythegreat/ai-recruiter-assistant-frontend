import apiClient from "@/lib/api-client";
import type { RankCandidatesResponse, AnalyzeResponse, GetHistoryResponse } from "@/types/api";

/**
 * POST /api/v1/rank-candidates
 * Performs Hybrid Search + RRF + Cross-Encoder Reranking.
 * Returns an ordered list of candidates ranked against the JD.
 * @param jobTitle - The title of the job position.
 * @param jobDescription - The raw job description text.
 * @param userId - Unique user identifier.
 */
export async function rankCandidates(
  jobTitle: string,
  jobDescription: string,
  userId: string
): Promise<RankCandidatesResponse> {
  const formData = new FormData();
  formData.append("job_title", jobTitle);
  formData.append("job_description", jobDescription);
  formData.append("user_id", userId);

  const { data } = await apiClient.post<RankCandidatesResponse>(
    "/api/v1/rank-candidates",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

/**
 * GET /api/v1/get-history
 * Retrieves the history of ranking requests.
 */
export async function getRankingHistory(userId: string): Promise<GetHistoryResponse> {
  const { data } = await apiClient.get<GetHistoryResponse>(`/api/v1/get-history?user_id=${userId}`);
  return data;
}

/**
 * POST /api/v1/analyze
 * Deep-analyzes resumes against the JD.
 * Returns a summary, match score, strengths, weaknesses, and recommendation.
 * @param jobDescription - The raw job description text.
 * @param userId - Unique user identifier.
 */
export async function analyzeCandidates(
  jobDescription: string,
  userId: string
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  formData.append("user_id", userId);

  const { data } = await apiClient.post<AnalyzeResponse>(
    "/api/v1/analyze",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}
