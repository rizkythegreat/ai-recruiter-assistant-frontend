'use client';

import { Search, BrainCircuit, ChevronRight, UploadCloud, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { rankCandidates } from '@/services/ranking.service';
import type { RankedCandidate } from '@/types/api';
import { useApps } from '../hooks/useApps';
import CandidateDetailModal from '@/components/candidate-detail-modal';
import ErrorAlert from '@/components/error-alert';
import { JOB_PRESETS } from '@/utils/jobPreset';

export default function RankingPage() {
  const { userId, candidates, isLoading: isCandidatesLoading } = useApps();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
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
      setRankError(err.message ?? 'Ranking failed. Please try again.');
    } finally {
      setIsRanking(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-primary">
            <BrainCircuit />
          </span>
          AI Candidate Ranking
        </h1>
        <p className="text-slate-600 mt-2">
          Paste a Job Description (JD) and let AI find the best candidates from your database.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
          <Sparkles className="w-3.5 h-3.5" />
          Quick Presets
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
          {JOB_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setJobTitle(preset.title);
                setJobDescription(preset.description);
              }}
              className="flex bg-base-100 cursor-pointer items-center gap-2 px-4 py-2.5 border border-base-300 rounded-xl text-sm font-medium text-base-content hover:border-primary hover:bg-primary/5 hover:text-primary transition-all shrink-0 snap-start group">
              <span className="text-base">{preset.icon}</span>
              <span>{preset.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-base-content/30 group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Empty Candidates Warning */}
      {!isCandidatesLoading && candidates.length === 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="w-10 h-10 shrink-0 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-900 text-sm">No candidates in database</p>
            <p className="text-amber-700 text-xs mt-0.5">
              You need to upload candidate CVs first before running a ranking. Go to Upload Center
              to get started.
            </p>
          </div>
          <Link
            href="/upload"
            className="btn btn-sm bg-amber-500 hover:bg-amber-600 border-none text-white shrink-0 gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload CVs
          </Link>
        </div>
      )}

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
            disabled={
              isRanking || !jobDescription.trim() || !jobTitle.trim() || candidates.length === 0
            }
            className="btn btn-primary w-full sm:w-auto px-8">
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

      {rankError && <ErrorAlert message={rankError} onDismiss={() => setRankError(null)} />}

      {isRanking && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
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

          <div className="flex flex-col gap-4">
            {results.map((candidate) => (
              <div
                key={candidate.candidate}
                onClick={() => setSelectedCandidate(candidate)}
                className="flex flex-row bg-base-100 border border-base-300 rounded-2xl p-2 md:p-6 hover:shadow-md transition cursor-pointer sm:gap-6 items-center sm:items-center group border-l-4 border-l-transparent hover:border-l-primary">
                <div className="w-10 h-10 sm:w-20 sm:h-20 mr-4 sm:mr-0">
                  <CircularProgressbar
                    value={candidate.score}
                    text={`${candidate.score}%`}
                    styles={buildStyles({
                      pathColor:
                        candidate.score >= 80 ? 'green' : candidate.score >= 60 ? '#FCBF49' : 'red',
                      textColor: 'oklch(var(--bc))',
                      textSize: '24px',
                      trailColor: 'oklch(var(--b3))'
                    })}
                  />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex flex-row sm:flex-row items-center sm:items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                    <h3 className="font-bold text-xs sm:text-lg text-base-content group-hover:text-primary transition-colors truncate sm:w-auto">
                      {candidate.candidate}
                    </h3>
                  </div>
                  <p className="text-base-content/75 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {candidate.analysis.reason}
                  </p>
                  <div className="flex flex-col gap-2 sm:my-1">
                    <div className="flex items-center justify-start gap-2 sm:justify-start text-xs text-base-content/60 font-medium truncate">
                      <span>{candidate.metadata.years_of_experience} yrs exp</span>
                      <span>{candidate.metadata.location}</span>
                    </div>
                    <div className="flex items-center justify-start gap-2 sm:justify-start text-xs text-base-content/60 font-medium">
                      <span className="badge badge-neutral badge-xs sm:badge-sm uppercase tracking-tighter">
                        Rank #{candidate.rank}
                      </span>
                      <span
                        className={`badge badge-xs sm:badge-sm font-semibold ${
                          candidate.analysis.suitability_tag === 'Highly Recommended'
                            ? 'badge-success'
                            : candidate.analysis.suitability_tag === 'Medium Match'
                              ? 'badge-warning'
                              : 'badge-error'
                        }`}>
                        {candidate.analysis.suitability_tag === 'Highly Recommended'
                          ? 'High Match'
                          : candidate.analysis.suitability_tag}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:w-auto">
                  <button className="btn p-2 btn-ghost btn-sm sm:w-auto text-base-content/75 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    View Detail
                  </button>
                </div>
              </div>
            ))}
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
