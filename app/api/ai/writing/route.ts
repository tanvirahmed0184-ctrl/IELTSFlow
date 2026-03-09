import { NextRequest, NextResponse } from "next/server";
import { evaluateWriting } from "@/ai/writing-evaluator/evaluator";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attemptId, taskType, promptText, response, wordCount } = body;

    if (!taskType || !promptText || !response) {
      return NextResponse.json(
        { error: "Missing required fields: taskType, promptText, response" },
        { status: 400 }
      );
    }

    if (typeof response !== "string" || response.trim().length < 10) {
      return NextResponse.json(
        { error: "Response must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Call Gemini AI for evaluation
    const evaluation = await evaluateWriting(taskType, promptText, response);

    // If we have an attemptId, persist evaluation to database
    // This will fail gracefully if DB is not connected (dev mode)
    let savedEvaluationId: string | null = null;
    if (attemptId) {
      try {
        const savedEval = await prisma.writingEvaluation.create({
          data: {
            attemptId,
            taskAchievement: evaluation.criteria.taskAchievement,
            coherenceCohesion: evaluation.criteria.coherenceCohesion,
            lexicalResource: evaluation.criteria.lexicalResource,
            grammaticalRange: evaluation.criteria.grammaticalRange,
            overallBand: evaluation.overallBand,
            strengths: evaluation.strengths,
            weaknesses: evaluation.weaknesses,
            corrections: JSON.parse(JSON.stringify(evaluation.corrections)),
            vocabularySuggestions: JSON.parse(JSON.stringify(evaluation.vocabularySuggestions)),
            sampleRewrite: evaluation.sampleRewrite,
            examinerSummary: evaluation.examinerSummary,
            rawAiResponse: JSON.parse(JSON.stringify({ raw: evaluation.rawResponse })),
            modelVersion: evaluation.model,
          },
        });
        savedEvaluationId = savedEval.id;

        // Update attempt status and band score
        await prisma.writingAttempt.update({
          where: { id: attemptId },
          data: {
            status: "EVALUATED",
            submittedAt: new Date(),
          },
        });
      } catch {
        // DB not connected in dev — continue returning AI results
        console.warn("Could not save evaluation to database (DB may not be connected)");
      }
    }

    return NextResponse.json({
      success: true,
      evaluationId: savedEvaluationId,
      evaluation: {
        criteria: evaluation.criteria,
        overallBand: evaluation.overallBand,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        corrections: evaluation.corrections,
        vocabularySuggestions: evaluation.vocabularySuggestions,
        sampleRewrite: evaluation.sampleRewrite,
        examinerSummary: evaluation.examinerSummary,
      },
      meta: {
        model: evaluation.model,
        wordCount: wordCount ?? response.trim().split(/\s+/).filter(Boolean).length,
        evaluatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Writing evaluation error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
