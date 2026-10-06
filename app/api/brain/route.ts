import { NextResponse } from "next/server";
import { scanBrain } from "@/lib/brain";

export async function GET() {
  return NextResponse.json(await scanBrain());
}
