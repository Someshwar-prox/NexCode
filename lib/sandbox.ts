import { execFile } from "child_process";
import path from "path";
import { WS } from "./brain";

const ALLOWED = ["node", "npm"];

// Controlled workspace execution. Local mode runs allow-listed commands in
// data/workspace. Swap exec with Nebius Sandbox API when SANDBOX_MODE=nebius.
export function runCmd(cmd: string, args: string[], timeoutMs = 30000): Promise<{ code: number; out: string }> {
  if (!ALLOWED.includes(cmd)) return Promise.resolve({ code: 1, out: `blocked: ${cmd} not allow-listed` });
  return new Promise((resolve) => {
    execFile(cmd, args, { cwd: WS, timeout: timeoutMs }, (err, stdout, stderr) => {
      resolve({ code: err ? 1 : 0, out: (stdout + "\n" + stderr).slice(0, 8000) });
    });
  });
}

export async function readWorkspaceFile(rel: string) {
  const { promises: fs } = await import("fs");
  return fs.readFile(path.join(WS, rel), "utf8").catch(() => null);
}
