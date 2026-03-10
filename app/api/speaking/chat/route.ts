import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, GEMINI_TEXT_MODEL } from "@/lib/gemini";
import { buildConversationPrompt } from "@/ai/speaking-evaluator/prompt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages = [],
      transcript,
      part = "PART_1",
    } = body as {
      messages?: Array<{ role: "examiner" | "user"; text: string }>;
      transcript?: string;
      part?: "PART_1" | "PART_2" | "PART_3";
    };

    const conv = [...messages];
    if (transcript && transcript.trim()) {
      conv.push({ role: "user" as const, text: transcript });
    }

    const prompt = buildConversationPrompt(conv, part);

    const client = getGeminiClient();
    const result = await client.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { temperature: 0.4, maxOutputTokens: 1024 },
    });

    const text = (result.text ?? "").trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const evaluation = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          type: "evaluation",
          evaluation,
        });
      } catch {
        /* fall through to text response */
      }
    }

    return NextResponse.json({
      type: "question",
      text,
    });
  } catch (e) {
    console.error("[speaking/chat]", e);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
