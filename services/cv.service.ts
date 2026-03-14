import apiClient from "@/lib/api-client";
import type {
  ListCVResponse,
  UploadCVResponse,
  DeleteCVResponse,
} from "@/types/api";

/**
 * GET /api/v1/list-cv
 * Fetch all CVs stored in MongoDB Atlas.
 */
export async function listCVs(userId: string): Promise<ListCVResponse> {
  const { data } = await apiClient.get<ListCVResponse>(`/api/v1/list-cv?user_id=${userId}`);
  return data;
}

/**
 * POST /api/v1/upload-cv
 * Upload one or many CV files (PDF / Docx).
 * @param files - Array of File objects from the browser.
 * @param userId - Unique user identifier.
 * @param onProgress - Optional callback to track upload progress (0–100).
 */
export async function uploadCVs(
  files: File[],
  userId: string,
  onProgress?: (percent: number) => void
): Promise<UploadCVResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("user_id", userId);

  const { data } = await apiClient.post<UploadCVResponse>(
    "/api/v1/upload-cv",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event: any) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    } as any
  );
  return data;
}

/**
 * DELETE /api/v1/delete-cv/{filename}
 * Remove a CV from the database by its filename.
 * @param filename - The exact filename stored in MongoDB (e.g. "John_Doe.pdf").
 * @param userId - Unique user identifier.
 */
export async function deleteCV(filename: string, userId: string): Promise<DeleteCVResponse> {
  const { data } = await apiClient.delete<DeleteCVResponse>(
    `/api/v1/delete-cv/${encodeURIComponent(filename)}?user_id=${userId}`
  );
  return data;
}
