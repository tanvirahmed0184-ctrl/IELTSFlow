import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * GET /api/attempts/[attemptId]/test
 * Returns test content (sections, questions) for a TestAttempt.
 * Strips correctAnswer/acceptedAnswers. Validates user owns the attempt.
 */
export async function GET(
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

    const attempt = await prisma.testAttempt.findFirst({
      where: { id: attemptId, userId: dbUser.id },
      include: {
        test: {
          include: {
            sections: {
              orderBy: { order: "asc" },
              include: {
                questions: { orderBy: { order: "asc" } },
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    const test = attempt.test;
    const sections = test.sections.map((sec) => ({
      ...sec,
      questions: sec.questions.map((q) => {
        const { correctAnswer, acceptedAnswers, ...safe } = q;
        return safe;
      }),
    }));

    return NextResponse.json({
      id: test.id,
      title: test.title,
      description: test.description,
      module: test.module,
      variant: test.variant,
      difficulty: test.difficulty,
      durationMins: test.durationMins,
      totalQuestions: test.totalQuestions,
      isPractice: test.isPractice,
      sections,
    });
  } catch (e) {
    console.error("[api/attempts/[attemptId]/test]", e);
    return NextResponse.json({ error: "Failed to fetch test" }, { status: 500 });
  }
}
