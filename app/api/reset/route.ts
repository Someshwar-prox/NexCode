import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { DEMO_FILES } from "@/lib/demoSeed";
import { writeStore } from "@/lib/store";

export async function POST() {
  const ws = path.join(process.cwd(), "data", "workspace");
  await fs.rm(ws, { recursive: true, force: true });
  for (const [rel, content] of Object.entries(DEMO_FILES)) {
    const p = path.join(ws, rel);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, content);
  }
  const base: Record<string, string> = {};
  for (const [rel, content] of Object.entries(DEMO_FILES)) base[rel] = content;
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), "data", "baseline.json"), JSON.stringify(base, null, 2));
  await writeStore({ issue: "", plan: null, approved: false, build: null, verify: null, tavily: [], timeline: [] });
  return NextResponse.json({ ok: true });
}
