import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * POST /api/attempts/[attemptId]/answers
 * Save/upsert answers for a TestAttempt.
 * Body: { answers: Array<{ questionId: string; givenAnswer: string | string[] | number }> }
 */
export async function POST(
  request: NextRequest,
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
    });
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    const body = await request.json();
    const { answers } = body as {
      answers: Array<{ questionId: string; givenAnswer: string | string[] | number }>;
    };

    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: "answers array required" }, { status: 400 });
    }

    for (const { questionId, givenAnswer } of answers) {
      if (!questionId) continue;
      const payload = typeof givenAnswer === "object" && givenAnswer !== null && !Array.isArray(givenAnswer)
        ? givenAnswer
        : { value: givenAnswer };
      await prisma.answer.upsert({
        where: {
          attemptId_questionId: { attemptId, questionId },
        },
        create: {
          attemptId,
          questionId,
          givenAnswer: payload as object,
        },
        update: { givenAnswer: payload as object },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/attempts/[attemptId]/answers]", e);
    return NextResponse.json({ error: "Failed to save answers" }, { status: 500 });
  }
}
