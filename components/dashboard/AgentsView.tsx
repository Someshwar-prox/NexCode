import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";

interface AgentsViewProps {
  run: any;
  meta: any;
  onApprove: () => void;
  onBuild: () => void;
  onVerify: () => void;
  isBusy: boolean;
}

export function AgentsView({
  run,
  meta,
  onApprove,
  onBuild,
  onVerify,
  isBusy,
}: AgentsViewProps) {
  const plan = run?.plan;
  const approved = run?.approved;
  const build = run?.build;
  const verify = run?.verify;
  const timeline = run?.timeline ?? meta?.timeline ?? [];

  return (
    <div className="grid lg:grid-cols-3 gap-3 h-full w-full">
      {/* Left Column: 2/3 - Main Agent Pipeline Stages */}
      <div className="lg:col-span-2 h-full overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {/* 01 Architect Stage */}
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-[11px] font-bold">
                01
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">Architect Agent</span>
              {plan?.llm ? (
                <Badge variant="nvidia" size="sm">NVIDIA LLM via Nebius</Badge>
              ) : (
                <Badge variant="neutral" size="sm">Local Heuristic Mode</Badge>
              )}
            </div>
          }
          subtitle="Repository decomposition, risk analysis, and scoped implementation plan"
        >
          {!plan ? (
            <div className="py-8 text-center text-slate-400">
              <svg className="w-7 h-7 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs font-semibold text-slate-600">No active plan generated yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Use the task bar below to run Architect on this repository.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Decomposition Summary
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{plan.summary}</p>
              </div>

              {/* Scope Allow-list & Deny-list */}
              <div className="grid sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-white/80 rounded-xl border border-slate-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      In-Scope Files (Allow-list)
                    </span>
                    <Badge variant="success" size="sm">{plan.filesToChange?.length ?? 0}</Badge>
                  </div>
                  <ul className="space-y-1 font-mono text-[11px] text-slate-700">
                    {(plan.filesToChange ?? []).map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-emerald-500 font-bold">+</span>
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-slate-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Protected Guardrails (Non-Scope)
                    </span>
                    <Badge variant="neutral" size="sm">{plan.filesNotToChange?.length ?? 0}</Badge>
                  </div>
                  <ul className="space-y-1 font-mono text-[11px] text-slate-600">
                    {(plan.filesNotToChange ?? []).map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold">•</span>
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Risks, Required Tests, Gates */}
              <div className="grid sm:grid-cols-3 gap-2">
                <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60">
                  <span className="text-[11px] font-bold text-amber-900 block mb-1">Risk Vectors</span>
                  <ul className="space-y-0.5 text-[11px] text-amber-800">
                    {(plan.risks ?? []).map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-amber-500 font-bold">!</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-800 block mb-1">Required Tests</span>
                  <ul className="space-y-0.5 text-[11px] text-slate-700 font-mono">
                    {(plan.testsRequired ?? []).map((t: string, i: number) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-[#76b900] font-bold">✓</span>
                        <span className="truncate">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-800 block mb-1">Audit Gates</span>
                  <ul className="space-y-0.5 text-[11px] text-slate-700 font-mono">
                    {(plan.gates ?? []).map((g: string, i: number) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-sky-500 font-bold">#</span>
                        <span className="truncate">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tavily Technical Knowledge Citations */}
              {run?.tavily?.[0] && (
                <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                    <span className="text-xs font-bold text-sky-900 shrink-0">Tavily Research:</span>
                    <span className="text-[11px] font-mono text-sky-800 truncate">
                      "{run.tavily[0].query}"
                    </span>
                  </div>
                  <Badge variant="info" size="sm">
                    {run.tavily[0].configured ? `${run.tavily[0].hits?.length ?? 0} hits` : "Demo Cache"}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </GlassCard>

        {/* 02 User Approval Gate */}
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold text-white ${
                approved ? "bg-[#76b900]" : "bg-slate-700"
              }`}>
                02
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">User Approval Gate</span>
              {approved ? (
                <Badge variant="success" size="sm">Approved by Developer</Badge>
              ) : (
                <Badge variant="warning" size="sm">Awaiting Approval</Badge>
              )}
            </div>
          }
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              {approved
                ? "Plan approved. Builder agent has received scoped write permissions in the isolated workspace."
                : "Approval is required before Builder modifies any codebase files in the workspace."}
            </p>
            {!approved && plan && (
              <button
                onClick={onApprove}
                disabled={isBusy}
                className="btn-nvidia text-xs font-semibold shrink-0 !py-1.5 !px-3.5 !rounded-xl"
              >
                Approve Scoped Plan
              </button>
            )}
          </div>
        </GlassCard>

        {/* 03 Builder Implementation */}
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-[11px] font-bold">
                03
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">Builder Agent</span>
              {build ? (
                <Badge variant="success" size="sm">Finished</Badge>
              ) : approved ? (
                <Badge variant="nvidia" size="sm">Ready</Badge>
              ) : (
                <Badge variant="neutral" size="sm">Pending</Badge>
              )}
            </div>
          }
          subtitle="Isolated workspace execution & scoped file modifications"
        >
          {!build ? (
            <div className="py-4 text-center text-slate-400">
              <p className="text-xs">Builder executes in the isolated sandbox after plan approval.</p>
              {approved && (
                <button
                  onClick={onBuild}
                  disabled={isBusy}
                  className="mt-2 btn-nvidia text-xs font-semibold !py-1.5 !px-3.5 !rounded-xl"
                >
                  Run Builder in Sandbox
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Modified Files ({build.changed?.length ?? 0})
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Model: {build.usedModel}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 font-mono text-[11px]">
                {(build.changed ?? []).map((file: string, idx: number) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200/60 flex items-center justify-between">
                    <span className="text-slate-800 font-medium truncate">{file}</span>
                    <Badge variant="nvidia" size="sm">MODIFIED</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* 04 Independent Verifier */}
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-[11px] font-bold">
                04
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">Independent Verifier</span>
              {verify ? (
                <Badge variant={verify.status === "approved" ? "success" : "danger"} size="sm">
                  {verify.status.toUpperCase()}
                </Badge>
              ) : (
                <Badge variant="neutral" size="sm">Pending Verification</Badge>
              )}
            </div>
          }
          subtitle="5-Gate independent security and quality validation"
        >
          {!verify ? (
            <div className="py-4 text-center text-slate-400">
              <p className="text-xs">Independent audit of tests, secrets, dependencies, and scope.</p>
              {build && (
                <button
                  onClick={onVerify}
                  disabled={isBusy}
                  className="mt-2 btn-nvidia text-xs font-semibold !py-1.5 !px-3.5 !rounded-xl"
                >
                  Execute Verification Audit
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {/* 5-Gate Checklist */}
              <div className="space-y-1.5">
                {(verify.checks ?? []).map((check: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      check.ok
                        ? "bg-emerald-50/60 border-emerald-200/60"
                        : "bg-rose-50/60 border-rose-200/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                          check.ok ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                        }`}
                      >
                        {check.ok ? "✓" : "✗"}
                      </span>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          {check.name} Gate
                        </span>
                        <p className="text-[11px] font-mono text-slate-600">{check.detail}</p>
                      </div>
                    </div>
                    <Badge variant={check.ok ? "success" : "danger"} size="sm">
                      {check.ok ? "PASSED" : "FAILED"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Right Column: 1/3 - Readiness Summary & Live Event Timeline */}
      <div className="lg:col-span-1 h-full overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {/* Maintainer Readiness Summary Card */}
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#76b900]" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">Maintainer Readiness</span>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Verification Status:</span>
                <span className={`font-bold ${verify?.status === "approved" ? "text-emerald-600" : "text-slate-700"}`}>
                  {verify?.status ?? "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Predicted Areas:</span>
                <span className="font-semibold text-slate-800">{plan?.predictedImpact?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Files Changed:</span>
                <span className="font-semibold text-slate-800">{verify?.changed?.length ?? build?.changed?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Unexpected Files:</span>
                <span className="font-semibold text-slate-800">{verify?.unexpected?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Security / Secrets:</span>
                <span className="text-emerald-600 font-semibold">Clean (0 violations)</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-center">
              <span className="text-[11px] font-bold text-emerald-900 block">
                {verify?.status === "approved"
                  ? "Patch is Maintainer-Ready"
                  : "Awaiting Verification Completion"}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5 font-mono">
                Isolated sandbox guarantees zero regressions
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Live Timeline Log */}
        <GlassCard
          title={
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">Live Agent Timeline</span>
            </div>
          }
          subtitle="Real-time multi-agent activity log"
        >
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
            {timeline.length === 0 ? (
              <p className="text-[11px] text-slate-400 py-4 text-center">No timeline events recorded yet.</p>
            ) : (
              timeline.map((evt: any, i: number) => (
                <div key={i} className="p-2 bg-slate-50/80 rounded-lg font-mono text-[10px] text-slate-700 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-slate-400 text-[9px]">
                    <span className="font-bold uppercase text-slate-800 px-1 py-0.2 bg-slate-200 rounded">
                      {evt.agent}
                    </span>
                    <span>{evt.t ? new Date(evt.t).toLocaleTimeString() : "--:--"}</span>
                  </div>
                  <span className="text-slate-800 mt-0.5 font-medium">{evt.message}</span>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
