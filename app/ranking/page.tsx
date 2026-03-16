'use client';

import {
  Search,
  BrainCircuit,
  X,
  CheckSquare,
  User,
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { rankCandidates } from '@/services/ranking.service';
import type { RankedCandidate } from '@/types/api';
import { useApps } from '../hooks/useApps';

const JOB_PRESETS = [
  {
    icon: '🧠',
    label: 'Data Scientist',
    title: 'Data Scientist / ML Engineer',
    description: `We are looking for a Data Scientist to join our team and help us turn data into actionable insights.

Requirements:
- Proficiency in Python (Pandas, NumPy, Scikit-Learn, TensorFlow)
- Experience with machine learning algorithms (regression, classification, clustering)
- Ability to perform data analysis, feature engineering, and model evaluation
- Familiarity with SQL for data querying
- Experience with data visualization tools (Tableau, Matplotlib, Seaborn)
- Strong analytical and problem-solving skills

Nice to have:
- Background in engineering or science fields
- Experience with predictive modeling in industrial or e-commerce settings`
  },
  {
    icon: '⚙️',
    label: 'Backend Engineer',
    title: 'Senior Backend Engineer',
    description: `We are hiring a Senior Backend Engineer to design and scale our distributed backend systems.

Requirements:
- 5+ years of experience in backend development
- Expert-level proficiency in Go or Python
- Strong experience with cloud platforms (AWS, GCP) and containerization (Docker, Kubernetes)
- Deep knowledge of databases: PostgreSQL, Redis, MongoDB
- Experience building microservices with gRPC or REST
- Familiarity with CI/CD pipelines and DevOps practices

Nice to have:
- AWS or Kubernetes certifications
- Experience with Kafka or event-driven architecture`
  },
  {
    icon: '☁️',
    label: 'DevOps Engineer',
    title: 'DevOps / Cloud Infrastructure Engineer',
    description: `We are looking for a DevOps Engineer to automate, scale, and maintain our cloud infrastructure.

Requirements:
- Hands-on experience with Infrastructure as Code (Terraform, Ansible)
- Proficiency with CI/CD tools: Jenkins, GitHub Actions, or GitLab CI
- Experience with AWS or Google Cloud Platform (GCP)
- Knowledge of monitoring and observability tools (Prometheus, Grafana)
- Solid understanding of Linux systems and networking

Nice to have:
- Experience managing multi-region cloud deployments
- Background in system administration or on-premise infrastructure`
  },
  {
    icon: '💻',
    label: 'Full-Stack Dev',
    title: 'Junior Full-Stack Developer',
    description: `We are looking for a motivated Junior Full-Stack Developer to build and maintain web applications.

Requirements:
- Proficiency in JavaScript/ES6, HTML, and CSS
- Experience with Node.js and Express for backend development
- Familiarity with MongoDB or MySQL
- Basic understanding of REST API design
- Experience with Git and version control workflows

Nice to have:
- Experience with Java Spring Boot
- Familiarity with frontend frameworks such as React or Vue.js
- Strong academic background in Computer Science or Information Systems`
  },
  {
    icon: '🎨',
    label: 'Frontend Dev',
    title: 'Senior Frontend Developer (React/Next.js)',
    description: `We are seeking a skilled Frontend Developer to build fast, responsive, and accessible web applications.

Requirements:
- 3+ years of experience with React and Next.js
- Strong command of TypeScript and Tailwind CSS
- Experience with state management (Redux, Zustand, or Context API)
- Ability to write unit and integration tests (Jest, Cypress)
- Understanding of Core Web Vitals and performance optimization

Nice to have:
- Experience building and maintaining UI component libraries
- Proficiency in Figma for UI/UX design collaboration
- Experience with Framer Motion or animation libraries`
  }
];

export default function RankingPage() {
  const { userId } = useApps();
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
              className="flex items-center gap-2 px-4 py-2.5 bg-base-100 border border-base-300 rounded-xl text-sm font-medium text-base-content hover:border-primary hover:bg-primary/5 hover:text-primary transition-all shrink-0 snap-start group">
              <span className="text-base">{preset.icon}</span>
              <span>{preset.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-base-content/30 group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
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

      {rankError && (
        <div role="alert" className="alert alert-error">
          <AlertCircle className="w-5 h-5" />
          <span>{rankError}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => setRankError(null)}>
            Dismiss
          </button>
        </div>
      )}

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

      {/* Candidate Detail Modal Implementation */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center">
          {/* Backdrop dengan overscroll-none untuk mencegah scroll bocor ke background */}
          <div
            className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm"
            onClick={() => setSelectedCandidate(null)}
          />

          <div
            className="relative bg-base-100 w-full max-w-4xl 
            /* Solusi Tinggi Mobile: Gunakan dvh agar tidak terpotong address bar */
            h-[92dvh] sm:h-auto sm:max-h-[90vh] 
            rounded-t-4xl sm:rounded-3xl 
            overflow-hidden shadow-2xl border border-base-300 flex flex-col
            transition-all duration-300 ease-out transform translate-y-0">
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
                  <p className="text-[10px] sm:text-sm text-base-content/60 font-medium uppercase tracking-wider">
                    Candidate Analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="btn btn-ghost btn-circle btn-sm bg-base-200 sm:bg-transparent">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 pb-34 sm:pb-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {/* Main Info */}
                <div className="md:col-span-2 flex flex-col gap-6 order-2 md:order-1">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                      AI Matching Reason
                    </h3>
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
                      {selectedCandidate.metadata.top_skills.map((skill) => (
                        <span
                          key={skill}
                          className="badge badge-white border-base-300 shadow-sm py-3 px-4 font-medium text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-base-200/50 rounded-2xl p-4 border border-base-300">
                      <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Experience</p>
                      <p className="text-lg sm:text-xl font-bold">
                        {selectedCandidate.metadata.years_of_experience} Yrs
                      </p>
                    </div>
                    <div className="bg-base-200/50 rounded-2xl p-4 border border-base-300">
                      <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Location</p>
                      <p className="text-sm sm:text-base font-bold truncate">
                        {selectedCandidate.metadata.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sidebar / Score: Di mobile muncul di atas (order-1) agar info utama langsung terlihat */}
                <div className="flex flex-col gap-4 order-1 md:order-2">
                  <div className="bg-linear-to-br from-primary to-primary-focus text-primary-content rounded-4xl p-6 text-center shadow-xl shadow-primary/20">
                    <p className="text-[10px] font-bold uppercase mb-4 opacity-80 tracking-widest">
                      Matching Score
                    </p>
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                      <CircularProgressbar
                        value={selectedCandidate.score}
                        text={`${selectedCandidate.score}%`}
                        styles={buildStyles({
                          pathColor: 'white',
                          textColor: 'white',
                          trailColor: 'rgba(255,255,255,0.2)',
                          textSize: '26px'
                        })}
                      />
                    </div>
                    <div
                      className={`text-[10px] font-bold px-4 py-1.5 rounded-full inline-block bg-white/20 backdrop-blur-md border border-white/30`}>
                      {selectedCandidate.analysis.suitability_tag}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Action Buttons untuk Mobile */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-base-100 via-base-100 to-transparent sm:relative sm:p-8 sm:bg-none flex flex-col gap-3">
              <button className="btn btn-primary w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/30">
                Contact Candidate
              </button>
              <button className="btn btn-ghost sm:btn-outline w-full h-12 rounded-xl text-base font-bold">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
