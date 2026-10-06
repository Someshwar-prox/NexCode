import { NextResponse } from "next/server";
import { readStore, writeStore, logEvent } from "@/lib/store";
import { builderRun } from "@/lib/builder";

export async function POST() {
  const s = await readStore();
  if (!s.plan) return NextResponse.json({ error: "approve a plan first" }, { status: 400 });
  const build = await builderRun(s.plan);
  await writeStore({ build });
  await logEvent("builder", "diff", `Changed ${build.changed.length} files (llm=${build.llm})`);
  return NextResponse.json(build);
}
