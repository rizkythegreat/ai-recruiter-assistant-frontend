import { RankedCandidate } from '@/types/api';
import { User, X, CheckSquare, AlertCircle, Sparkles } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CandidateDetailModalProps {
  candidate: RankedCandidate;
  onClose: () => void;
}

export default function CandidateDetailModal({ candidate, onClose }: CandidateDetailModalProps) {
  return (
    <div className="fixed inset-0 z-70 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative bg-base-100 w-full max-w-4xl 
        h-[92dvh] sm:h-auto sm:max-h-[90vh] 
        rounded-t-4xl sm:rounded-3xl 
        overflow-hidden shadow-2xl border border-base-300 flex flex-col
        transition-all duration-300 ease-out transform translate-y-0">
        {/* Mobile Handle Bar */}
        <div className="w-12 h-1.5 bg-base-300 rounded-full mx-auto my-3 sm:hidden" />

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 px-6 py-4 sm:p-8 border-b border-base-300 flex items-center justify-between bg-base-100/80 backdrop-blur-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-base-content leading-tight truncate max-w-45 sm:max-w-none">
                {candidate.candidate}
              </h2>
              <p className="text-[10px] sm:text-sm text-base-content/60 font-medium uppercase tracking-wider">
                Candidate Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm bg-base-200 sm:bg-transparent">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 pb-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Score Card - Sticky on Desktop */}
            <div className="flex flex-col gap-4 order-2 md:order-1 sm:sticky sm:top-0 self-start">
              <div className="bg-linear-to-bl from-primary to-primary-focus text-primary-content rounded-4xl p-6 text-center shadow-xl shadow-primary/20">
                <p className="text-[10px] font-bold uppercase mb-4 opacity-80 tracking-widest">
                  Matching Score
                </p>
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                  <CircularProgressbar
                    value={candidate.score}
                    text={`${candidate.score}%`}
                    styles={buildStyles({
                      pathColor: 'white',
                      textColor: 'white',
                      trailColor: 'rgba(255,255,255,0.2)',
                      textSize: '26px'
                    })}
                  />
                </div>
                <div className="text-[10px] font-bold px-4 py-1.5 rounded-full inline-block bg-white/20 backdrop-blur-md border border-white/30">
                  {candidate.analysis.suitability_tag}
                </div>
              </div>
            </div>

            {/* Main Info */}
            <div className="md:col-span-2 flex flex-col gap-6 order-2 md:order-1">
              {/* AI Assessment */}
              {(candidate.analysis.reason || candidate.analysis.summary) && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    AI Assessment
                  </h3>
                  <p className="text-sm sm:text-base text-base-content/90 leading-relaxed bg-base-200/50 p-4 rounded-2xl border border-base-300">
                    {candidate.analysis.reason || candidate.analysis.summary}
                  </p>
                </section>
              )}

              {/* Key Competencies */}
              <section className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-2 mb-4 text-primary font-bold text-sm">
                  <CheckSquare className="w-4 h-4" />
                  Key Competencies
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.metadata.top_skills.map((skill) => (
                    <span
                      key={skill}
                      className="badge badge-white border-base-300 shadow-sm py-3 px-4 font-medium text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Strengths */}
              {candidate.strengths && candidate.strengths.length > 0 && (
                <AnalysisSection
                  title="Strengths"
                  items={candidate.strengths}
                  icon={<CheckSquare className="w-4 h-4 text-success" />}
                  variant="success"
                />
              )}

              {/* Weaknesses */}
              {candidate.weaknesses && candidate.weaknesses.length > 0 && (
                <AnalysisSection
                  title="Areas for Development"
                  items={candidate.weaknesses}
                  icon={<AlertCircle className="w-4 h-4 text-warning" />}
                  variant="warning"
                />
              )}

              {/* Red Flags */}
              {candidate.red_flags && candidate.red_flags.length > 0 && (
                <AnalysisSection
                  title="Red Flags & Concerns"
                  items={candidate.red_flags}
                  icon={<AlertCircle className="w-4 h-4 text-error" />}
                  variant="error"
                />
              )}

              {/* AI Recommendation */}
              {candidate.analysis.recommendation && (
                <section className="bg-info/5 p-5 rounded-2xl border border-info/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-info" />
                    </div>
                    <h3 className="text-sm font-bold text-info">AI Recommendation</h3>
                  </div>
                  <p className="text-sm text-base-content/80 leading-relaxed">
                    {candidate.analysis.recommendation}
                  </p>
                </section>
              )}

              {/* Experience & Location */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-base-200/50 rounded-2xl p-4 border border-base-300">
                  <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Experience</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {candidate.metadata.years_of_experience} Yrs
                  </p>
                </div>
                <div className="bg-base-200/50 rounded-2xl p-4 border border-base-300">
                  <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Location</p>
                  <p className="text-sm sm:text-base font-bold truncate">
                    {candidate.metadata.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Analysis Section Component
interface AnalysisSectionProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  variant: 'success' | 'warning' | 'error';
}

function AnalysisSection({ title, items, icon, variant }: AnalysisSectionProps) {
  const variantClasses = {
    success: {
      bg: 'bg-success/5',
      border: 'border-success/20',
      iconBg: 'bg-success/20',
      bullet: 'bg-success'
    },
    warning: {
      bg: 'bg-warning/5',
      border: 'border-warning/20',
      iconBg: 'bg-warning/20',
      bullet: 'bg-warning'
    },
    error: {
      bg: 'bg-error/5',
      border: 'border-error/20',
      iconBg: 'bg-error/20',
      bullet: 'bg-error'
    }
  };

  const classes = variantClasses[variant];

  return (
    <section className={`${classes.bg} p-5 rounded-2xl border ${classes.border}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 ${classes.iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <h3 className={`text-sm font-bold text-${variant}`}>{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-base-content/80">
            <span className={`w-1.5 h-1.5 rounded-full ${classes.bullet} mt-2 shrink-0`} />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
