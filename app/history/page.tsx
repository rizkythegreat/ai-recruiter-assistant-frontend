'use client';

import { History, Eye, Briefcase, ChevronRight, Calendar, User, X } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import type { RankingHistoryItem, RankedCandidate } from '@/types/api';
import { formatFullDate } from '@/utils/dateFormat';
import { useApps } from '../hooks/useApps';
import CandidateDetailModal from '@/components/candidate-detail-modal';
import ErrorAlert from '@/components/error-alert';
import Pagination from '@/components/pagination';
import CandidateSection from './components/candidate-section';

export default function RankingHistoryPage() {
  const { history, isLoading, error, setError, userId, fetchHistory } = useApps();
  const [selectedSession, setSelectedSession] = useState<RankingHistoryItem | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (userId) {
      fetchHistory(userId);
    }
  }, []);

  // Calculate paginated history
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return history.slice(startIndex, startIndex + itemsPerPage);
  }, [history, currentPage]);

  const totalPages = Math.ceil(history.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ranking History</h1>
        <p className="text-slate-500 mt-2">
          View previous AI ranking results and job descriptions.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-base-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
          <History className="w-12 h-12 text-base-content/20 mx-auto mb-4" />
          <h2 className="text-lg font-bold">No history available</h2>
          <p className="text-base-content/60 mt-2">
            Your ranking history will appear here once you perform a search.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-4">
            {paginatedHistory.map((session) => (
              <div
                key={session._id}
                className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden hover:shadow-md transition group">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-base-content">{session.job_title}</h2>
                      <div className="flex items-center gap-4 mt-1 text-xs text-base-content/50 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatFullDate(session.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {session.results.length} Candidates
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="btn btn-primary btn-sm gap-2">
                      <Eye className="w-4 h-4" />
                      View Results
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={history.length}
            className="mt-6"
          />
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-neutral-900/70 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedSession(null)}
          />

          <div
            className="relative bg-base-100 w-full max-w-5xl 
            /* Responsive Height: Mengisi hampir seluruh layar di mobile */
            h-[95dvh] sm:h-auto sm:max-h-[90vh] 
            rounded-t-[2.5rem] sm:rounded-3xl 
            overflow-hidden shadow-2xl border-t sm:border border-base-300 
            flex flex-col transform transition-all">
            {/* Mobile Handle Bar */}
            <div className="w-12 h-1.5 bg-base-300/60 rounded-full mx-auto my-3 sm:hidden shrink-0" />

            {/* Sticky Header */}
            <div className="sticky top-0 z-20 px-6 py-4 md:p-6 border-b border-base-300 flex items-center justify-between bg-base-100/90 backdrop-blur-sm">
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl shrink-0 flex items-center justify-center border border-primary/20 text-primary">
                  <History className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-base md:text-2xl font-bold text-base-content truncate leading-tight">
                    {selectedSession.job_title}
                  </h2>
                  <p className="text-[10px] md:text-xs text-base-content/50 font-bold uppercase tracking-wider mt-0.5">
                    {formatFullDate(selectedSession.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="btn btn-ghost btn-circle btn-sm bg-base-200 sm:bg-transparent shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 flex flex-col gap-6 md:gap-8 custom-scrollbar">
              {/* Job Description Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-base-content/70">
                    Job Description
                  </h3>
                </div>
                <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300 text-sm italic leading-relaxed text-base-content/80 relative overflow-hidden">
                  {/* Decorative quote icon */}
                  <div className="absolute -right-2 -bottom-2 opacity-5 scale-150 pointer-events-none">
                    <History className="w-20 h-20" />
                  </div>
                  {selectedSession.job_description}
                </div>
              </section>

              {/* Candidates Section */}
              <CandidateSection
                selectedSession={selectedSession}
                setSelectedCandidate={setSelectedCandidate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
