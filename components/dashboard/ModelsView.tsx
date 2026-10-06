import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";

interface ModelsViewProps {
  meta: any;
  brain: any;
}

export function ModelsView({ meta, brain }: ModelsViewProps) {
  const routing = meta?.routing ?? [];

  return (
    <div className="grid lg:grid-cols-2 gap-3 h-full w-full overflow-y-auto pr-1 scrollbar-thin">
      {/* Left Column: Nebius AI Cloud & NVIDIA Model Routing */}
      <div className="space-y-3">
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#76b900] shadow-[0_0_8px_rgba(118,185,0,0.8)]" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                Nebius Platform & NVIDIA Routing
              </span>
            </div>
          }
          subtitle="Real-time model assignments per agent role and engineering task"
        >
          {/* Status Row */}
          <div className="grid sm:grid-cols-2 gap-2.5 mb-3">
            <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Nebius Token Factory
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {meta?.nebiusConfigured ? "Live NVIDIA LLM" : "Heuristic Demo"}
                </span>
              </div>
              <Badge variant={meta?.nebiusConfigured ? "nvidia" : "warning"} size="sm">
                {meta?.nebiusConfigured ? "CONNECTED" : "DEMO"}
              </Badge>
            </div>

            <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tavily Technical Docs
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {meta?.tavilyConfigured ? "Live Doc Engine" : "Heuristic Cache"}
                </span>
              </div>
              <Badge variant={meta?.tavilyConfigured ? "info" : "neutral"} size="sm">
                {meta?.tavilyConfigured ? "CONNECTED" : "CACHED"}
              </Badge>
            </div>
          </div>

          {/* Model Cards */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
              Agent Roles & Assigned Models
            </span>
            <div className="grid gap-2">
              {routing.map((r: any) => (
                <div key={r.agent} className="p-2.5 bg-white/80 rounded-xl border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold uppercase text-slate-900">{r.agent}</span>
                      <Badge variant="nvidia" size="sm">{r.role}</Badge>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">{r.model}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#76b900]" />
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Sandbox Execution Environment */}
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">Sandbox Isolation Guard</span>
            </div>
          }
        >
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs font-mono space-y-1.5 text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Execution Mode:</span>
              <span className="font-bold text-slate-900">{meta?.sandboxMode ?? "local-isolated"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Direct Push to Main:</span>
              <span className="text-rose-600 font-bold">BLOCKED (Enforced)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Secret Scanning:</span>
              <span className="text-emerald-600 font-bold">ACTIVE</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Right Column: Project Brain Knowledge & Skills */}
      <div className="space-y-3">
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">Project Brain Memory</span>
            </div>
          }
          subtitle="Persistent repository knowledge grounded in codebase scan"
        >
          {brain ? (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold text-slate-900 block mb-1.5">
                    Conventions ({brain.conventions?.length ?? 0})
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-700 font-mono">
                    {(brain.conventions ?? []).map((c: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-[#76b900] font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold text-slate-900 block mb-1.5">
                    Risk Modules ({brain.riskModules?.length ?? 0})
                  </span>
                  <ul className="space-y-1 text-[11px] text-rose-700 font-mono">
                    {(brain.riskModules ?? []).map((m: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-rose-500 font-bold">!</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Registered Skills */}
              {brain.skills && (
                <div className="p-3 bg-white/80 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold text-slate-900 block mb-2">
                    Registered Project Skills ({Object.keys(brain.skills).length})
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {Object.entries(brain.skills).map(([key, skill]: [string, any]) => (
                      <div key={key} className="p-2 bg-slate-50 rounded-lg border border-slate-200/40 text-xs">
                        <span className="font-bold text-slate-800 block text-[11px]">{skill.name}</span>
                        <p className="text-slate-500 text-[10px] mt-0.5 line-clamp-2">{skill.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">Loading Project Brain...</p>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
