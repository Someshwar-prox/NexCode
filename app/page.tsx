"use client";
import React, { useEffect, useState } from "react";
import { Navbar, NavTab } from "@/components/dashboard/Navbar";
import { CommandBar } from "@/components/dashboard/CommandBar";
import { AgentsView } from "@/components/dashboard/AgentsView";
import { ModelsView } from "@/components/dashboard/ModelsView";
import { ProjectMap } from "@/components/ProjectMap";
import { Flow } from "@/components/RuntimeFlow";
import { Stepper, PipelineStage } from "@/components/ui/Stepper";

const DEMO_ISSUE =
  "Allow users to cancel unpaid orders from the Order Details page. Only the order owner can cancel. Cancellation restores inventory. Add frontend and backend tests.";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [brain, setBrain] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);
  const [run, setRun] = useState<any>(null);
  const [issue, setIssue] = useState(DEMO_ISSUE);
  const [busy, setBusy] = useState("");

  const refresh = async () => {
    try {
      const [b, m, r] = await Promise.all([
        fetch("/api/brain").then((x) => x.json()),
        fetch("/api/models").then((x) => x.json()),
        fetch("/api/run").then((x) => x.json()),
      ]);
      setBrain(b);
      setMeta(m);
      setRun(r);
    } catch (err) {
      console.error("Failed to refresh state:", err);
    }
  };

  useEffect(() => {
    fetch("/api/reset", { method: "POST" }).then(refresh);
  }, []);

  const call = async (url: string, body?: any) => {
    setBusy(url);
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body ?? {}),
      });
      await refresh();
    } catch (err) {
      console.error(`Error calling ${url}:`, err);
    } finally {
      setBusy("");
    }
  };

  const handleReset = async () => {
    setBusy("/api/reset");
    try {
      await fetch("/api/reset", { method: "POST" });
      await refresh();
      setActiveTab("overview");
    } finally {
      setBusy("");
    }
  };

  // Compute current pipeline stage
  let currentStage: PipelineStage = "understand";
  if (run?.verify?.status === "approved") {
    currentStage = "deliver";
  } else if (run?.verify) {
    currentStage = "verify";
  } else if (run?.build) {
    currentStage = "verify";
  } else if (run?.approved) {
    currentStage = "build";
  } else if (run?.plan) {
    currentStage = "approve";
  }

  const handleRunArchitect = async () => {
    await call("/api/plan", { issue });
    setActiveTab("agents");
  };

  const handleApprovePlan = async () => {
    await call("/api/run", { approved: true });
    setActiveTab("agents");
  };

  const handleRunBuilder = async () => {
    await call("/api/build");
    setActiveTab("agents");
  };

  const handleRunVerifier = async () => {
    await call("/api/verify");
    setActiveTab("agents");
  };

  return (
    <div className="min-h-screen md:h-screen md:max-h-screen w-full flex flex-col dot-matrix-bg p-2 sm:p-3.5 gap-2 sm:gap-2.5 max-w-[1720px] mx-auto select-none overflow-y-auto md:overflow-hidden">
      {/* Top Floating Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStage={currentStage}
        isBusy={!!busy}
        statusText={
          meta?.nebiusConfigured
            ? "Nebius: NVIDIA Live"
            : "Heuristic Demo Mode"
        }
        onReset={handleReset}
      />

      {/* Subheader: Title, Workspace Badge & Pipeline Stepper */}
      <div className="w-full flex flex-wrap items-center justify-between gap-1.5 shrink-0 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-[#e3f3c4] text-[#3f6300] border border-[#76b900]/30 shrink-0">
            NVIDIA × Nebius
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Workspace: <strong className="text-slate-800 font-mono text-[11px]">demo-shop</strong>
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 hidden sm:inline truncate">
            Visual Code Intelligence & Contribution Agent
          </h1>
        </div>

        {/* Global Pipeline Progress Stepper */}
        <Stepper currentStage={currentStage} />
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 min-h-[380px] md:min-h-0 w-full overflow-y-auto md:overflow-hidden relative pb-2 sm:pb-0">
        {activeTab === "overview" && brain && (
          <div className="h-full w-full">
            <ProjectMap
              nodes={brain.graph?.nodes}
              edges={brain.graph?.edges}
              changed={run?.verify?.changed ?? run?.build?.changed}
            />
          </div>
        )}

        {activeTab === "agents" && (
          <div className="h-full overflow-y-auto pr-1 scrollbar-thin">
            <AgentsView
              run={run}
              meta={meta}
              onApprove={handleApprovePlan}
              onBuild={handleRunBuilder}
              onVerify={handleRunVerifier}
              isBusy={!!busy}
            />
          </div>
        )}

        {activeTab === "models" && (
          <div className="h-full overflow-y-auto pr-1 scrollbar-thin">
            <ModelsView meta={meta} brain={brain} />
          </div>
        )}

        {activeTab === "runtime" && (
          <div className="h-full overflow-y-auto pr-1 scrollbar-thin">
            <Flow flow={meta?.flow} />
          </div>
        )}
      </main>

      {/* Docked Horizon-Style Command Bar */}
      <CommandBar
        issue={issue}
        setIssue={setIssue}
        currentStage={currentStage}
        isBusy={!!busy}
        busyTarget={busy}
        meta={meta}
        plan={run?.plan}
        approved={run?.approved}
        build={run?.build}
        verify={run?.verify}
        onRunArchitect={handleRunArchitect}
        onApprovePlan={handleApprovePlan}
        onRunBuilder={handleRunBuilder}
        onRunVerifier={handleRunVerifier}
      />
    </div>
  );
}
