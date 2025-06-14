import { NextRequest, NextResponse } from "next/server";
import { askAboutTranscript } from "@/app/actions/ask";

export async function POST(req: NextRequest) {
  const { question, transcript } = await req.json();
  const answer = await askAboutTranscript(question, transcript);
  return NextResponse.json({ answer });
}
