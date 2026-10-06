import { promises as fs } from "fs";
import path from "path";
import { SKILLS } from "./skills";

export const WS = path.join(process.cwd(), "data", "workspace");

export async function scanBrain() {
  let files: string[] = [];
  try {
    files = await walk(WS);
  } catch {
    files = [];
  }
  const rel = files.map((f) => path.relative(WS, f));

  const graph = {
    nodes: [
      { id: "ui:OrderDetails", label: "OrderDetails page", group: "frontend", file: "src/OrderDetails.jsx" },
      { id: "api:orderDetails", label: "GET order details", group: "api", file: "src/api.js" },
      { id: "svc:orders", label: "order service", group: "service", file: "src/orders.js" },
      { id: "svc:auth", label: "auth policy", group: "service", file: "src/auth.js", risk: true },
      { id: "svc:inventory", label: "inventory service", group: "service", file: "src/inventory.js", risk: true },
      { id: "test:cancel", label: "cancel tests", group: "tests", file: "tests/order.cancel.test.js" },
    ],
    edges: [
      { from: "ui:OrderDetails", to: "api:orderDetails" },
      { from: "api:orderDetails", to: "svc:orders" },
      { from: "api:orderDetails", to: "svc:auth" },
      { from: "svc:orders", to: "svc:inventory" },
      { from: "test:cancel", to: "api:orderDetails" },
    ],
  };

  return {
    stack: ["Node 22", "node:test"],
    files: rel,
    conventions: ["owner-only auth", "unpaid-only cancel", "inventory restore in same op", "no new deps", "branch, never main"],
    riskModules: ["src/auth.js", "src/inventory.js"],
    lintBuild: { test: "node --test tests/", lint: "scope + secret scan", build: "n/a (plain JS demo)" },
    skills: SKILLS,
    graph,
    generatedAt: new Date().toISOString(),
  };
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}
