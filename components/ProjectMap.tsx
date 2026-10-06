"use client";
import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { NodeInspector } from "./dashboard/NodeInspector";
import { Badge } from "./ui/Badge";

interface ProjectMapProps {
  nodes?: any[];
  edges?: any[];
  changed?: string[];
}

const NODE_COORDINATES: Record<string, { x: number; y: number }> = {
  "ui:OrderDetails": { x: 50, y: 150 },
  "api:orderDetails": { x: 310, y: 150 },
  "svc:orders": { x: 570, y: 50 },
  "svc:auth": { x: 570, y: 175 },
  "svc:inventory": { x: 570, y: 300 },
  "test:cancel": { x: 830, y: 150 },
};

function calculateLayout(nodes: any[]): Node[] {
  const fallbackCounts: Record<string, number> = {};

  return (nodes ?? []).map((n: any) => {
    let pos = NODE_COORDINATES[n.id];
    if (!pos) {
      const group = n.group ?? "service";
      const xMap: Record<string, number> = { frontend: 50, api: 310, service: 570, tests: 830 };
      const x = xMap[group] ?? 400;
      const count = fallbackCounts[group] ?? 0;
      fallbackCounts[group] = count + 1;
      pos = { x, y: 50 + count * 125 };
    }

    return {
      id: n.id,
      data: {
        label: n.label,
        group: n.group,
        file: n.file,
        risk: n.risk,
      },
      position: pos,
    };
  });
}

export function ProjectMap({ nodes = [], edges = [], changed = [] }: ProjectMapProps) {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const rfNodes = useMemo(() => {
    const baseNodes = calculateLayout(nodes);

    return baseNodes.map((n) => {
      const isChanged = changed?.includes(n.data.file);
      const isRisk = n.data.risk;

      let borderStyle = "1px solid rgba(203, 213, 225, 0.9)";
      let bgStyle = "rgba(255, 255, 255, 0.95)";
      let badgeColor = "#475569";

      if (isChanged) {
        borderStyle = "2px solid #76b900";
        bgStyle = "rgba(240, 253, 228, 0.98)";
        badgeColor = "#3f6300";
      } else if (isRisk) {
        borderStyle = "1.5px solid #f59e0b";
        bgStyle = "rgba(254, 243, 199, 0.95)";
        badgeColor = "#b45309";
      }

      return {
        ...n,
        style: {
          background: bgStyle,
          border: borderStyle,
          borderRadius: 12,
          padding: "8px 12px",
          width: 175,
          boxShadow: isChanged
            ? "0 4px 20px rgba(118, 185, 0, 0.25)"
            : "0 2px 8px rgba(15, 23, 42, 0.04)",
          color: "#0f172a",
          fontSize: "11px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        },
        data: {
          ...n.data,
          label: (
            <div>
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span
                  style={{ color: badgeColor }}
                  className="text-[9px] font-bold uppercase tracking-wider font-mono"
                >
                  {n.data.group}
                </span>
                {isChanged ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#76b900] animate-pulse" />
                ) : isRisk ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ) : null}
              </div>
              <div className="font-semibold text-slate-900 leading-tight">
                {n.data.label}
              </div>
              <div className="text-[9px] font-mono text-slate-500 truncate mt-0.5">
                {n.data.file}
              </div>
            </div>
          ),
        },
      };
    });
  }, [nodes, changed]);

  const rfEdges = useMemo(() => {
    return (edges ?? []).map((e: any, i: number) => ({
      id: `e-${e.from}-${e.to}-${i}`,
      source: e.from,
      target: e.to,
      animated: true,
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#94a3b8",
        width: 12,
        height: 12,
      },
    }));
  }, [edges]);

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      const found = (nodes ?? []).find((n: any) => n.id === node.id);
      setSelectedNode(found ?? null);
    },
    [nodes]
  );

  const handleDownloadCodebase = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            project: "demo-shop",
            nodes,
            edges,
            changed,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "nexcode-codebase-map.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-3 h-full w-full overflow-y-auto lg:overflow-hidden pr-1">
      {/* Visual Canvas (3 Columns) */}
      <div className="lg:col-span-3 h-[280px] sm:h-[360px] lg:h-full glass-panel-elevated rounded-2xl overflow-hidden relative flex flex-col border border-slate-200/80 shrink-0">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-white/70 backdrop-blur-md border-b border-slate-200/60 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#76b900]" />
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">
              Codebase Map
            </span>
            <Badge variant="neutral" size="sm">
              {nodes.length}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2.5 text-[10px] font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#76b900]" /> Changed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Risk Area
              </span>
            </div>
            <button
              onClick={handleDownloadCodebase}
              title="Download Codebase Architecture Map"
              className="btn-glass !py-1 !px-2 text-[10px] sm:text-[11px] font-medium !rounded-lg"
            >
              <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* React Flow Viewport */}
        <div className="flex-1 w-full h-full relative">
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-left"
          >
            <Background color="#94a3b8" gap={18} size={1} />
            <Controls className="!m-2 !rounded-xl scale-90 sm:scale-100" />
            <MiniMap
              nodeColor={(n) => (n.style?.background as string) || "#cbd5e1"}
              className="!m-2 !w-24 !h-16 hidden sm:block !rounded-xl"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Node Inspector (1 Column) */}
      <div className="lg:col-span-1 min-h-[160px] lg:h-full shrink-0">
        <NodeInspector
          node={selectedNode}
          changedFiles={changed}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  );
}
