import React from "react";

export type PipelineStage = "understand" | "plan" | "approve" | "build" | "verify" | "deliver";

interface StepperProps {
  currentStage: PipelineStage;
  className?: string;
}

const STAGES: { id: PipelineStage; label: string; number: string }[] = [
  { id: "understand", label: "Understand", number: "01" },
  { id: "plan", label: "Plan", number: "02" },
  { id: "approve", label: "Approve", number: "03" },
  { id: "build", label: "Build", number: "04" },
  { id: "verify", label: "Verify", number: "05" },
  { id: "deliver", label: "Deliver", number: "06" },
];

export function Stepper({ currentStage, className = "" }: StepperProps) {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
  const activeStage = STAGES[currentIndex] ?? STAGES[0];

  return (
    <div className="shrink-0">
      {/* Mobile Compact Stepper Pill (< sm) */}
      <div className={`sm:hidden flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm ${className}`}>
        <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-mono font-bold">
          {activeStage.number}
        </span>
        <span className="text-xs font-semibold text-slate-800">{activeStage.label}</span>
        <span className="text-[10px] text-slate-400 font-mono">({currentIndex + 1}/6)</span>
      </div>

      {/* Desktop / Tablet Full Stepper (>= sm) */}
      <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-sm ${className}`}>
        {STAGES.map((s, idx) => {
          const isComplete = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-200 ${
                    isComplete
                      ? "bg-[#76b900] text-white"
                      : isCurrent
                      ? "bg-slate-900 text-white shadow-sm ring-2 ring-[#76b900]/40"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isComplete ? (
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.number
                  )}
                </span>
                <span
                  className={`text-[11px] hidden lg:inline font-medium transition-colors ${
                    isCurrent ? "text-slate-900 font-bold" : isComplete ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < STAGES.length - 1 && (
                <span
                  className={`w-2.5 h-px shrink-0 transition-colors ${
                    idx < currentIndex ? "bg-[#76b900]" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
