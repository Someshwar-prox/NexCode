import { NextResponse } from "next/server";
import { readStore, writeStore, logEvent } from "@/lib/store";
import { verifierRun } from "@/lib/verifier";

export async function POST() {
  const s = await readStore();
  const verify = await verifierRun(s.plan);
  await writeStore({ verify });
  await logEvent("verifier", verify.status, verify.checks.map((c) => `${c.name}=${c.ok ? "ok" : "fail"}`).join(", "));
  return NextResponse.json(verify);
}
