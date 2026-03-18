import { ChevronRight } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import type { RankingHistoryItem, RankedCandidate } from '@/types/api';

interface CandidateSectionProps {
  selectedSession: RankingHistoryItem;
  setSelectedCandidate: (candidate: RankedCandidate) => void;
}

function CandidateSection({ selectedSession, setSelectedCandidate }: CandidateSectionProps) {
  return (
    <section className="pb-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h3 className="text-xs font-black uppercase tracking-widest text-base-content/70">
            Ranked Candidates
          </h3>
        </div>
        <span className="badge badge-neutral badge-sm font-bold">
          {selectedSession.results.length} Profiles
        </span>
      </div>

      <div className="grid gap-4 sm:gap-3">
        {selectedSession.results.map((candidate) => (
          <div
            key={candidate.candidate}
            onClick={() => setSelectedCandidate(candidate)}
            className="bg-base-100 border border-base-300 rounded-2xl p-4 hover:border-primary hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group active:scale-[0.98]">
            {/* Score Chart */}
            <div className="w-12 h-12 md:w-14 md:h-14 shrink-0">
              <CircularProgressbar
                value={candidate.score}
                text={`${candidate.score}`}
                styles={buildStyles({
                  pathColor:
                    candidate.score >= 80
                      ? '#22c55e'
                      : candidate.score >= 60
                        ? '#eab308'
                        : '#ef4444',
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
                <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded">
                  #{candidate.rank}
                </span>
                <h4 className="font-bold text-sm md:text-base text-base-content truncate group-hover:text-primary transition-colors">
                  {candidate.candidate}
                </h4>
              </div>

              {/* Tags Wrap for Mobile */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                <span
                  className={`text-[10px] font-black uppercase tracking-tighter ${
                    candidate.analysis.suitability_tag === 'Highly Recommended'
                      ? 'text-success'
                      : candidate.analysis.suitability_tag === 'Medium Match'
                        ? 'text-warning'
                        : 'text-error'
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
  );
}

export default CandidateSection;
