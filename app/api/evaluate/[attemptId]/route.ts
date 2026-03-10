import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { gradeAttempt } from "@/lib/scoring/deterministic-grader";

/**
 * POST /api/evaluate/[attemptId]
 * Hybrid evaluation: deterministic for Listening/Reading, AI for Writing.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrisma();
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const testAttempt = await prisma.testAttempt.findFirst({
      where: { id: attemptId, userId: dbUser.id },
      include: {
        answers: { include: { question: true } },
        test: true,
      },
    });

    const writingAttempt = await prisma.writingAttempt.findFirst({
      where: { id: attemptId, userId: dbUser.id },
      include: { prompt: true },
    });

    if (testAttempt) {
      const extractValue = (v: unknown): unknown => {
        if (v == null) return v;
        if (typeof v === "object" && "value" in v) return (v as { value: unknown }).value;
        if (typeof v === "object" && "selected" in v) return (v as { selected: unknown }).selected;
        return v;
      };
      const answers = testAttempt.answers.map((a) => ({
        userAnswer: extractValue(a.givenAnswer),
        correctAnswer: a.question.correctAnswer as unknown,
        acceptedAnswers: Array.isArray(a.question.acceptedAnswers)
          ? a.question.acceptedAnswers
          : null,
        points: a.question.points,
      }));

      const { correctCount, totalPoints, maxPoints, results } = gradeAttempt(answers);

      const bandScore = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 9 * 10) / 10 : 0;

      await prisma.testAttempt.update({
        where: { id: attemptId },
        data: {
          status: "EVALUATED",
          completedAt: new Date(),
          correctCount,
          totalCount: answers.length,
          rawScore: totalPoints,
          bandScore,
        },
      });

      const mcqResults = results.map((r, i) => ({
        questionNumber: i + 1,
        userAnswer: answers[i].userAnswer,
        correctAnswer: answers[i].correctAnswer,
        isCorrect: r.isCorrect,
      }));

      return NextResponse.json({
        module: testAttempt.test.module,
        correctCount,
        totalCount: answers.length,
        bandScore,
        mcqResults,
      });
    }

    if (writingAttempt) {
      const evalRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/ai/writing`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId,
            taskType: writingAttempt.prompt.taskType,
            promptText: writingAttempt.prompt.promptText,
            response: writingAttempt.response,
            wordCount: writingAttempt.wordCount,
          }),
        }
      );

      if (!evalRes.ok) {
        return NextResponse.json(
          { error: "Writing evaluation failed" },
          { status: 500 }
        );
      }

      const data = await evalRes.json();
      return NextResponse.json({
        module: "WRITING",
        evaluation: data.evaluation,
      });
    }

    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  } catch (e) {
    console.error("[api/evaluate/[attemptId]]", e);
    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }
}
