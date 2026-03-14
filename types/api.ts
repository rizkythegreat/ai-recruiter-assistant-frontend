// ─────────────────────────────────────────────
// GET /api/v1/list-cv
// ─────────────────────────────────────────────
export interface CVFile {
  file_name: string;
  upload_date?: string;       // ISO date string, if returned by backend
  status?: "Indexed" | "Indexing...";
}

export interface ListCVResponse {
  files: CVFile[];
  total: number;
}

export interface Candidate {
  metadata?: {
    summary: any,
    top_skills: any,
    years_of_experience: any,
    location: any
  },
  upload_date?: any,
  status?: any,
  file_name: any
}

// ─────────────────────────────────────────────
// POST /api/v1/upload-cv
// ─────────────────────────────────────────────
export interface UploadCVResponse {
  message: string;
  uploaded_files: string[];
  failed_files?: string[];
}

// ─────────────────────────────────────────────
// DELETE /api/v1/delete-cv/{filename}
// ─────────────────────────────────────────────
export interface DeleteCVResponse {
  message: string;
  filename: string;
}

// ─────────────────────────────────────────────
// POST /api/v1/rank-candidates
// ─────────────────────────────────────────────
export interface RankedCandidateMetadata {
  years_of_experience: number;
  top_skills: string[];
  location: string;
}

export interface RankedCandidateAnalysis {
  reason: string;
  suitability_tag: string;    // e.g. "High Match", "Medium Match", "Low Match"
}

export interface RankedCandidate {
  candidate: string;          // CV filename
  score: number;              // 0 – 100
  metadata: RankedCandidateMetadata;
  analysis: RankedCandidateAnalysis;
  rank: number;
}

export interface RankCandidatesResponse {
  ranking: RankedCandidate[];
}

// ─────────────────────────────────────────────
// GET /api/v1/get-history
// ─────────────────────────────────────────────
export interface RankingHistoryItem {
  _id: string;
  job_title: string;
  job_description: string;
  results: RankedCandidate[];
  created_at: string;
}

export interface GetHistoryResponse {
  history: RankingHistoryItem[];
}

// ─────────────────────────────────────────────
// POST /api/v1/analyze
// ─────────────────────────────────────────────
export interface AnalyzeResponse {
  summary: string;
  match_score: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}
