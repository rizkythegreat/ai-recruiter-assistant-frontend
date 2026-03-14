"use client";

import { Users, Upload, TrendingUp, Info, Search } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import Link from "next/link";
import { useApps } from "./hooks/useApps";

export default function Dashboard() {
  const { data, history } = useApps();

  const last24hCount = history.filter(h => (new Date().getTime() - new Date(h.created_at).getTime()) <= 86400000).length;
  const latestResults = history[0]?.results || [];
  const avgScore = latestResults.length 
    ? (latestResults.reduce((sum, c) => sum + c.score, 0) / latestResults.length).toFixed(1) 
    : 0;
  
  const stats = [
    { title: "Total CV in Database", value: data?.total, icon: Users, desc: "Indexed resumes" },
    { title: "Last Search Count", value: last24hCount, icon: Search, desc: "Last 24 hours" },
    { title: "Avg Candidate Score", value: avgScore, icon: TrendingUp, desc: "Based on AI ranking" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-base-content">Recruiter Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Overview of your AI recruitment assistant's metrics and actions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.desc}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <Link 
          href="/upload"
          className="btn btn-primary btn-lg flex-1 h-24 gap-3 text-lg"
        >
          <Upload className="w-6 h-6" />
          Upload New CV
        </Link>
        <Link 
          href="/ranking"
          className="btn btn-neutral btn-lg flex-1 h-24 gap-3 text-lg"
        >
          <TrendingUp className="w-6 h-6" />
          Start Ranking
        </Link>
      </div>

      <div className="p-6 bg-base-200 border-2 border-dashed border-base-300 rounded-2xl mt-4">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-info-content" />
          <h2 className="font-semibold text-base-content uppercase tracking-wider text-sm">System Note</h2>
        </div>
        <p className="text-base-content/80 text-sm leading-relaxed max-w-3xl">
          Welcome back! The AI model has been updated to provide better "Reasoning" on Candidate Detail pages. 
          Use the <strong>Start Ranking</strong> button to compare candidates against a new Job Description.
        </p>
      </div>
    </div>
  );
}

