"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Upload, TrendingUp, Search, History, Menu, X } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    { title: "Candidates", href: "/candidates", icon: Users },
    { title: "Upload Center", href: "/upload", icon: Upload },
    { title: "AI Ranking", href: "/ranking", icon: TrendingUp },
    { title: "History", href: "/history", icon: History },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-base-100 border-b border-base-300 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
            <TrendingUp className="text-primary-content w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-base-content">RecruitAI</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          aria-label="menu"
          className="btn btn-ghost btn-sm"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-base-300 bg-base-100 flex flex-col transition-transform duration-300 lg:sticky lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
              <TrendingUp className="text-primary-content w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-base-content">RecruitAI</span>
          </div>
          <button
            aria-label="close"
            onClick={() => setIsOpen(false)}
            className="lg:hidden btn btn-ghost btn-circle btn-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-primary bg-base-200"
                    : "text-slate-600 hover:bg-base-200 hover:text-primary"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-base-300 hidden">
          <div className="bg-base-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-base-content/50 uppercase mb-2">Plan: Professional</p>
            <div className="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[70%] transition-all duration-1000" />
            </div>
            <p className="text-xs text-base-content/70 mt-2">1,248 / 2,000 CVs used</p>
          </div>
        </div>
      </aside>
    </>
  );
}
