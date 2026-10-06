import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";

interface NodeInspectorProps {
  node: any | null;
  changedFiles?: string[];
  onClose?: () => void;
}

export function NodeInspector({ node, changedFiles, onClose }: NodeInspectorProps) {
  if (!node) {
    return (
      <GlassCard
        title={
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Node Inspector</span>
          </div>
        }
        className="h-full"
      >
        <div className="py-12 text-center text-slate-400">
          <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <p className="text-xs font-medium">Click any node in the Project Map to inspect details</p>
        </div>
      </GlassCard>
    );
  }

  const isChanged = changedFiles?.includes(node.file);

  return (
    <GlassCard
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#76b900]" />
            <span className="font-semibold text-sm text-slate-900 truncate">{node.label}</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      }
      className="h-full flex flex-col justify-between"
    >
      <div className="space-y-3.5 text-xs">
        {/* Badges & Status */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="neutral">{node.group ?? "module"}</Badge>
          {node.risk && <Badge variant="warning">RISK-SENSITIVE</Badge>}
          {isChanged && <Badge variant="nvidia">MODIFIED BY BUILDER</Badge>}
        </div>

        {/* File Path */}
        <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-200/60 font-mono">
          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">
            File Location
          </span>
          <span className="text-slate-800 break-all">{node.file ?? "n/a"}</span>
        </div>

        {/* Node Details */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Node ID</span>
            <span className="font-mono text-slate-700">{node.id}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Category</span>
            <span className="text-slate-800 font-medium uppercase">{node.group ?? "Unknown"}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 font-medium">Risk Status</span>
            <span className={node.risk ? "text-amber-600 font-bold" : "text-emerald-600 font-medium"}>
              {node.risk ? "High Attention" : "Standard"}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
