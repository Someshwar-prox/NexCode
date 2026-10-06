import React from "react";
import { PipelineStage } from "../ui/Stepper";

interface CommandBarProps {
  issue: string;
  setIssue: (val: string) => void;
  currentStage: PipelineStage;
  isBusy: boolean;
  busyTarget: string;
  meta: any;
  plan: any;
  approved: boolean;
  build: any;
  verify: any;
  onRunArchitect: () => void;
  onApprovePlan: () => void;
  onRunBuilder: () => void;
  onRunVerifier: () => void;
}

export function CommandBar({
  issue,
  setIssue,
  currentStage,
  isBusy,
  busyTarget,
  meta,
  plan,
  approved,
  build,
  verify,
  onRunArchitect,
  onApprovePlan,
  onRunBuilder,
  onRunVerifier,
}: CommandBarProps) {
  const quickPrompts = [
    "Allow users to cancel unpaid orders from Order Details. Owner-only. Restore inventory.",
    "Enforce owner-only authorization check on order cancellation with 403 response.",
    "Add regression test suite for order state machine transitions.",
  ];

  return (
    <div className="w-full shrink-0 z-20">
      <div className="glass-panel-elevated rounded-2xl p-2 sm:p-3 transition-all duration-200 shadow-[0_4px_24px_rgba(15,23,42,0.06)] border border-slate-200/80">
        {/* Main Input Field */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="flex items-start gap-2">
            <div className="pt-0.5 text-[#76b900] shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <textarea
              rows={1}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe the GitHub task to architect, implement, and verify..."
              className="w-full bg-transparent resize-none border-none text-[11px] sm:text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-relaxed font-sans"
            />
          </div>

          {/* Action Row & Stage Triggers */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-slate-200/60">
            {/* Quick Chips */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-xs">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Preset:
              </span>
              {quickPrompts.slice(0, 1).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setIssue(prompt)}
                  className="text-left text-[10px] sm:text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 px-2 py-0.5 rounded-lg truncate max-w-[140px] sm:max-w-[280px] transition-colors shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Stage Action Trigger */}
            <div className="flex items-center gap-1.5 ml-auto">
              {/* Telemetry Indicator */}
              <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-lg border border-slate-200/60">
                <span className={`w-1.5 h-1.5 rounded-full ${meta?.nebiusConfigured ? "bg-[#76b900]" : "bg-amber-500"}`} />
                <span>Nebius: {meta?.nebiusConfigured ? "Live" : "Heuristic"}</span>
              </div>

              {/* Primary Pipeline Actions */}
              {!plan ? (
                <button
                  onClick={onRunArchitect}
                  disabled={isBusy || !issue.trim()}
                  className="btn-nvidia text-xs font-semibold !py-1 !px-3 sm:!py-1.5 sm:!px-3.5 !rounded-xl"
                >
                  {isBusy && busyTarget === "/api/plan" ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Planning...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span>Run Architect</span>
                    </>
                  )}
                </button>
              ) : !approved ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={onRunArchitect}
                    disabled={isBusy}
                    className="btn-glass text-[10px] sm:text-[11px] !py-1 !px-2 text-slate-600 !rounded-xl"
                  >
                    Re-plan
                  </button>
                  <button
                    onClick={onApprovePlan}
                    disabled={isBusy}
                    className="btn-nvidia text-xs font-semibold !py-1 !px-2.5 sm:!py-1.5 sm:!px-3.5 !rounded-xl"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Approve</span>
                  </button>
                </div>
              ) : !build ? (
                <button
                  onClick={onRunBuilder}
                  disabled={isBusy}
                  className="btn-nvidia text-xs font-semibold !py-1 !px-3 sm:!py-1.5 sm:!px-3.5 !rounded-xl"
                >
                  {isBusy && busyTarget === "/api/build" ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Building...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <span>Run Builder</span>
                    </>
                  )}
                </button>
              ) : !verify ? (
                <button
                  onClick={onRunVerifier}
                  disabled={isBusy}
                  className="btn-nvidia text-xs font-semibold !py-1 !px-3 sm:!py-1.5 sm:!px-3.5 !rounded-xl"
                >
                  {isBusy && busyTarget === "/api/verify" ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Verify</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={onRunVerifier}
                    disabled={isBusy}
                    className="btn-glass text-[10px] sm:text-[11px] !py-1 !px-2 text-slate-700 !rounded-xl"
                  >
                    Re-verify
                  </button>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{verify.status.toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
