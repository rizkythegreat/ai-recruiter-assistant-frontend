"use client";

import { Search, BrainCircuit, X, CheckSquare, User, AlertCircle } from "lucide-react";
import { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { rankCandidates } from "@/services/ranking.service";
import type { RankedCandidate } from "@/types/api";
import { useApps } from "../hooks/useApps";

export default function RankingPage() {
  const { userId } = useApps();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isRanking, setIsRanking] = useState(false);
  const [results, setResults] = useState<RankedCandidate[] | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);
  const [rankError, setRankError] = useState<string | null>(null);

  const startRanking = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) return;
    setIsRanking(true);
    setResults(null);
    setRankError(null);

    try {
      const data = await rankCandidates(jobTitle, jobDescription, userId);
      setResults(data.ranking);
    } catch (err: any) {
      setRankError(err.message ?? "Ranking failed. Please try again.");
    } finally {
      setIsRanking(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><span className="text-primary"><BrainCircuit /></span>AI Candidate Ranking</h1>
        <p className="text-slate-600 mt-2">Paste a Job Description (JD) and let AI find the best candidates from your database.</p>
      </div>

      <div className="bg-base-100 border border-base-300 p-4 sm:p-6 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Job Title</span>
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Backend Developer"
              className="input w-full focus:outline-none"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text font-semibold">Job Description</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full Job Description here... "
              className="textarea focus:outline-none rounded-lg text-sm textarea-bordered w-full h-40 sm:h-48 resize-none text-base-content leading-relaxed"
            />
          </div>
        </div>
        <div className="flex justify-center sm:justify-end mt-4">
          <button
            onClick={startRanking}
            disabled={isRanking || !jobDescription.trim() || !jobTitle.trim()}
            className="btn btn-primary w-full sm:w-auto px-8"
          >
            {isRanking ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Analyzing CVs...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Start Ranking
              </>
            )}
          </button>
        </div>
      </div>

      {rankError && (
        <div role="alert" className="alert alert-error">
          <AlertCircle className="w-5 h-5" />
          <span>{rankError}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => setRankError(null)}>Dismiss</button>
        </div>
      )}

      {isRanking && (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-base-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {results && !isRanking && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-base-content">Ranked Results</h2>
            <p className="text-sm text-base-content/70">Sorted by AI matching score</p>
          </div>
          
          <div className="grid gap-4">
            {results.map((candidate) => (
              <div
                key={candidate.candidate}
                onClick={() => setSelectedCandidate(candidate)}
                className="bg-base-100 border border-base-300 rounded-2xl p-0 md:p-6 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-center group border-l-4 border-l-transparent hover:border-l-primary"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                  <CircularProgressbar
                    value={candidate.score}
                    text={`${candidate.score}%`}
                    styles={buildStyles({
                      pathColor: candidate.score >= 80 ? 'oklch(var(--su))' : candidate.score >= 60 ? 'oklch(var(--wa))' : 'oklch(var(--er))',
                      textColor: 'oklch(var(--bc))',
                      textSize: '24px',
                      trailColor: 'oklch(var(--b3))',
                    })}
                  />
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                    <div className="flex gap-2">
                      <span className="badge badge-neutral badge-sm uppercase font-bold tracking-tighter">
                        Rank #{candidate.rank}
                      </span>
                      <span className={`badge badge-sm font-semibold ${
                        candidate.analysis.suitability_tag === 'Highly Recommended' ? 'badge-success' :
                        candidate.analysis.suitability_tag === 'Medium Match' ? 'badge-warning' :
                        'badge-error'
                      }`}>{candidate.analysis.suitability_tag}</span>
                    </div>
                    <h3 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors truncate w-full sm:w-auto">{candidate.candidate}</h3>
                  </div>
                  <p className="text-base-content/75 text-sm line-clamp-2 leading-relaxed">
                    {candidate.analysis.reason}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-base-content/60 font-medium">
                    <span>{candidate.metadata.years_of_experience} yrs exp</span>
                    <span>{candidate.metadata.location}</span>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto">
                  <button className="btn btn-ghost btn-sm w-full sm:w-auto text-base-content/75 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    View Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Detail Modal Implementation */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setSelectedCandidate(null)} />
          <div className="relative bg-base-100 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-base-300 flex flex-col">
            <div className="p-4 sm:p-8 border-b border-base-300 flex items-center justify-between bg-base-200">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-base-100 rounded-xl flex items-center justify-center border border-base-300 shadow-sm text-primary">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-base-content leading-tight">{selectedCandidate.candidate}</h2>
                  <p className="text-xs sm:text-sm text-base-content/70 font-medium">Candidate Profile Analysis</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="btn btn-ghost btn-circle btn-sm sm:btn-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="md:col-span-2 flex flex-col gap-6">
                  <section>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary mb-3">AI Comparison Analysis</h3>
                    <p className="text-sm sm:text-base text-base-content/90 leading-relaxed bg-base-200 p-4 rounded-xl border border-base-300">
                      {selectedCandidate.analysis.reason}
                    </p>
                  </section>

                  <section className="bg-primary/5 p-4 sm:p-6 rounded-2xl border border-primary/20">
                    <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                      <CheckSquare className="w-5 h-5" />
                      Top Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.metadata.top_skills.map(skill => (
                        <span key={skill} className="badge badge-primary badge-outline font-semibold badge-sm sm:badge-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-base-200 rounded-xl p-3 sm:p-4 border border-base-300">
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1">Experience</p>
                      <p className="text-xl sm:text-2xl font-bold text-base-content">{selectedCandidate.metadata.years_of_experience} <span className="text-xs sm:text-base font-normal">years</span></p>
                    </div>
                    <div className="bg-base-200 rounded-xl p-3 sm:p-4 border border-base-300">
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1">Location</p>
                      <p className="text-xs sm:text-sm font-semibold text-base-content truncate">{selectedCandidate.metadata.location}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:gap-6">
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
                  
                  <div className="flex flex-col gap-2 sm:gap-4">
                    <button className="btn btn-primary w-full h-12 sm:h-14 text-base sm:text-lg font-bold shadow-lg shadow-primary/20">
                      Contact Candidate
                    </button>
                    <button className="btn btn-outline w-full h-12 sm:h-14 text-base sm:text-lg font-bold">
                      Download PDF Result
                    </button>
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
