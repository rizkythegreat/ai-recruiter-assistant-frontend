"use client";

import { listCVs } from "@/services/cv.service";
import { getRankingHistory } from "@/services/ranking.service";
import { CVFile, ListCVResponse, RankingHistoryItem } from "@/types/api";
import { createContext, useEffect, useState, ReactNode } from "react";

type AppsContextType = {
  candidates: CVFile[];
  history: RankingHistoryItem[];
  data: ListCVResponse | null;
  isLoading: boolean;
  error: string | null;
  userId: string;
  setHistory: React.Dispatch<React.SetStateAction<RankingHistoryItem[]>>;
  setCandidates: React.Dispatch<React.SetStateAction<CVFile[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AppsContext = createContext<AppsContextType | null>(null);

function AppsProvider({ children }: { children: ReactNode }) {
  const [candidates, setCandidates] = useState<CVFile[]>([]);
  const [history, setHistory] = useState<RankingHistoryItem[]>([]);
  const [data, setData] = useState<ListCVResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Generate or retrieve a persistent user_id for this session/browser
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Generate simple UUID-like ID if not exists in localStorage
    let currentId = localStorage.getItem("recruiter_user_id");
    if (!currentId) {
      currentId = `user_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem("recruiter_user_id", currentId);
    }
    setUserId(currentId);
  }, []);

  const fetchCandidates = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listCVs(id);
      setData(data);
      setCandidates(data.files);
    } catch (err: any) {
      setError(err.message ?? "Failed to load candidates");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRankingHistory(id);
      const sortedHistory = [...data.history].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setHistory(sortedHistory);
    } catch (err: any) {
      setError(err.message ?? "Failed to load ranking history.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchCandidates(userId);
      fetchHistory(userId);
    }
  }, [userId]);

  return (
    <AppsContext.Provider
      value={{
        data,
        candidates,
        isLoading,
        error,
        history,
        userId,
        setHistory,
        setCandidates,
        setIsLoading,
        setError,
      }}
    >
      {children}
    </AppsContext.Provider>
  );
}

export default AppsProvider;
