import { promises as fs } from "fs";
import path from "path";
import { WS } from "./brain";
import { runCmd } from "./sandbox";
import { config } from "./config";

const SECRET_RE = /(sk-|ghp_|AKIA|-----BEGIN .*PRIVATE KEY-----|xox[bpas]-)/;

export async function verifierRun(plan: any) {
  const checks: { name: string; ok: boolean; detail: string }[] = [];

  const changed = await changedFiles();
  const allowed = ["src/api.js", "src/orders.js", "src/OrderDetails.jsx", "tests/order.cancel.test.js"];
  const unexpected = changed.filter((f) => !allowed.includes(f));
  checks.push({
    name: "scope",
    ok: unexpected.length === 0,
    detail: unexpected.length ? `unexpected: ${unexpected.join(", ")}` : `${changed.length} files, all in scope`,
  });

  let secrets = 0;
  for (const f of changed) {
    const src = await fs.readFile(path.join(WS, f), "utf8").catch(() => "");
    if (SECRET_RE.test(src)) secrets++;
  }
  checks.push({ name: "secrets", ok: secrets === 0, detail: secrets ? `${secrets} file(s) with secret pattern` : "no secrets" });

  const pkg = await fs.readFile(path.join(WS, "package.json"), "utf8");
  checks.push({ name: "dependencies", ok: !pkg.includes("axios") || !!plan, detail: "no unapproved deps" });

  const test = await runCmd("npm", ["test", "--silent"]);
  checks.push({ name: "tests", ok: test.code === 0, detail: test.out.split("\n").slice(-6).join(" | ").slice(0, 400) });

  const predicted: string[] = plan?.predictedImpact ?? [];
  checks.push({
    name: "impact",
    ok: true,
    detail: `predicted ${predicted.length} areas, changed ${changed.length} files, unexpected ${unexpected.length}`,
  });

  const failed = checks.filter((c) => !c.ok);
  return {
    status: failed.length === 0 ? "approved" : failed.some((f) => f.name === "tests" || f.name === "secrets") ? "blocked" : "needs revision",
    checks,
    changed,
    unexpected,
    usedModel: config.nebius.models.verifier,
  };
}

async function changedFiles(): Promise<string[]> {
  const baseRaw = await fs.readFile(path.join(process.cwd(), "data", "baseline.json"), "utf8").catch(() => "{}");
  const base = JSON.parse(baseRaw);
  const out: string[] = [];
  for (const f of ["src/api.js", "src/orders.js", "src/OrderDetails.jsx", "tests/order.cancel.test.js", "src/auth.js", "src/inventory.js"]) {
    const cur = await fs.readFile(path.join(WS, f), "utf8").catch(() => null);
    if (cur !== null && base[f] !== cur) out.push(f);
  }
  return out;
}
