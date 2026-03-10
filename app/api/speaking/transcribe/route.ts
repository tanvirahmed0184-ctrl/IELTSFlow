import { NextRequest, NextResponse } from "next/server";

export interface WordSegment {
  word: string;
  start: number;
  end: number;
}

export interface TranscribeResponse {
  text: string;
  words?: WordSegment[];
  segments?: Array<{ start: number; end: number; text: string; avg_logprob?: number }>;
}

/**
 * POST /api/speaking/transcribe
 * Groq Whisper - returns word-level timestamps for fluency/pronunciation tricks.
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("audio") as File | null;
    if (!file || !file.size) {
      return NextResponse.json(
        { error: "Audio file required" },
        { status: 400 }
      );
    }

    const body = new FormData();
    body.append("file", file);
    body.append("model", "whisper-large-v3-turbo");
    body.append("response_format", "verbose_json");
    body.append("timestamp_granularities[]", "word");
    body.append("timestamp_granularities[]", "segment");
    body.append("language", "en");
    body.append("temperature", "0");

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[speaking/transcribe] Groq error:", err);
      return NextResponse.json(
        { error: "Transcription failed" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      text?: string;
      words?: WordSegment[];
      segments?: Array<{ start: number; end: number; text: string; avg_logprob?: number }>;
    };

    return NextResponse.json({
      text: data.text ?? "",
      words: data.words ?? [],
      segments: data.segments ?? [],
    });
  } catch (e) {
    console.error("[speaking/transcribe]", e);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
