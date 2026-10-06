import React from "react";
import { PipelineStage } from "../ui/Stepper";

export type NavTab = "overview" | "agents" | "models" | "runtime";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentStage: PipelineStage;
  isBusy: boolean;
  statusText?: string;
  onReset: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  currentStage,
  isBusy,
  statusText,
  onReset,
}: NavbarProps) {
  const brandGlow = isBusy
    ? "bg-[#76b900] shadow-[0_0_12px_rgba(118,185,0,0.9)] animate-pulse"
    : currentStage === "verify" || currentStage === "deliver"
    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
    : currentStage === "plan"
    ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
    : "bg-[#76b900]";

  return (
    <header className="w-full rounded-2xl glass-nav z-30 flex flex-wrap items-center justify-between py-2 px-3 sm:px-5 gap-2 transition-all duration-200 shrink-0">
      {/* Brand & Tabs */}
      <div className="flex items-center gap-3 sm:gap-6 max-w-full overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <span className={`w-2 h-2 rounded-full transition-all duration-300 ${brandGlow}`} />
          <button
            onClick={() => setActiveTab("overview")}
            className="flex items-center text-base sm:text-lg font-bold tracking-tight text-slate-900 group"
          >
            <span>Nex</span>
            <span className="text-[#76b900] transition-colors group-hover:text-[#5c9400]">Code</span>
          </button>
        </div>

        {/* Scrollable View Switcher Tabs on mobile */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 overflow-x-auto no-scrollbar shrink">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-2.5 sm:px-3.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all duration-150 ${
              activeTab === "overview"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`px-2.5 sm:px-3.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all duration-150 ${
              activeTab === "agents"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Agents
          </button>
          <button
            onClick={() => setActiveTab("models")}
            className={`px-2.5 sm:px-3.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all duration-150 ${
              activeTab === "models"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Models
          </button>
          <button
            onClick={() => setActiveTab("runtime")}
            className={`px-2.5 sm:px-3.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all duration-150 ${
              activeTab === "runtime"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Flow
          </button>
        </nav>
      </div>

      {/* Right Actions: GitHub Workspace & Reset Demo */}
      <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
        {statusText && (
          <span className="hidden xl:inline-flex text-[10px] font-mono text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-lg border border-slate-200/60">
            {statusText}
          </span>
        )}

        {/* GitHub Connection Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-medium shadow-sm hover:bg-slate-800 transition-colors cursor-pointer">
          <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="hidden sm:inline">demo-shop</span>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={onReset}
          disabled={isBusy}
          title="Reset demo workspace"
          className="btn-glass text-xs font-semibold !px-2.5 !py-1 text-slate-700 !rounded-lg shrink-0"
        >
          <svg className={`w-3 h-3 text-slate-500 ${isBusy ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}
