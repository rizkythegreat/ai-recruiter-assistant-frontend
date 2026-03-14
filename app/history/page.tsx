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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setSelectedSession(null)} />
          <div className="relative bg-base-100 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-base-300 flex flex-col">
            <div className="p-4 md:p-6 border-b border-base-300 flex items-center justify-between bg-base-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-base-100 rounded-xl flex items-center justify-center border border-base-300 shadow-sm text-primary">
                  <History className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-base-content">{selectedSession.job_title}</h2>
                  <p className="text-xs text-base-content/50 font-medium">{formatFullDate(selectedSession.created_at)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSession(null)} className="btn btn-ghost btn-circle btn-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Job Description</h3>
                <div className="bg-base-200 p-4 rounded-xl border border-base-300 text-sm italic text-base-content/70">
                  {selectedSession.job_description}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Ranked Candidates</h3>
                  <span className="badge badge-neutral">{selectedSession.results.length} results</span>
                </div>
                
                <div className="grid gap-3">
                  {selectedSession.results.map((candidate) => (
                    <div 
                      key={candidate.candidate}
                      onClick={() => setSelectedCandidate(candidate)}
                      className="bg-base-100 border border-base-300 rounded-2xl p-4 hover:border-primary transition cursor-pointer flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 shrink-0">
                        <CircularProgressbar
                          value={candidate.score}
                          text={`${candidate.score}`}
                          styles={buildStyles({
                            pathColor: candidate.score >= 80 ? 'oklch(var(--su))' : candidate.score >= 60 ? 'oklch(var(--wa))' : 'oklch(var(--er))',
                            textColor: 'oklch(var(--bc))',
                            textSize: '32px',
                            trailColor: 'oklch(var(--b3))',
                          })}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-base-content/40">#{candidate.rank}</span>
                          <h4 className="font-bold text-base-content truncate group-hover:text-primary transition-colors">{candidate.candidate}</h4>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-base-content/50 uppercase font-bold tracking-wider">
                          <span className={
                            candidate.analysis.suitability_tag === 'Highly Recommended' ? 'text-success' :
                            candidate.analysis.suitability_tag === 'Medium Match' ? 'text-warning' :
                            'text-error'
                          }>{candidate.analysis.suitability_tag}</span>
                          <span>•</span>
                          <span>{candidate.metadata.years_of_experience} yrs exp</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-base-content/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
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
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setSelectedCandidate(null)} />
          <div className="relative bg-base-100 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-base-300 flex flex-col">
            <div className="p-4 md:p-6 border-b border-base-300 flex items-center justify-between bg-base-200">
              <div className="flex items-center gap-6">
                <div className="w-14 md:w-12 h-10 md:h-12 bg-base-100 rounded-xl flex items-center justify-center border border-base-300 shadow-sm text-primary">
                  <User className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-base-content">{selectedCandidate.candidate}</h2>
                  <p className="text-sm md:text-lg text-base-content/50 font-medium">Candidate Profile Analysis</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="btn btn-ghost btn-circle">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 flex flex-col gap-6">
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">AI Comparison Analysis</h3>
                    <p className="text-base-content/80 leading-relaxed bg-base-200 p-4 rounded-xl border border-base-300">
                      {selectedCandidate.analysis.reason}
                    </p>
                  </section>

                  <section className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                    <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                      <CheckSquare className="w-5 h-5" />
                      Top Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.metadata.top_skills.map(skill => (
                        <span key={skill} className="badge badge-primary badge-outline font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-base-200 rounded-xl p-4 border border-base-300">
                      <p className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1">Experience</p>
                      <p className="text-2xl font-bold text-base-content">{selectedCandidate.metadata.years_of_experience} <span className="text-base font-normal">years</span></p>
                    </div>
                    <div className="bg-base-200 rounded-xl p-4 border border-base-300">
                      <p className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1">Location</p>
                      <p className="text-sm font-semibold text-base-content">{selectedCandidate.metadata.location}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="bg-linear-to-br from-primary via-secondary to-accent text-neutral-content rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
                    {/* subtle glow */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <p className="text-neutral-content/80 text-xs font-semibold uppercase mb-4 tracking-widest">
                      Matching Score
                    </p>
                    <div className="w-32 h-32 mx-auto mb-4">
                      <CircularProgressbar
                        value={selectedCandidate.score}
                        text={`${selectedCandidate.score}%`}
                        styles={buildStyles({
                          pathColor: "white",
                          textColor: "white",
                          trailColor: "rgba(255,255,255,0.2)",
                          textSize: "24px",
                        })}
                      />
                    </div>
                    <p
                      className={`text-xs font-semibold px-3 py-2 rounded-full text-white inline-block backdrop-blur-sm ${
                        selectedCandidate.analysis.suitability_tag === "Highly Recommended"
                          ? "bg-success/90"
                          : selectedCandidate.analysis.suitability_tag === "Medium Match"
                          ? "bg-warning/90"
                          : "bg-error/90"
                      }`}
                    >
                      {selectedCandidate.analysis.suitability_tag}
                    </p>
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
