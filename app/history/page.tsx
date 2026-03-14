"use client";

import { History, Calendar, User, CheckSquare, AlertCircle, Eye, ChevronRight, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import type { RankingHistoryItem, RankedCandidate } from "@/types/api";
import { formatFullDate } from "@/utils/dateFormat";
import { useApps } from "../hooks/useApps";

export default function RankingHistoryPage() {
  const { history, isLoading, error, setError, userId, fetchHistory } = useApps();
  const [selectedSession, setSelectedSession] = useState<RankingHistoryItem | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);

  useEffect(() => {
    if (userId) {
      fetchHistory(userId);
    }
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ranking History</h1>
        <p className="text-slate-500 mt-2">View previous AI ranking results and job descriptions.</p>
      </div>

      {error && (
        <div role="alert" className="alert alert-error">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-base-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
          <History className="w-12 h-12 text-base-content/20 mx-auto mb-4" />
          <h2 className="text-lg font-bold">No history available</h2>
          <p className="text-base-content/60 mt-2">Your ranking history will appear here once you perform a search.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((session) => (
            <div 
              key={session._id}
              className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden hover:shadow-md transition group"
            >
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
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Results
                  </button>
                </div>
              </div>
            </div>
          ))}
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
          
          <div className="relative bg-base-100 w-full max-w-5xl 
            /* Responsive Height: Mengisi hampir seluruh layar di mobile */
            h-[95dvh] sm:h-auto sm:max-h-[90vh] 
            rounded-t-[2.5rem] sm:rounded-3xl 
            overflow-hidden shadow-2xl border-t sm:border border-base-300 
            flex flex-col transform transition-all"
          >
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
                className="btn btn-ghost btn-circle btn-sm bg-base-200 sm:bg-transparent shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 flex flex-col gap-6 md:gap-8 custom-scrollbar">
              
              {/* Job Description Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-base-content/70">Job Description</h3>
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
              <section className="pb-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-base-content/70">Ranked Candidates</h3>
                  </div>
                  <span className="badge badge-neutral badge-sm font-bold">{selectedSession.results.length} Profiles</span>
                </div>
                
                <div className="grid gap-4 sm:gap-3">
                  {selectedSession.results.map((candidate) => (
                    <div 
                      key={candidate.candidate}
                      onClick={() => setSelectedCandidate(candidate)}
                      className="bg-base-100 border border-base-300 rounded-2xl p-4 hover:border-primary hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group active:scale-[0.98]"
                    >
                      {/* Score Chart */}
                      <div className="w-12 h-12 md:w-14 md:h-14 shrink-0">
                        <CircularProgressbar
                          value={candidate.score}
                          text={`${candidate.score}`}
                          styles={buildStyles({
                            pathColor: candidate.score >= 80 ? '#22c55e' : candidate.score >= 60 ? '#eab308' : '#ef4444',
                            textColor: 'oklch(var(--bc))',
                            textSize: '32px',
                            trailColor: 'oklch(var(--b3))',
                            strokeLinecap: 'round'
                          })}
                        />
                      </div>

                      {/* Info Container */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded">#{candidate.rank}</span>
                          <h4 className="font-bold text-sm md:text-base text-base-content truncate group-hover:text-primary transition-colors">
                            {candidate.candidate}
                          </h4>
                        </div>
                        
                        {/* Tags Wrap for Mobile */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <span className={`text-[10px] font-black uppercase tracking-tighter ${
                            candidate.analysis.suitability_tag === 'Highly Recommended' ? 'text-success' :
                            candidate.analysis.suitability_tag === 'Medium Match' ? 'text-warning' :
                            'text-error'
                          }`}>
                            {candidate.analysis.suitability_tag}
                          </span>
                          <span className="text-[10px] text-base-content/30 hidden sm:inline">•</span>
                          <div className="flex items-center gap-1 text-[10px] text-base-content/50 font-bold uppercase tracking-wider">
                            <span>{candidate.metadata.years_of_experience} YRS EXP</span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow - Hidden on very small screens to save space */}
                      <div className="bg-base-200 p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                        <ChevronRight className="w-4 h-4 text-base-content/30 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Detail Candidate Modal (Reuse from ranking page logic) */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-70 flex items-end sm:items-center justify-center">
          {/* Backdrop dengan overscroll-none untuk mencegah scroll bocor ke background */}
          <div 
            className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm" 
            onClick={() => setSelectedCandidate(null)} 
          />
          
          <div className="relative bg-base-100 w-full max-w-4xl 
            /* Solusi Tinggi Mobile: Gunakan dvh agar tidak terpotong address bar */
            h-[92dvh] sm:h-auto sm:max-h-[90vh] 
            rounded-t-4xl sm:rounded-3xl 
            overflow-hidden shadow-2xl border border-base-300 flex flex-col
            transition-all duration-300 ease-out transform translate-y-0"
          >
            {/* Handle Bar untuk Mobile (Visual cue bahwa ini bisa di-scroll/tutup) */}
            <div className="w-12 h-1.5 bg-base-300 rounded-full mx-auto my-3 sm:hidden" />

            {/* Header: Dibuat Sticky agar navigasi tutup selalu terlihat */}
            <div className="sticky top-0 z-10 px-6 py-4 sm:p-8 border-b border-base-300 flex items-center justify-between bg-base-100/80 backdrop-blur-md">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-base-content leading-tight truncate max-w-45 sm:max-w-none">
                    {selectedCandidate.candidate}
                  </h2>
                  <p className="text-[10px] sm:text-sm text-base-content/60 font-medium uppercase tracking-wider">Candidate Analysis</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="btn btn-ghost btn-circle btn-sm bg-base-200 sm:bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 pb-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Main Info */}
                <div className="md:col-span-2 flex flex-col gap-6 order-2 md:order-1">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">AI Matching Reason</h3>
                    <p className="text-sm sm:text-base text-base-content/90 leading-relaxed bg-base-200/50 p-4 rounded-2xl border border-base-300">
                      {selectedCandidate.analysis.reason}
                    </p>
                  </section>

                  <section className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                    <div className="flex items-center gap-2 mb-4 text-primary font-bold text-sm">
                      <CheckSquare className="w-4 h-4" />
                      Key Competencies
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.metadata.top_skills.map(skill => (
                        <span key={skill} className="badge badge-white border-base-300 shadow-sm py-3 px-4 font-medium text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-base-200/50 rounded-2xl p-4 border border-base-300">
                      <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Experience</p>
                      <p className="text-lg sm:text-xl font-bold">{selectedCandidate.metadata.years_of_experience} Yrs</p>
                    </div>
                    <div className="bg-base-200/50 rounded-2xl p-4 border border-base-300">
                      <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Location</p>
                      <p className="text-sm sm:text-base font-bold truncate">{selectedCandidate.metadata.location}</p>
                    </div>
                  </div>
                </div>

                {/* Sidebar / Score: Di mobile muncul di atas (order-1) agar info utama langsung terlihat */}
                <div className="flex flex-col gap-4 order-1 md:order-2">
                  <div className="bg-linear-to-br from-primary to-primary-focus text-primary-content rounded-4xl p-6 text-center shadow-xl shadow-primary/20">
                    <p className="text-[10px] font-bold uppercase mb-4 opacity-80 tracking-widest">Matching Score</p>
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                      <CircularProgressbar
                        value={selectedCandidate.score}
                        text={`${selectedCandidate.score}%`}
                        styles={buildStyles({
                          pathColor: "white",
                          textColor: "white",
                          trailColor: "rgba(255,255,255,0.2)",
                          textSize: "26px",
                        })}
                      />
                    </div>
                    <div className={`text-[10px] font-bold px-4 py-1.5 rounded-full inline-block bg-white/20 backdrop-blur-md border border-white/30`}>
                      {selectedCandidate.analysis.suitability_tag}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
