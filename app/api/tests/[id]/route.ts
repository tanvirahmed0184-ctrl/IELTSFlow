import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

/**
 * GET /api/tests/[id]
 * Fetches Test with sections and questions.
 * CRITICAL: Strips correctAnswer and acceptedAnswers before returning to frontend.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prisma = getPrisma();

    const test = await prisma.test.findUnique({
      where: { id, isActive: true },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            questions: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

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
    console.error("[api/tests/[id]]", e);
    return NextResponse.json({ error: "Failed to fetch test" }, { status: 500 });
  }
}
