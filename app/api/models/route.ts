import { NextResponse } from "next/server";
import { modelStatus } from "@/lib/config";
import { readStore } from "@/lib/store";
import { runtimeFlow } from "@/lib/impact";

export async function GET() {
  return NextResponse.json({ ...modelStatus(), timeline: (await readStore()).timeline, flow: runtimeFlow() });
}
