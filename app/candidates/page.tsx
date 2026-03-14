"use client";

import { Eye, Trash2, Search, Filter, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteCV } from "@/services/cv.service";
import { formatFullDate } from "@/utils/dateFormat";
import { useApps } from "../hooks/useApps";

export default function CandidatesPage() {
  const { candidates, setCandidates, isLoading, error, setError, userId, fetchCandidates } = useApps();
  const [count, setCount] = useState(0);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (userId) {
      fetchCandidates(userId);
    }
  }, [count])

  const handleClickSearch = () => {
    setCount(count + 1 );
  };

  

  const deleteCandidate = async (file_name: string) => {
    setDeletingFile(file_name);
    try {
      await deleteCV(file_name, userId);
      setCandidates(prev => prev.filter(c => c.file_name !== file_name));
    } catch (err: any) {
      setError(err.message ?? "Failed to delete candidate.");
    } finally {
      setDeletingFile(null);
    }
  };

  const filtered = candidates.filter(c =>
    c.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-base-content leading-tight">Candidate Management</h1>
          <p className="text-base-content/60 mt-2">Manage all CVs stored in the recruitment database.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="input focus:outline-none input-sm pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-outline btn-sm gap-2" onClick={handleClickSearch}>
            <Filter className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="alert alert-error">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="bg-base-100 border border-base-300 rounded-xl overflow-x-auto shadow-sm">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Candidate Name / File</th>
              <th className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Upload Date</th>
              <th className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Status</th>
              <th className="text-xs font-semibold text-base-content/60 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} className="px-6 py-4">
                    <div className="h-5 bg-base-200 animate-pulse rounded w-full" />
                  </td>
                </tr>
              ))
            ) : (
              filtered.map((c) => (
                <tr key={c.file_name} className="hover:bg-base-200/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-medium text-base-content">{c.file_name}</span>
                  </td>
                  <td className="px-6 py-4 text-base-content/60">
                    {formatFullDate(c.upload_date)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge badge-sm font-medium ${
                      (c.status ?? "Indexed") === "Indexed"
                        ? "badge-success text-success-content"
                        : "badge-info animate-pulse"
                    }`}>
                      {c.status ?? "Indexed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="btn btn-ghost btn-xs text-base-content/40 hover:text-primary" title="View Analysis">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCandidate(c.file_name)}
                        disabled={deletingFile === c.file_name}
                        className="btn btn-ghost btn-xs text-base-content/40 hover:text-error"
                        title="Delete"
                      >
                        {deletingFile === c.file_name
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-base-content/40">
            <p className="text-sm">No candidates found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
