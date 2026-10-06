import { NextResponse } from "next/server";
import { architectPlan } from "@/lib/architect";
import { tavilySearch } from "@/lib/tavily";
import { writeStore, logEvent } from "@/lib/store";

export async function POST(req: Request) {
  const { issue } = await req.json();
  const plan = await architectPlan(issue ?? "");
  let tavily: any = null;
  if (plan.tavilyNeeded && plan.tavilyQuery) {
    const r = await tavilySearch(plan.tavilyQuery);
    tavily = { query: plan.tavilyQuery, ...r };
  }
  await writeStore({ issue, plan, approved: false, tavily: tavily ? [tavily] : [] });
  await logEvent("architect", "plan", `Plan created (llm=${plan.llm})`);
  return NextResponse.json({ plan, tavily });
}
