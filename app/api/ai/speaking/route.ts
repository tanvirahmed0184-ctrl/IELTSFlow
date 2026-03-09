import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, GEMINI_TEXT_MODEL } from "@/lib/gemini";
import { analyzeFluency } from "@/ai/speaking-evaluator/fluency-analysis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcripts, topic, totalDurationSecs } = body;

    if (!transcripts || !Array.isArray(transcripts) || transcripts.length === 0) {
      return NextResponse.json({ error: "transcripts array is required" }, { status: 400 });
    }

    const fullTranscript = transcripts.map((t: { part: string; text: string }) => `[${t.part}]: ${t.text}`).join("\n\n");
    const fluency = analyzeFluency(fullTranscript, totalDurationSecs ?? 600);

    const prompt = `You are a certified IELTS Speaking examiner with 15+ years of experience. Evaluate the following IELTS Speaking test transcript.

## TOPIC
${topic ?? "General IELTS Speaking Test"}

## TRANSCRIPT
${fullTranscript}

## FLUENCY DATA
- Words per minute: ${fluency.wordsPerMinute.toFixed(1)}
- Filler words: ${fluency.fillerWords.map((f) => `${f.word} (${f.count}x)`).join(", ") || "none detected"}

## EVALUATION INSTRUCTIONS
Score each criterion on the official IELTS 0.5 band scale (e.g. 5.0, 5.5, 6.0).

Return ONLY valid JSON:
{
  "fluencyCoherence": <number>,
  "lexicalResource": <number>,
  "grammaticalRange": <number>,
  "pronunciation": <number>,
  "overallBand": <number>,
  "fillerWordAnalysis": [{"word": "<string>", "count": <number>}],
  "pauseAnalysis": {"totalPauses": <number>, "averageDurationMs": <number>, "longestPauseMs": <number>},
  "pronunciationFeedback": ["<string>"],
  "vocabularyFeedback": ["<string>"],
  "grammarFeedback": ["<string>"],
  "suggestedStrategy": "<string>"
}

IMPORTANT: These are PREDICTED PRACTICE band scores. Provide at least 3 items for each feedback array. Band scores must be multiples of 0.5 between 0 and 9.`;

    const client = getGeminiClient();
    const result = await client.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { temperature: 0.3, maxOutputTokens: 3072 },
    });

    const rawText = result.text ?? "";
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    let evaluation;
    try {
      evaluation = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw: rawText }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      evaluation,
      fluencyMetrics: fluency,
      meta: { model: GEMINI_TEXT_MODEL, evaluatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Speaking evaluation error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
