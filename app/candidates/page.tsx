'use client';

import {
  Eye,
  Trash2,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  CheckSquare
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { deleteCV } from '@/services/cv.service';
import { formatFullDate } from '@/utils/dateFormat';
import { useApps } from '../hooks/useApps';
import type { Candidate } from '@/types/api';
import { ConfirmModal } from '@/components/confirm-modal';

export default function CandidatesPage() {
  const { candidates, setCandidates, isLoading, error, setError, userId, fetchCandidates } =
    useApps();
  const [count, setCount] = useState(0);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (userId) {
      fetchCandidates(userId);
    }
  }, [count]);

  const handleClickSearch = () => {
    setCount(count + 1);
    setCurrentPage(1); // Reset to first page on refresh
  };

  const confirmDelete = (file_name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Candidate',
      message: `Are you sure you want to delete "${file_name}"? This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setDeletingFile(file_name);
        try {
          await deleteCV(file_name, userId);
          setCandidates((prev) => prev.filter((c) => c.file_name !== file_name));
        } catch (err: any) {
          setError(err.message ?? 'Failed to delete candidate.');
        } finally {
          setDeletingFile(null);
        }
      }
    });
  };

  const confirmDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setConfirmModal({
      isOpen: true,
      title: 'Delete Selected Candidates',
      message: `Are you sure you want to delete ${selectedIds.length} selected candidate${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setIsDeletingMultiple(true);
        try {
          await Promise.all(selectedIds.map((id) => deleteCV(id, userId)));
          setCandidates((prev) => prev.filter((c) => !selectedIds.includes(c.file_name)));
          setSelectedIds([]);
          setIsSelectMode(false);
        } catch (err: any) {
          setError(err.message ?? 'Failed to delete selected candidates.');
        } finally {
          setIsDeletingMultiple(false);
        }
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((c) => c.file_name));
    }
  };

  const exitSelectMode = () => {
    setIsSelectMode(false);
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const filtered = useMemo(() => {
    return candidates.filter((c) => c.file_name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [candidates, searchQuery]);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-base-content leading-tight">
            Candidate Management
          </h1>
          <p className="text-base-content/60 mt-2">
            Manage all CVs stored in the recruitment database.
          </p>
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
          {!isSelectMode ? (
            <button className="btn btn-outline btn-sm gap-2" onClick={() => setIsSelectMode(true)}>
              <CheckSquare className="w-4 h-4" />
              Select
            </button>
          ) : (
            <>
              <button
                className="btn btn-ghost btn-sm gap-2 text-base-content/60"
                onClick={exitSelectMode}>
                Cancel
              </button>
              <button
                className="btn btn-error btn-sm gap-2"
                onClick={confirmDeleteSelected}
                disabled={isDeletingMultiple || selectedIds.length === 0}>
                {isDeletingMultiple ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete {selectedIds.length > 0 && `(${selectedIds.length})`}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="alert alert-error">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-base-100 border border-base-300 rounded-xl overflow-x-auto shadow-sm">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              {isSelectMode && (
                <th className="w-10">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              <th className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Candidate Name / File
              </th>
              <th className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Upload Date
              </th>
              <th className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Status
              </th>
              <th className="text-xs font-semibold text-base-content/60 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-5 bg-base-200 animate-pulse rounded w-full" />
                    </td>
                  </tr>
                ))
              : paginatedCandidates.map((c) => (
                  <tr
                    key={c.file_name}
                    className={`hover:bg-base-200/50 transition-colors group ${selectedIds.includes(c.file_name) ? 'bg-primary/5' : ''}`}>
                    {isSelectMode && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-primary"
                          checked={selectedIds.includes(c.file_name)}
                          onChange={() => toggleSelect(c.file_name)}
                        />
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className="font-medium text-base-content">{c.file_name}</span>
                    </td>
                    <td className="px-6 py-4 text-base-content/60">
                      {formatFullDate(c.upload_date)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`badge badge-sm font-medium ${
                          (c.status ?? 'Indexed') === 'Indexed'
                            ? 'badge-success text-success-content'
                            : 'badge-info animate-pulse'
                        }`}>
                        {c.status ?? 'Indexed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCandidate(c)}
                          className="btn btn-ghost btn-xs text-base-content/40 hover:text-primary"
                          title="View Analysis">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(c.file_name)}
                          disabled={deletingFile === c.file_name}
                          className="btn btn-ghost btn-xs text-base-content/40 hover:text-error"
                          title="Delete">
                          {deletingFile === c.file_name ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        {!isLoading && filtered.length > 0 && (
          <div className="p-4 border-t border-base-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-base-content/50">
              Showing {Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
              {Math.min(filtered.length, currentPage * itemsPerPage)} of {filtered.length}{' '}
              candidates
            </span>
            <div className="flex items-center gap-1">
              <button
                className="btn btn-xs btn-ghost"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}>
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>

              <div className="join">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`join-item btn btn-xs ${currentPage === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-xs btn-ghost"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}>
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-base-content/40">
            <p className="text-sm">No candidates found in the database.</p>
          </div>
        )}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm"
            onClick={() => setSelectedCandidate(null)}
          />

          <div
            className="relative bg-base-100 w-full max-w-3xl 
            h-[90dvh] sm:h-auto sm:max-h-[85vh] 
            rounded-t-4xl sm:rounded-3xl 
            overflow-hidden shadow-2xl border border-base-300 flex flex-col">
            <div className="w-12 h-1.5 bg-base-300 rounded-full mx-auto my-3 sm:hidden shrink-0" />

            <div className="sticky top-0 z-10 px-6 py-4 sm:p-6 border-b border-base-300 flex items-center justify-between bg-base-100/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-base-content leading-tight truncate max-w-50 sm:max-w-none">
                    {selectedCandidate.file_name}
                  </h2>
                  <p className="text-[10px] text-base-content/60 font-bold uppercase tracking-widest">
                    Candidate Information
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="btn btn-ghost btn-circle btn-sm bg-base-200 sm:bg-transparent">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300">
                  <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Status</p>
                  <span
                    className={`badge badge-sm font-bold ${
                      (selectedCandidate.status ?? 'Indexed') === 'Indexed'
                        ? 'badge-success'
                        : 'badge-info'
                    }`}>
                    {selectedCandidate.status ?? 'Indexed'}
                  </span>
                </div>
                <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300">
                  <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Upload Date</p>
                  <p className="text-sm font-bold">
                    {formatFullDate(selectedCandidate.upload_date)}
                  </p>
                </div>
              </div>

              {/* Summary Section (If metadata exists) */}
              {selectedCandidate.metadata ? (
                <>
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                      AI Analysis Summary
                    </h3>
                    <div className="bg-base-200/50 p-5 rounded-2xl border border-base-300 italic text-sm leading-relaxed text-base-content/80">
                      {selectedCandidate.metadata.summary ||
                        'No summary available for this candidate.'}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4 text-primary font-bold text-sm">
                      <CheckSquare className="w-4 h-4" />
                      Key Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.metadata.top_skills?.map((skill: string) => (
                        <span
                          key={skill}
                          className="badge badge-outline border-base-300 py-3 px-4 font-medium text-xs">
                          {skill}
                        </span>
                      )) || (
                        <span className="text-xs text-base-content/40">No skills identified.</span>
                      )}
                    </div>
                  </section>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                      <p className="text-[10px] font-bold uppercase text-primary/60 mb-1">
                        Experience
                      </p>
                      <p className="text-lg font-bold">
                        {selectedCandidate.metadata.years_of_experience ?? 0} Years
                      </p>
                    </div>
                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                      <p className="text-[10px] font-bold uppercase text-primary/60 mb-1">
                        Location
                      </p>
                      <p className="text-sm font-bold truncate">
                        {selectedCandidate.metadata.location || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-base-200/50 p-8 rounded-3xl border border-base-300 text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3 text-base-content/20" />
                  <p className="text-sm text-base-content/60">
                    Full AI analysis is not yet available for this candidate. Perform a ranking to
                    generate detailed insights.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeletingMultiple || deletingFile !== null}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
