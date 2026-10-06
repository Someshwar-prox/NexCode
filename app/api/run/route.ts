import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await readStore());
}

export async function POST(req: Request) {
  const { approved } = await req.json();
  return NextResponse.json(await writeStore({ approved: !!approved }));
}
