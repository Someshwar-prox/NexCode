"use client";
import React, { useState } from "react";
import { GlassCard } from "./ui/GlassCard";
import { Badge } from "./ui/Badge";

interface RuntimeFlowProps {
  flow: any;
}

export function Flow({ flow }: RuntimeFlowProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  if (!flow) {
    return (
      <div className="h-full flex items-center justify-center text-center text-slate-400">
        <p className="text-xs">No runtime flow data available.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-3 h-full w-full overflow-y-auto pr-1 scrollbar-thin">
      {/* Left Column: 2/3 - Step Progression Sequence */}
      <div className="lg:col-span-2 space-y-3">
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#76b900] shadow-[0_0_8px_rgba(118,185,0,0.8)]" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                Runtime Flow Replay — {flow.journey}
              </span>
            </div>
          }
          subtitle="Semantic execution trace through frontend components, route handlers, and data services"
        >
          {/* Step Progression Rail */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-1">
              Execution Sequence ({flow.after?.length ?? 0} Steps)
            </span>
            <div className="space-y-1.5">
              {(flow.after ?? []).map((step: string, idx: number) => {
                const isSelected = activeStep === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(isSelected ? null : idx)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : "bg-white/80 hover:bg-slate-50 border-slate-200/60 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                          isSelected ? "bg-[#76b900] text-slate-900" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className={`text-xs font-medium ${isSelected ? "text-white" : "text-slate-800"}`}>
                        {step}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider ${
                        isSelected ? "text-[#76b900]" : "text-slate-400"
                      }`}
                    >
                      {idx === 0
                        ? "UI Trigger"
                        : idx === (flow.after?.length ?? 0) - 1
                        ? "UI Render"
                        : "Service / Auth"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Right Column: 1/3 - Error Branches & Verification Provenance */}
      <div className="lg:col-span-1 space-y-3">
        {/* Error Branches Card */}
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">Tested Error Branches</span>
            </div>
          }
          subtitle="Negative test coverage verified in sandbox"
        >
          <div className="space-y-2">
            {(flow.branches ?? []).map((b: any, i: number) => (
              <div
                key={i}
                className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-amber-950 block">
                    {b.when}
                  </span>
                  <span className="font-mono text-[11px] text-amber-800 mt-0.5 block">
                    {b.result}
                  </span>
                </div>
                <Badge variant="warning" size="sm">TESTED</Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Provenance Card */}
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">Flow Provenance</span>
            </div>
          }
        >
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-mono text-[11px] text-slate-600 space-y-1.5">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Source</span>
              <span className="text-slate-800">{flow.source}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200/40 flex items-center justify-between">
              <span>Environment</span>
              <span className="text-[#76b900] font-bold">Sandbox Verified</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
