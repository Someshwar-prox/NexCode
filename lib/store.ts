import { promises as fs } from "fs";
import path from "path";

const DATA = path.join(process.cwd(), "data");
const STORE = path.join(DATA, "store.json");

export type AgentEvent = {
  t: string;
  agent: string;
  kind: string;
  message: string;
};

export type RunState = {
  issue: string;
  plan: any | null;
  approved: boolean;
  build: any | null;
  verify: any | null;
  tavily: any[];
  timeline: AgentEvent[];
};

const empty: RunState = {
  issue: "",
  plan: null,
  approved: false,
  build: null,
  verify: null,
  tavily: [],
  timeline: [],
};

export async function readStore(): Promise<RunState> {
  try {
    const raw = await fs.readFile(STORE, "utf8");
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return { ...empty };
  }
}

export async function writeStore(patch: Partial<RunState>) {
  await fs.mkdir(DATA, { recursive: true });
  const cur = await readStore();
  const next = { ...cur, ...patch };
  await fs.writeFile(STORE, JSON.stringify(next, null, 2));
  return next;
}

export async function logEvent(agent: string, kind: string, message: string) {
  const cur = await readStore();
  const evt: AgentEvent = {
    t: new Date().toISOString(),
    agent,
    kind,
    message,
  };
  await writeStore({ timeline: [...cur.timeline.slice(-199), evt] });
  return evt;
}
